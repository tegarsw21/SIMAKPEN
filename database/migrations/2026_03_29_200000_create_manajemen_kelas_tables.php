<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // ──────────────────────────────────────────────
        // 1. Tambah kolom identitas di tabel users
        // ──────────────────────────────────────────────
        Schema::table('users', function (Blueprint $table) {
            $table->string('nim')->nullable()->unique()->after('name');   // Untuk mahasiswa
            $table->string('nidn')->nullable()->unique()->after('nim');  // Untuk dosen
        });

        // ──────────────────────────────────────────────
        // 2. Mata Kuliah (Courses / Subjects)
        // ──────────────────────────────────────────────
        Schema::create('mata_kuliah', function (Blueprint $table) {
            $table->id();
            $table->string('kode')->unique();        // Kode MK, misal "IF101"
            $table->string('nama');                   // Nama mata kuliah
            $table->unsignedTinyInteger('sks');       // Jumlah SKS
            $table->text('deskripsi')->nullable();    // Deskripsi opsional
            $table->timestamps();
        });

        // ──────────────────────────────────────────────
        // 3. Kelas (Class = Dosen + Semester)
        //    Dikelola oleh Admin
        // ──────────────────────────────────────────────
        Schema::create('kelas', function (Blueprint $table) {
            $table->id();
            $table->string('kode_kelas')->unique();  // Kode kelas, misal "IF101-A"
            $table->foreignId('dosen_id')
                  ->constrained('users')
                  ->cascadeOnDelete();
            $table->string('semester');               // Contoh: "2025/2026 Genap"
            $table->string('ruangan')->nullable();    // Ruangan kelas
            $table->string('jadwal')->nullable();     // Jadwal, misal "Senin 08:00-10:30"
            $table->unsignedInteger('kapasitas')->default(40);
            $table->enum('status', ['aktif', 'selesai', 'dibatalkan'])->default('aktif');
            $table->timestamps();
        });

        // ──────────────────────────────────────────────
        // 3b. Pivot Kelas ↔ Mata Kuliah (Many-to-Many)
        // ──────────────────────────────────────────────
        Schema::create('kelas_mata_kuliah', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kelas_id')
                  ->constrained('kelas')
                  ->cascadeOnDelete();
            $table->foreignId('mata_kuliah_id')
                  ->constrained('mata_kuliah')
                  ->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['kelas_id', 'mata_kuliah_id']);
        });

        // ──────────────────────────────────────────────
        // 4. Kelas Mahasiswa (Enrollment / Peserta Kelas)
        //    Pivot antara mahasiswa dan kelas
        // ──────────────────────────────────────────────
        Schema::create('kelas_mahasiswa', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kelas_id')
                  ->constrained('kelas')
                  ->cascadeOnDelete();
            $table->foreignId('mahasiswa_id')
                  ->constrained('users')
                  ->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['kelas_id', 'mahasiswa_id']); // Mahasiswa tidak boleh mendaftar dua kali
        });

        // ──────────────────────────────────────────────
        // 5. Komponen Nilai (Grade Components per Kelas)
        //    Contoh: UTS, UAS, Tugas 1, Kuis, dsb.
        //    Dibuat oleh Dosen
        // ──────────────────────────────────────────────
        Schema::create('komponen_nilai', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kelas_id')
                  ->constrained('kelas')
                  ->cascadeOnDelete();
            $table->string('nama');                   // Nama komponen, misal "UTS"
            $table->decimal('bobot', 5, 2);           // Bobot persentase, misal 30.00
            $table->timestamps();
        });

        // ──────────────────────────────────────────────
        // 6. Nilai (Grades)
        //    Nilai per mahasiswa per komponen
        //    Di-input oleh Dosen
        // ──────────────────────────────────────────────
        Schema::create('nilai', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kelas_mahasiswa_id')
                  ->constrained('kelas_mahasiswa')
                  ->cascadeOnDelete();
            $table->foreignId('komponen_nilai_id')
                  ->constrained('komponen_nilai')
                  ->cascadeOnDelete();
            $table->decimal('skor', 5, 2);            // Skor numerik, misal 85.50
            $table->text('catatan')->nullable();       // Catatan opsional dari dosen
            $table->timestamps();

            $table->unique(['kelas_mahasiswa_id', 'komponen_nilai_id']); // Satu nilai per komponen per mahasiswa
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nilai');
        Schema::dropIfExists('komponen_nilai');
        Schema::dropIfExists('kelas_mahasiswa');
        Schema::dropIfExists('kelas_mata_kuliah');
        Schema::dropIfExists('kelas');
        Schema::dropIfExists('mata_kuliah');

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['nim', 'nidn']);
        });
    }
};
