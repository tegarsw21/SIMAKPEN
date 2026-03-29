<?php

namespace Database\Seeders;

use App\Models\Kelas;
use App\Models\KelasMahasiswa;
use App\Models\KomponenNilai;
use App\Models\MataKuliah;
use App\Models\Nilai;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * Data yang di-seed:
     * - 3 Admin, 3 Dosen, 3 Mahasiswa
     * - 6 Mata Kuliah
     * - 6 Kelas (2 per dosen)
     * - Kelas ↔ Mata Kuliah (pivot)
     * - Mahasiswa terdaftar di kelas-kelas
     * - Komponen Nilai per kelas (UTS, UAS, Tugas, Kuis)
     * - Nilai per mahasiswa per komponen
     */
    public function run(): void
    {
        // ══════════════════════════════════════════════
        // 1. Roles & Permissions
        // ══════════════════════════════════════════════
        $this->call(RolePermissionSeeder::class);

        // ══════════════════════════════════════════════
        // 2. Users — 3 per role
        // ══════════════════════════════════════════════

        // --- Admin ---
        $admins = [];
        $adminData = [
            ['name' => 'Admin Sistem',       'email' => 'admin@example.com'],
            ['name' => 'Admin Akademik',      'email' => 'admin2@example.com'],
            ['name' => 'Admin Fakultas',      'email' => 'admin3@example.com'],
        ];
        foreach ($adminData as $data) {
            $user = User::factory()->create($data);
            $user->assignRole('admin');
            $admins[] = $user;
        }

        // --- Dosen ---
        $dosens = [];
        $dosenData = [
            ['name' => 'Dr. Budi Santoso, M.Kom.',    'nidn' => '0001018501', 'email' => 'budi.santoso@example.com'],
            ['name' => 'Prof. Siti Aminah, Ph.D.',     'nidn' => '0015039001', 'email' => 'siti.aminah@example.com'],
            ['name' => 'Dr. Agus Prasetyo, M.T.',      'nidn' => '0020078802', 'email' => 'agus.prasetyo@example.com'],
        ];
        foreach ($dosenData as $data) {
            $user = User::factory()->create($data);
            $user->assignRole('dosen');
            $dosens[] = $user;
        }

        // --- Mahasiswa ---
        $mahasiswas = [];
        $mahasiswaData = [
            ['name' => 'Tegar Pratama',     'nim' => '2024001', 'email' => 'tegar@example.com'],
            ['name' => 'Anisa Rahmawati',   'nim' => '2024002', 'email' => 'anisa@example.com'],
            ['name' => 'Rizky Aditya',      'nim' => '2024003', 'email' => 'rizky@example.com'],
            ['name' => 'Dewi Lestari',      'nim' => '2024004', 'email' => 'dewi@example.com'],
            ['name' => 'Fajar Nugroho',     'nim' => '2024005', 'email' => 'fajar@example.com'],
            ['name' => 'Putri Handayani',   'nim' => '2024006', 'email' => 'putri@example.com'],
            ['name' => 'Muhammad Ilham',    'nim' => '2024007', 'email' => 'ilham@example.com'],
            ['name' => 'Sari Wulandari',    'nim' => '2024008', 'email' => 'sari@example.com'],
            ['name' => 'Bayu Firmansyah',   'nim' => '2024009', 'email' => 'bayu@example.com'],
        ];
        foreach ($mahasiswaData as $data) {
            $user = User::factory()->create($data);
            $user->assignRole('mahasiswa');
            $mahasiswas[] = $user;
        }

        // ══════════════════════════════════════════════
        // 3. Mata Kuliah
        // ══════════════════════════════════════════════
        $mataKuliahData = [
            ['kode' => 'IF101', 'nama' => 'Algoritma dan Pemrograman',        'sks' => 3, 'deskripsi' => 'Dasar-dasar algoritma, pseudocode, dan implementasi dalam bahasa pemrograman.'],
            ['kode' => 'IF102', 'nama' => 'Struktur Data',                     'sks' => 3, 'deskripsi' => 'Array, linked list, stack, queue, tree, graph, dan implementasinya.'],
            ['kode' => 'IF201', 'nama' => 'Basis Data',                        'sks' => 3, 'deskripsi' => 'Konsep DBMS, normalisasi, SQL, dan perancangan basis data relasional.'],
            ['kode' => 'IF202', 'nama' => 'Rekayasa Perangkat Lunak',          'sks' => 3, 'deskripsi' => 'Metodologi pengembangan perangkat lunak, UML, dan manajemen proyek.'],
            ['kode' => 'IF301', 'nama' => 'Pemrograman Web',                   'sks' => 3, 'deskripsi' => 'HTML, CSS, JavaScript, framework web, dan pengembangan aplikasi web.'],
            ['kode' => 'IF302', 'nama' => 'Kecerdasan Buatan',                 'sks' => 3, 'deskripsi' => 'Machine learning, neural network, NLP, dan penerapan AI.'],
        ];

        $mataKuliahs = [];
        foreach ($mataKuliahData as $data) {
            $mataKuliahs[] = MataKuliah::create($data);
        }

        // ══════════════════════════════════════════════
        // 4. Kelas — 2 kelas per dosen
        // ══════════════════════════════════════════════
        $kelasData = [
            // Dosen 1: Dr. Budi
            ['kode_kelas' => 'IF101-A', 'dosen_id' => $dosens[0]->id, 'semester' => '2025/2026 Genap', 'ruangan' => 'Lab Komputer 1', 'jadwal' => 'Senin 08:00-10:30',   'kapasitas' => 40, 'status' => 'aktif'],
            ['kode_kelas' => 'IF102-A', 'dosen_id' => $dosens[0]->id, 'semester' => '2025/2026 Genap', 'ruangan' => 'Lab Komputer 2', 'jadwal' => 'Rabu 13:00-15:30',    'kapasitas' => 35, 'status' => 'aktif'],

            // Dosen 2: Prof. Siti
            ['kode_kelas' => 'IF201-A', 'dosen_id' => $dosens[1]->id, 'semester' => '2025/2026 Genap', 'ruangan' => 'R. 301',         'jadwal' => 'Selasa 08:00-10:30',  'kapasitas' => 40, 'status' => 'aktif'],
            ['kode_kelas' => 'IF202-A', 'dosen_id' => $dosens[1]->id, 'semester' => '2025/2026 Genap', 'ruangan' => 'R. 302',         'jadwal' => 'Kamis 10:00-12:30',   'kapasitas' => 40, 'status' => 'aktif'],

            // Dosen 3: Dr. Agus
            ['kode_kelas' => 'IF301-A', 'dosen_id' => $dosens[2]->id, 'semester' => '2025/2026 Genap', 'ruangan' => 'Lab Komputer 3', 'jadwal' => 'Jumat 08:00-10:30',   'kapasitas' => 30, 'status' => 'aktif'],
            ['kode_kelas' => 'IF302-A', 'dosen_id' => $dosens[2]->id, 'semester' => '2025/2026 Genap', 'ruangan' => 'R. 401',         'jadwal' => 'Rabu 08:00-10:30',    'kapasitas' => 35, 'status' => 'aktif'],
        ];

        $kelasList = [];
        foreach ($kelasData as $data) {
            $kelasList[] = Kelas::create($data);
        }

        // ══════════════════════════════════════════════
        // 5. Pivot Kelas ↔ Mata Kuliah
        //    Setiap kelas dikaitkan dengan mata kuliah
        // ══════════════════════════════════════════════
        $kelasMatkul = [
            // Kelas IF101-A → Algoritma dan Pemrograman
            [$kelasList[0]->id, $mataKuliahs[0]->id],
            // Kelas IF102-A → Struktur Data
            [$kelasList[1]->id, $mataKuliahs[1]->id],
            // Kelas IF201-A → Basis Data
            [$kelasList[2]->id, $mataKuliahs[2]->id],
            // Kelas IF202-A → Rekayasa Perangkat Lunak
            [$kelasList[3]->id, $mataKuliahs[3]->id],
            // Kelas IF301-A → Pemrograman Web
            [$kelasList[4]->id, $mataKuliahs[4]->id],
            // Kelas IF302-A → Kecerdasan Buatan
            [$kelasList[5]->id, $mataKuliahs[5]->id],
        ];

        foreach ($kelasMatkul as [$kelasId, $matkulId]) {
            $kelasList[array_search($kelasId, array_column($kelasList, 'id'))]
                ->mataKuliah()
                ->attach($matkulId);
        }

        // ══════════════════════════════════════════════
        // 6. Enrollment — Mahasiswa terdaftar di kelas
        //    Sebar 9 mahasiswa di berbagai kelas
        // ══════════════════════════════════════════════
        $enrollments = [
            // Kelas IF101-A: Tegar, Anisa, Rizky
            [$kelasList[0]->id, [$mahasiswas[0], $mahasiswas[1], $mahasiswas[2]]],
            // Kelas IF102-A: Tegar, Dewi, Fajar
            [$kelasList[1]->id, [$mahasiswas[0], $mahasiswas[3], $mahasiswas[4]]],
            // Kelas IF201-A: Anisa, Putri, Ilham
            [$kelasList[2]->id, [$mahasiswas[1], $mahasiswas[5], $mahasiswas[6]]],
            // Kelas IF202-A: Rizky, Sari, Bayu
            [$kelasList[3]->id, [$mahasiswas[2], $mahasiswas[7], $mahasiswas[8]]],
            // Kelas IF301-A: Tegar, Dewi, Putri, Sari
            [$kelasList[4]->id, [$mahasiswas[0], $mahasiswas[3], $mahasiswas[5], $mahasiswas[7]]],
            // Kelas IF302-A: Fajar, Ilham, Bayu
            [$kelasList[5]->id, [$mahasiswas[4], $mahasiswas[6], $mahasiswas[8]]],
        ];

        $kelasMahasiswaRecords = [];
        foreach ($enrollments as [$kelasId, $students]) {
            foreach ($students as $mhs) {
                $kelasMahasiswaRecords[] = KelasMahasiswa::create([
                    'kelas_id' => $kelasId,
                    'mahasiswa_id' => $mhs->id,
                ]);
            }
        }

        // ══════════════════════════════════════════════
        // 7. Komponen Nilai per Kelas
        //    Setiap kelas memiliki: Tugas (20%), Kuis (15%), UTS (30%), UAS (35%)
        // ══════════════════════════════════════════════
        $komponenTemplate = [
            ['nama' => 'Tugas',  'bobot' => 20.00],
            ['nama' => 'Kuis',   'bobot' => 15.00],
            ['nama' => 'UTS',    'bobot' => 30.00],
            ['nama' => 'UAS',    'bobot' => 35.00],
        ];

        $komponenPerKelas = []; // kelasId => [KomponenNilai, ...]
        foreach ($kelasList as $kelas) {
            $komponenPerKelas[$kelas->id] = [];
            foreach ($komponenTemplate as $tpl) {
                $komponenPerKelas[$kelas->id][] = KomponenNilai::create([
                    'kelas_id' => $kelas->id,
                    'nama'     => $tpl['nama'],
                    'bobot'    => $tpl['bobot'],
                ]);
            }
        }

        // ══════════════════════════════════════════════
        // 8. Nilai — Skor acak realistis per mahasiswa per komponen
        // ══════════════════════════════════════════════
        foreach ($kelasMahasiswaRecords as $km) {
            $komponens = $komponenPerKelas[$km->kelas_id] ?? [];
            foreach ($komponens as $komponen) {
                Nilai::create([
                    'kelas_mahasiswa_id' => $km->id,
                    'komponen_nilai_id'  => $komponen->id,
                    'skor'               => fake()->randomFloat(2, 55, 100),  // Skor antara 55 - 100
                    'catatan'            => fake()->optional(0.3)->sentence(), // 30% kemungkinan ada catatan
                ]);
            }
        }
    }
}
