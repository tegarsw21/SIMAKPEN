<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class MataKuliah extends Model
{
    use HasFactory;

    protected $table = 'mata_kuliah';

    protected $fillable = [
        'kode',
        'nama',
        'sks',
        'deskripsi',
    ];

    /**
     * Kelas-kelas yang menggunakan mata kuliah ini (many-to-many).
     */
    public function kelas(): BelongsToMany
    {
        return $this->belongsToMany(Kelas::class, 'kelas_mata_kuliah')
                    ->using(KelasMataKuliah::class)
                    ->withTimestamps();
    }
}
