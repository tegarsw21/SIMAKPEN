<?php

namespace App\Http\Controllers;

use App\Models\Kelas;
use App\Models\User;
use App\Models\MataKuliah;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class KelasController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = \Illuminate\Support\Facades\Auth::user();

        if ($user->hasRole('admin')) {
            return Inertia::render('admin/kelas/index', [
                'kelas' => Kelas::with(['dosen', 'mataKuliah'])->get(),
                'dosens' => User::role('dosen')->get(),
                'mata_kuliah' => MataKuliah::all()
            ]);
        }

        if ($user->hasRole('dosen')) {
            return Inertia::render('dosen/kelas/index', [
                'kelas' => Kelas::with(['mataKuliah', 'komponenNilai'])
                    ->where('dosen_id', $user->id)
                    ->get()
            ]);
        }

        abort(403);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'kode_kelas' => 'required|string|unique:kelas',
            'dosen_id' => 'required|exists:users,id',
            'semester' => 'required|string',
            'ruangan' => 'nullable|string',
            'jadwal' => 'nullable|string',
            'kapasitas' => 'required|integer|min:1',
            'status' => 'required|in:aktif,selesai,dibatalkan',
            'mata_kuliah_ids' => 'required|array|min:1',
            'mata_kuliah_ids.*' => 'exists:mata_kuliah,id',
        ]);

        $kelas = Kelas::create([
            'kode_kelas' => $validated['kode_kelas'],
            'dosen_id' => $validated['dosen_id'],
            'semester' => $validated['semester'],
            'ruangan' => $validated['ruangan'],
            'jadwal' => $validated['jadwal'],
            'kapasitas' => $validated['kapasitas'],
            'status' => $validated['status'],
        ]);

        $kelas->mataKuliah()->attach($validated['mata_kuliah_ids']);

        return redirect()->back()->with('success', 'Kelas berhasil dibuat.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Kelas $kelas)
    {
        $validated = $request->validate([
            'kode_kelas' => ['required', 'string', Rule::unique('kelas')->ignore($kelas->id)],
            'dosen_id' => 'required|exists:users,id',
            'semester' => 'required|string',
            'ruangan' => 'nullable|string',
            'jadwal' => 'nullable|string',
            'kapasitas' => 'required|integer|min:1',
            'status' => 'required|in:aktif,selesai,dibatalkan',
            'mata_kuliah_ids' => 'required|array|min:1',
            'mata_kuliah_ids.*' => 'exists:mata_kuliah,id',
        ]);

        $kelas->update([
            'kode_kelas' => $validated['kode_kelas'],
            'dosen_id' => $validated['dosen_id'],
            'semester' => $validated['semester'],
            'ruangan' => $validated['ruangan'],
            'jadwal' => $validated['jadwal'],
            'kapasitas' => $validated['kapasitas'],
            'status' => $validated['status'],
        ]);

        $kelas->mataKuliah()->sync($validated['mata_kuliah_ids']);

        return redirect()->back()->with('success', 'Kelas berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Kelas $kelas)
    {
        $kelas->delete();

        return redirect()->back()->with('success', 'Kelas berhasil dihapus.');
    }
}
