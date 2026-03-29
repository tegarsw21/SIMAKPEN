<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Spatie\Permission\Traits\HasRoles;

#[Fillable(['name', 'nim', 'nidn', 'email', 'password'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable, HasRoles;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    // ─── Relationships ───────────────────────────────────

    /**
     * Kelas yang diampu oleh dosen ini.
     */
    public function kelasMengajar(): HasMany
    {
        return $this->hasMany(Kelas::class, 'dosen_id');
    }

    /**
     * Kelas yang diikuti oleh mahasiswa ini (many-to-many via pivot).
     */
    public function kelasYangDiikuti(): BelongsToMany
    {
        return $this->belongsToMany(Kelas::class, 'kelas_mahasiswa', 'mahasiswa_id', 'kelas_id')
                    ->withTimestamps();
    }

    /**
     * Enrollment records (untuk akses nilai mahasiswa).
     */
    public function kelasMahasiswa(): HasMany
    {
        return $this->hasMany(KelasMahasiswa::class, 'mahasiswa_id');
    }
}
