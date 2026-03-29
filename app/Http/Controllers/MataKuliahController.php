<?php

namespace App\Http\Controllers;

use App\Models\MataKuliah;
use Illuminate\Http\Request;

use Inertia\Inertia;

class MataKuliahController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('admin/mata-kuliah/index', [
            'mata_kuliah' => MataKuliah::all()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'kode' => 'required|string|unique:mata_kuliah',
            'nama' => 'required|string',
            'sks' => 'required|integer|min:1|max:8',
            'deskripsi' => 'nullable|string',
        ]);

        MataKuliah::create($validated);

        return redirect()->back()->with('success', 'Mata kuliah berhasil ditambahkan.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, MataKuliah $mataKuliah)
    {
        $validated = $request->validate([
            'kode' => 'required|string|unique:mata_kuliah,kode,' . $mataKuliah->id,
            'nama' => 'required|string',
            'sks' => 'required|integer|min:1|max:8',
            'deskripsi' => 'nullable|string',
        ]);

        $mataKuliah->update($validated);

        return redirect()->back()->with('success', 'Mata kuliah berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MataKuliah $mataKuliah)
    {
        $mataKuliah->delete();

        return redirect()->back()->with('success', 'Mata kuliah berhasil dihapus.');
    }
}
