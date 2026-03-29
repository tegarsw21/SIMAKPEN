<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Nilai extends Model
{
    use HasFactory;

    protected $table = 'nilai';

    protected $fillable = [
        'kelas_mahasiswa_id',
        'komponen_nilai_id',
        'skor',
        'catatan',
    ];

    /**
     * Enrollment (kelas_mahasiswa) terkait.
     */
    public function kelasMahasiswa(): BelongsTo
    {
        return $this->belongsTo(KelasMahasiswa::class);
    }

    /**
     * Komponen nilai terkait.
     */
    public function komponenNilai(): BelongsTo
    {
        return $this->belongsTo(KomponenNilai::class);
    }
}
