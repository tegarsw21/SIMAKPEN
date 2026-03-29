<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class KelasMahasiswa extends Model
{
    use HasFactory;

    protected $table = 'kelas_mahasiswa';

    protected $fillable = [
        'kelas_id',
        'mahasiswa_id',
    ];

    /**
     * Kelas yang diikuti.
     */
    public function kelas(): BelongsTo
    {
        return $this->belongsTo(Kelas::class);
    }

    /**
     * Mahasiswa yang terdaftar.
     */
    public function mahasiswa(): BelongsTo
    {
        return $this->belongsTo(User::class, 'mahasiswa_id');
    }

    /**
     * Semua nilai milik enrollment ini.
     */
    public function nilai(): HasMany
    {
        return $this->hasMany(Nilai::class);
    }
}
