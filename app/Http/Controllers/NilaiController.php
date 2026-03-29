<?php

namespace App\Http\Controllers;

use App\Models\Nilai;
use App\Models\Kelas;
use App\Models\KelasMahasiswa;
use App\Models\KomponenNilai;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class NilaiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = auth()->user();

        if ($user->hasRole('mahasiswa')) {
            // Mahasiswa: Lihat nilai sendiri
            $nilai = Nilai::with(['komponenNilai.kelas.mataKuliah', 'komponenNilai.kelas.dosen', 'kelasMahasiswa'])
                ->whereHas('kelasMahasiswa', function($q) use ($user) {
                    $q->where('mahasiswa_id', $user->id);
                })
                ->get()
                ->groupBy('komponenNilai.kelas_id');

            return Inertia::render('mahasiswa/nilai/index', [
                'nilai_per_kelas' => $nilai
            ]);
        }

        if ($user->hasRole('dosen')) {
            // Dosen: Daftar kelas untuk dikelola nilainya
            return Inertia::render('dosen/nilai/index', [
                'kelas' => Kelas::with(['mataKuliah', 'komponenNilai'])
                    ->where('dosen_id', $user->id)
                    ->get()
            ]);
        }

        abort(403);
    }

    /**
     * Show the form for creating a new resource (Input Nilai).
     */
    public function create(Request $request)
    {
        $request->validate([
            'kelas_id' => 'required|exists:kelas,id',
            'komponen_id' => 'required|exists:komponen_nilai,id',
        ]);

        $kelas = Kelas::where('id', $request->kelas_id)
                      ->where('dosen_id', auth()->id())
                      ->firstOrFail();

        $komponen = KomponenNilai::where('id', $request->komponen_id)
                                 ->where('kelas_id', $kelas->id)
                                 ->firstOrFail();

        $mahasiswas = KelasMahasiswa::with('mahasiswa')
            ->where('kelas_id', $kelas->id)
            ->get();

        // Ambil nilai yang sudah ada (jika ada)
        $existingNilai = Nilai::where('komponen_nilai_id', $komponen->id)
            ->whereIn('kelas_mahasiswa_id', $mahasiswas->pluck('id'))
            ->get()
            ->keyBy('kelas_mahasiswa_id');

        return Inertia::render('dosen/nilai/input', [
            'kelas' => $kelas->load('mataKuliah'),
            'komponen' => $komponen,
            'mahasiswas' => $mahasiswas,
            'existing_nilai' => $existingNilai
        ]);
    }

    /**
     * Store a newly created resource in storage (Save Scores).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'komponen_id' => 'required|exists:komponen_nilai,id',
            'nilai' => 'required|array',
            'nilai.*.kelas_mahasiswa_id' => 'required|exists:kelas_mahasiswa,id',
            'nilai.*.skor' => 'required|numeric|min:0|max:100',
            'nilai.*.catatan' => 'nullable|string',
        ]);

        $komponen = KomponenNilai::findOrFail($validated['komponen_id']);
        if ($komponen->kelas->dosen_id !== auth()->id()) {
            abort(403);
        }

        DB::transaction(function() use ($validated) {
            foreach ($validated['nilai'] as $item) {
                Nilai::updateOrCreate(
                    [
                        'kelas_mahasiswa_id' => $item['kelas_mahasiswa_id'],
                        'komponen_nilai_id' => $validated['komponen_id']
                    ],
                    [
                        'skor' => $item['skor'],
                        'catatan' => $item['catatan'] ?? null
                    ]
                );
            }
        });

        return redirect()->route('dosen.nilai.index')->with('success', 'Nilai berhasil disimpan.');
    }

    /**
     * Display the rekap view.
     */
    public function show(Request $request)
    {
        $request->validate(['kelas_id' => 'required|exists:kelas,id']);

        $kelas = Kelas::with(['mataKuliah', 'komponenNilai', 'kelasMahasiswa.mahasiswa', 'kelasMahasiswa.nilai'])
            ->where('id', $request->kelas_id)
            ->where('dosen_id', auth()->id())
            ->firstOrFail();

        return Inertia::render('dosen/nilai/rekap', [
            'kelas' => $kelas
        ]);
    }
}
