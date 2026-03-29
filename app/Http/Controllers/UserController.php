<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('admin/users/index', [
            'users' => User::with('roles')->get(),
            'roles' => ['admin', 'dosen', 'mahasiswa']
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|string|in:admin,dosen,mahasiswa',
            'nim' => 'nullable|string|required_if:role,mahasiswa|unique:users,nim',
            'nidn' => 'nullable|string|required_if:role,dosen|unique:users,nidn',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'nim' => $validated['nim'] ?? null,
            'nidn' => $validated['nidn'] ?? null,
        ]);

        $user->assignRole($validated['role']);

        return redirect()->back()->with('success', 'User berhasil dibuat.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => 'nullable|string|min:8',
            'role' => 'required|string|in:admin,dosen,mahasiswa',
            'nim' => ['nullable', 'string', 'required_if:role,mahasiswa', Rule::unique('users', 'nim')->ignore($user->id)],
            'nidn' => ['nullable', 'string', 'required_if:role,dosen', Rule::unique('users', 'nidn')->ignore($user->id)],
        ]);

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'nim' => $validated['nim'] ?? null,
            'nidn' => $validated['nidn'] ?? null,
        ]);

        if (!empty($validated['password'])) {
            $user->update(['password' => Hash::make($validated['password'])]);
        }

        $user->syncRoles([$validated['role']]);

        return redirect()->back()->with('success', 'User berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        if ($user->id === auth()->id()) {
            return redirect()->back()->with('error', 'Anda tidak bisa menghapus diri sendiri.');
        }

        $user->delete();

        return redirect()->back()->with('success', 'User berhasil dihapus.');
    }
}
