import { Head } from '@inertiajs/react';
import { dashboard } from '@/routes';
import Heading from '@/components/heading';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
    Users, 
    School, 
    Library, 
    UserCheck, 
    GraduationCap, 
    BarChart3, 
    Clock,
    CheckCircle2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Stats {
    total_users?: number;
    total_dosen?: number;
    total_mahasiswa?: number;
    total_kelas?: number;
    total_mata_kuliah?: number;
}

interface ChartData {
    label: string;
    value: number;
}

interface RecentGrade {
    id: number;
    skor: number;
    komponen_nilai: {
        nama: string;
        kelas: {
            kode_kelas: string;
            mata_kuliah: { nama: string }[];
        }
    }
}

interface Props {
    role: string;
    user_name: string;
    stats?: Stats;
    chart_data?: ChartData[];
    recent_grades?: RecentGrade[];
    kelas?: any[];
}

export default function Dashboard({ role, user_name, stats, chart_data, recent_grades, kelas }: Props) {
    const isAdmin = role === 'admin';
    const isDosen = role === 'dosen';
    const isMahasiswa = role === 'mahasiswa';

    const getGradeColor = (score: number) => {
        if (score >= 80) return 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]';
        if (score >= 70) return 'bg-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.3)]';
        if (score >= 60) return 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]';
        return 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]';
    };

    return (
        <>
            <Head title="Dashboard" />
            
            <div className="space-y-6 pt-8">
                <Heading
                    variant="small"
                    title={`Selamat Datang, ${user_name}`}
                    description="Berikut adalah ringkasan aktivitas dan data Anda hari ini."
                />

                {/* Admin Stats */}
                {isAdmin && stats && (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <StatCard title="Total Pengguna" value={stats.total_users} icon={Users} color="text-blue-600" />
                        <StatCard title="Total Dosen" value={stats.total_dosen} icon={UserCheck} color="text-indigo-600" />
                        <StatCard title="Total Mahasiswa" value={stats.total_mahasiswa} icon={GraduationCap} color="text-emerald-600" />
                        <StatCard title="Total Kelas" value={stats.total_kelas} icon={School} color="text-orange-600" />
                    </div>
                )}

                {/* Dosen Stats */}
                {isDosen && stats && (
                    <div className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <StatCard title="Kelas Mengajar" value={stats.total_kelas} icon={School} color="text-blue-600" />
                            <StatCard title="Total Mahasiswa Diampu" value={stats.total_mahasiswa} icon={Users} color="text-emerald-600" />
                        </div>
                        
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium">Monitoring Kelas</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {kelas?.map((k) => (
                                        <div key={k.id} className="flex items-center justify-between p-3 border rounded-lg">
                                            <div>
                                                <p className="font-semibold text-sm">{k.mata_kuliah[0]?.nama || 'Mata Kuliah'}</p>
                                                <p className="text-xs text-muted-foreground">Kode: {k.kode_kelas} | Ruang: {k.ruangan || '-'}</p>
                                            </div>
                                            <Badge variant="outline">{k.status}</Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Mahasiswa Dashboard with Chart */}
                {isMahasiswa && (
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Chart Column */}
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-lg">Grafik Nilai Akhir</CardTitle>
                                        <CardDescription>Visualisasi akumulasi nilai per mata kuliah</CardDescription>
                                    </div>
                                    <BarChart3 className="h-5 w-5 text-muted-foreground" />
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="h-[300px] w-full bg-muted/10 rounded-lg p-6 relative">
                                    {chart_data && chart_data.length > 0 ? (
                                        <div className="h-full w-full relative">
                                            {/* Y-Axis Labels (Ghost) */}
                                            <div className="absolute inset-0 flex flex-col justify-between text-[10px] text-muted-foreground/30 pointer-events-none">
                                                <span>100</span>
                                                <span>75</span>
                                                <span>50</span>
                                                <span>25</span>
                                                <span>0</span>
                                            </div>

                                            <svg className="h-full w-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                                                <defs>
                                                    <linearGradient id="line-gradient" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.4" />
                                                        <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
                                                    </linearGradient>
                                                </defs>
                                                
                                                {/* Area under line */}
                                                <path
                                                    d={`M 0 100 ${chart_data.map((item, i) => {
                                                        const x = (i / (chart_data.length - 1)) * 100;
                                                        const y = 100 - item.value;
                                                        return `L ${x} ${y}`;
                                                    }).join(' ')} L 100 100 Z`}
                                                    fill="url(#line-gradient)"
                                                    className="fill-primary/20"
                                                />

                                                {/* The Line */}
                                                <polyline
                                                    points={chart_data.map((item, i) => {
                                                        const x = (i / (chart_data.length - 1)) * 100;
                                                        const y = 100 - item.value;
                                                        return `${x},${y}`;
                                                    }).join(' ')}
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    className="text-primary"
                                                />
                                            </svg>

                                            {/* Data Points (Dots & Labels) */}
                                            <div className="absolute inset-0 flex justify-between">
                                                {chart_data.map((item, i) => (
                                                    <div 
                                                        key={i} 
                                                        className="h-full flex flex-col items-center justify-end relative group"
                                                        style={{ width: `${100 / chart_data.length}%` }}
                                                    >
                                                        {/* The Dot */}
                                                        <div 
                                                            className="absolute w-3 h-3 rounded-full bg-primary border-2 border-background shadow-[0_0_10px_rgba(var(--primary),0.5)] z-20 group-hover:scale-125 transition-transform"
                                                            style={{ bottom: `${item.value}%`, transform: 'translateY(50%)' }}
                                                        />
                                                        
                                                        {/* Value Label */}
                                                        <div 
                                                            className="absolute bg-popover text-popover-foreground text-[10px] font-bold px-1.5 py-0.5 rounded border shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30"
                                                            style={{ bottom: `${item.value + 4}%` }}
                                                        >
                                                            {item.value}
                                                        </div>

                                                        {/* Subject Label */}
                                                        <div className="absolute -bottom-8 text-[11px] font-bold text-muted-foreground text-center truncate w-full px-1">
                                                            {item.label}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                                            <p className="text-sm">Belum ada data nilai terkumpul.</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Activity / Side Card */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-bold flex items-center">
                                        <Clock className="mr-2 h-4 w-4" /> Nilai Terbaru
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {recent_grades && recent_grades.length > 0 ? (
                                            recent_grades.map((g) => (
                                                <div key={g.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                                                    <div className="min-w-0">
                                                        <p className="text-xs font-semibold truncate">
                                                            {g.komponen_nilai.kelas.mata_kuliah[0]?.nama}
                                                        </p>
                                                        <p className="text-[10px] text-muted-foreground">{g.komponen_nilai.nama}</p>
                                                    </div>
                                                    <div className="ml-2 font-bold text-sm">{g.skor}</div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-xs text-muted-foreground text-center py-4">Belum ada nilai baru.</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-primary/5 border-primary/20">
                                <CardContent className="p-4 flex items-start gap-3">
                                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                                    <div>
                                        <p className="text-xs font-bold text-primary">Status Akademik</p>
                                        <p className="text-[10px] text-muted-foreground mt-1">
                                            Seluruh data nilai semester ini telah disinkronkan. Tetap semangat belajar!
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

function StatCard({ title, value, icon: Icon, color }: { title: string; value: any; icon: any; color: string }) {
    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">{title}</p>
                        <p className="mt-2 text-3xl font-bold">{value}</p>
                    </div>
                    <div className={`rounded-xl bg-muted/50 p-3 ${color}`}>
                        <Icon className="h-6 w-6" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
