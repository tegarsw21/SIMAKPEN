<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class KomponenNilai extends Model
{
    use HasFactory;

    protected $table = 'komponen_nilai';

    protected $fillable = [
        'kelas_id',
        'nama',
        'bobot',
    ];

    /**
     * Kelas yang memiliki komponen nilai ini.
     */
    public function kelas(): BelongsTo
    {
        return $this->belongsTo(Kelas::class);
    }

    /**
     * Semua nilai yang terkait komponen ini.
     */
    public function nilai(): HasMany
    {
        return $this->hasMany(Nilai::class);
    }
}
