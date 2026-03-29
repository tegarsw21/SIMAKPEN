<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Kelas extends Model
{
    use HasFactory;

    protected $table = 'kelas';

    protected $fillable = [
        'kode_kelas',
        'dosen_id',
        'semester',
        'ruangan',
        'jadwal',
        'kapasitas',
        'status',
    ];

    /**
     * Mata kuliah yang diajarkan di kelas ini (many-to-many).
     */
    public function mataKuliah(): BelongsToMany
    {
        return $this->belongsToMany(MataKuliah::class, 'kelas_mata_kuliah')
                    ->using(KelasMataKuliah::class)
                    ->withTimestamps();
    }

    /**
     * Dosen pengampu kelas ini.
     */
    public function dosen(): BelongsTo
    {
        return $this->belongsTo(User::class, 'dosen_id');
    }

    /**
     * Mahasiswa yang terdaftar di kelas ini (pivot).
     */
    public function mahasiswa(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'kelas_mahasiswa', 'kelas_id', 'mahasiswa_id')
                    ->withTimestamps();
    }

    /**
     * Enrollment records (untuk akses nilai).
     */
    public function kelasMahasiswa(): HasMany
    {
        return $this->hasMany(KelasMahasiswa::class);
    }

    /**
     * Komponen nilai yang dimiliki kelas ini.
     */
    public function komponenNilai(): HasMany
    {
        return $this->hasMany(KomponenNilai::class);
    }
}
