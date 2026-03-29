<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    /**
     * Seed roles dan permissions untuk Sistem Manajemen Kelas & Penilaian.
     *
     * Roles:
     *   - admin      → kelola kelas
     *   - dosen      → input nilai, lihat nilai, rekap nilai
     *   - mahasiswa  → lihat nilai (sendiri)
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // ──────────────────────────────────────────────
        // 1. Buat Permissions
        // ──────────────────────────────────────────────
        $permissions = [
            // Kelola Kelas (CRUD kelas & enrollment) — Admin
            'kelas.index',
            'kelas.create',
            'kelas.edit',
            'kelas.delete',
            'kelas.manage-mahasiswa',  // Tambah/hapus mahasiswa dari kelas

            // Kelola Mata Kuliah — Admin
            'mata-kuliah.index',
            'mata-kuliah.create',
            'mata-kuliah.edit',
            'mata-kuliah.delete',

            // Input Nilai — Dosen
            'nilai.input',

            // Lihat Nilai — Dosen & Mahasiswa
            'nilai.lihat',

            // Rekap Nilai per Kelas — Dosen
            'nilai.rekap',

            // Kelola Komponen Nilai — Dosen
            'komponen-nilai.create',
            'komponen-nilai.edit',
            'komponen-nilai.delete',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // ──────────────────────────────────────────────
        // 2. Buat Roles & Assign Permissions
        // ──────────────────────────────────────────────

        // Admin — hanya mengelola kelas & mata kuliah
        $admin = Role::firstOrCreate(['name' => 'admin']);
        $admin->syncPermissions([
            'kelas.index',
            'kelas.create',
            'kelas.edit',
            'kelas.delete',
            'kelas.manage-mahasiswa',
            'mata-kuliah.index',
            'mata-kuliah.create',
            'mata-kuliah.edit',
            'mata-kuliah.delete',
        ]);

        // Dosen — input, lihat, dan rekap nilai + kelola komponen nilai
        $dosen = Role::firstOrCreate(['name' => 'dosen']);
        $dosen->syncPermissions([
            'nilai.input',
            'nilai.lihat',
            'nilai.rekap',
            'komponen-nilai.create',
            'komponen-nilai.edit',
            'komponen-nilai.delete',
        ]);

        // Mahasiswa — hanya lihat nilai sendiri
        $mahasiswa = Role::firstOrCreate(['name' => 'mahasiswa']);
        $mahasiswa->syncPermissions([
            'nilai.lihat',
        ]);
    }
}
