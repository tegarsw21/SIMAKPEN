<?php

namespace App\Http\Controllers;

use App\Models\KomponenNilai;
use App\Models\Kelas;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KomponenNilaiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $kelasIds = Kelas::where('dosen_id', auth()->id())->pluck('id');

        return Inertia::render('dosen/komponen-nilai/index', [
            'komponen' => KomponenNilai::with('kelas')->whereIn('kelas_id', $kelasIds)->get(),
            'my_kelas' => Kelas::where('dosen_id', auth()->id())->get()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'kelas_id' => 'required|exists:kelas,id',
            'nama' => 'required|string',
            'bobot' => 'required|numeric|min:0|max:100',
        ]);

        // Verifikasi kelas milik dosen ini
        $kelas = Kelas::where('id', $validated['kelas_id'])
                      ->where('dosen_id', auth()->id())
                      ->firstOrFail();

        // Cek total bobot (opsional, bisa ditambahkan di sini agar tidak melebihi 100%)
        $currentWeight = KomponenNilai::where('kelas_id', $kelas->id)->sum('bobot');
        if ($currentWeight + $validated['bobot'] > 100) {
            return redirect()->back()->withErrors(['bobot' => 'Total bobot melebihi 100% (Saat ini: ' . $currentWeight . '%)']);
        }

        KomponenNilai::create($validated);

        return redirect()->back()->with('success', 'Komponen nilai berhasil ditambahkan.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, KomponenNilai $komponenNilai)
    {
        $validated = $request->validate([
            'nama' => 'required|string',
            'bobot' => 'required|numeric|min:0|max:100',
        ]);

        // Verifikasi kepemilikan
        if ($komponenNilai->kelas->dosen_id !== auth()->id()) {
            abort(403);
        }

        // Cek total bobot
        $currentWeight = KomponenNilai::where('kelas_id', $komponenNilai->kelas_id)
                                      ->where('id', '!=', $komponenNilai->id)
                                      ->sum('bobot');
        if ($currentWeight + $validated['bobot'] > 100) {
            return redirect()->back()->withErrors(['bobot' => 'Total bobot melebihi 100% (Saat ini: ' . ($currentWeight + $validated['bobot']) . '%)']);
        }

        $komponenNilai->update($validated);

        return redirect()->back()->with('success', 'Komponen nilai berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(KomponenNilai $komponenNilai)
    {
        if ($komponenNilai->kelas->dosen_id !== auth()->id()) {
            abort(403);
        }

        $komponenNilai->delete();

        return redirect()->back()->with('success', 'Komponen nilai berhasil dihapus.');
    }
}
