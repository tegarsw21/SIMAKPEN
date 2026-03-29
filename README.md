# SIMAKPEN - Sistem Informasi Manajemen Kelas & Penilaian

SIMAKPEN adalah sebuah platform berbasis web modern yang dibangun untuk menyederhanakan dan memusatkan pengelolaan data kelas, penjadwalan, serta sistem penilaian terdistribusi antara Admin, Dosen, dan Mahasiswa.

## Daftar Isi
1. [Fitur Utama](#fitur-utama)
2. [Prasyarat Instalasi](#prasyarat-instalasi)
3. [Panduan Instalasi](#panduan-instalasi)
4. [Dokumentasi Sistem Lengkap](#dokumentasi-sistem)

---

## Fitur Utama
- **RBAC (Role-Based Access Control)**: Modul autentikasi terpisah antara `Admin`, `Dosen`, dan `Mahasiswa`.
- **Manajemen Akademik**: Pengelolaan spesifik oleh entitas (Admin untuk data Master, Dosen untuk kelasnya masing-masing).
- **Interactive Dashboard**: Panel analitik untuk Admin dan visualisasi persentil chart interaktif untuk Mahasiswa.
- **Sistem Penilaian Terbobot**: Dosen dapat melakukan pengerjaan *grading* berdasarkan komponen yang fleksibel sesuai silabus kelas masing-masing.

---

## Prasyarat Instalasi
Sebelum Anda bisa menjalankan simulasi di lokal, pastikan kapabilitas server dan sistem memenuhi:
- PHP >= 8.2
- Composer 2.x
- Node.js >= 18.x beserta npm.
- Database (Mendukung MySQL / PostgreSQL / SQLite) - *Secara default SIMAKPEN dikonfigurasi menggunakan SQLite*.

---

## Panduan Instalasi
Langkah-langkah untuk menyiapkan environment lokal Anda:

1. **Clone repository ini**
   ```bash
   git clone <url_repository>
   cd Manajemen_Kelas
   ```

2. **Instalasi Dependensi**
   ```bash
   composer install
   npm install
   ```

3. **Inisialisasi Konfigurasi Environment**
   Salin `.env.example` sebagai konfigurasi lokal Anda, lalu ciptakan Application Key yang baru.
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Siapkan Database dan Storage**
   Jalankan fitur migrasi skema tabel beserta default seedernya (Admin pertama, sample account dosen & mahasiswa).
   ```bash
   php artisan migrate:fresh --seed
   php artisan storage:link
   ```

5. **Jalankan Aplikasi**
   Pastikan Anda menjalankan kedua server (`Backend/PHP` dan `Frontend/Vite`) minimal di dua terminal atau window terpisah.
   ```bash
   composer run dev
   ```
   *Atau jalankan manual:*
   ```bash
   php artisan serve
   npm run dev
   ```

## Dokumentasi Sistem
SIMAKPEN menyediakan dokumentasi *engineering* spesifik yang mencakup rincian Activity Diagram, alur Data Flow (DFD Level 0 dan 1), Class Diagram (Struktur Relasi Entity) hingga dokumentasi skema migrasi database.

Lihat selengkapnya: [Dokumentasi Teknis dan UML Diagram (documentation.md)](./documentation.md).
