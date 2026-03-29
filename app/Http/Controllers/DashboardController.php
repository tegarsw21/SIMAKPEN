<?php

namespace App\Http\Controllers;

use App\Models\Kelas;
use App\Models\MataKuliah;
use App\Models\Nilai;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $data = [
            'role' => $user->getRoleNames()->first(),
            'user_name' => $user->name,
        ];

        if ($user->hasRole('admin')) {
            $data['stats'] = [
                'total_users' => User::count(),
                'total_dosen' => User::role('dosen')->count(),
                'total_mahasiswa' => User::role('mahasiswa')->count(),
                'total_kelas' => Kelas::count(),
                'total_mata_kuliah' => MataKuliah::count(),
            ];
        } elseif ($user->hasRole('dosen')) {
            $classes = Kelas::where('dosen_id', $user->id)->with('mataKuliah')->get();
            $data['stats'] = [
                'total_kelas' => $classes->count(),
                'total_mahasiswa' => \App\Models\KelasMahasiswa::whereIn('kelas_id', $classes->pluck('id'))->count(),
            ];
            $data['kelas'] = $classes;
        } elseif ($user->hasRole('mahasiswa')) {
            // Data Nilai untuk Chart
            $nilaiRecords = Nilai::with(['komponenNilai.kelas.mataKuliah'])
                ->whereHas('kelasMahasiswa', function($q) use ($user) {
                    $q->where('mahasiswa_id', $user->id);
                })
                ->get();

            $groupedNilai = $nilaiRecords->groupBy(function ($item) {
                return $item->komponenNilai->kelas_id;
            });

            $chartData = [];
            foreach ($groupedNilai as $kelasId => $records) {
                $totalScore = 0;
                $mataKuliahName = 'Unknown';
                
                if ($records->count() > 0) {
                    $firstRecord = $records->first();
                    $mataKuliahName = $firstRecord->komponenNilai->kelas->mataKuliah[0]->nama ?? 'Mata Kuliah';
                }

                foreach ($records as $r) {
                    $totalScore += ($r->skor * (float)$r->komponenNilai->bobot) / 100;
                }
                
                $chartData[] = [
                    'label' => $mataKuliahName,
                    'value' => round($totalScore, 2),
                ];
            }
            
            $data['chart_data'] = $chartData;
            $data['recent_grades'] = Nilai::with(['komponenNilai.kelas.mataKuliah'])
                ->whereHas('kelasMahasiswa', function($q) use ($user) {
                    $q->where('mahasiswa_id', $user->id);
                })
                ->latest()
                ->take(5)
                ->get();
        }

        return Inertia::render('dashboard', $data);
    }
}
