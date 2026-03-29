<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;

class KelasMataKuliah extends Pivot
{
    protected $table = 'kelas_mata_kuliah';

    public $incrementing = true;

    protected $fillable = [
        'kelas_id',
        'mata_kuliah_id',
    ];

    /**
     * Kelas terkait.
     */
    public function kelas(): BelongsTo
    {
        return $this->belongsTo(Kelas::class);
    }

    /**
     * Mata kuliah terkait.
     */
    public function mataKuliah(): BelongsTo
    {
        return $this->belongsTo(MataKuliah::class);
    }
}
