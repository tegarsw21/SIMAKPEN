<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');

    // Admin Routes
    Route::group(['middleware' => ['role:admin'], 'prefix' => 'admin', 'as' => 'admin.'], function () {
        Route::resource('users', \App\Http\Controllers\UserController::class);
        Route::resource('mata-kuliah', \App\Http\Controllers\MataKuliahController::class);
        Route::resource('kelas', \App\Http\Controllers\KelasController::class);
    });

    // Dosen Routes
    Route::group(['middleware' => ['role:dosen'], 'prefix' => 'dosen', 'as' => 'dosen.'], function () {
        Route::resource('kelas', \App\Http\Controllers\KelasController::class)->only(['index', 'show']);
        Route::get('nilai/input', [\App\Http\Controllers\NilaiController::class, 'create'])->name('nilai.input');
        Route::get('nilai', [\App\Http\Controllers\NilaiController::class, 'index'])->name('nilai.index');
        Route::post('nilai', [\App\Http\Controllers\NilaiController::class, 'store'])->name('nilai.store');
        Route::get('nilai/rekap', [\App\Http\Controllers\NilaiController::class, 'show'])->name('nilai.rekap');
        Route::resource('komponen-nilai', \App\Http\Controllers\KomponenNilaiController::class);
    });

    // Mahasiswa Routes
    Route::group(['middleware' => ['role:mahasiswa'], 'prefix' => 'mahasiswa', 'as' => 'mahasiswa.'], function () {
        Route::get('nilai', [\App\Http\Controllers\NilaiController::class, 'index'])->name('nilai.index');
    });
});

require __DIR__.'/settings.php';
