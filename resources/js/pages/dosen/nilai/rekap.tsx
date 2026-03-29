import { Head, Link } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Printer } from 'lucide-react';
import * as NilaiRoutes from '@/routes/dosen/nilai';

interface Nilai {
    komponen_nilai_id: number;
    skor: number;
}

interface Mahasiswa {
    id: number;
    name: string;
    nim: string;
}

interface KelasMahasiswa {
    id: number;
    mahasiswa: Mahasiswa;
    nilai: Nilai[];
}

interface KomponenNilai {
    id: number;
    nama: string;
    bobot: number;
}

interface Props {
    kelas: {
        id: number;
        kode_kelas: string;
        mata_kuliah: Array<{ nama: string; kode: string }>;
        komponen_nilai: KomponenNilai[];
        kelas_mahasiswa: KelasMahasiswa[];
    };
}

export default function RekapNilai({ kelas }: Props) {
    const calculateFinal = (studentNilai: Nilai[]) => {
        let total = 0;
        let totalWeight = 0;
        
        kelas.komponen_nilai.forEach(comp => {
            const score = studentNilai.find(n => n.komponen_nilai_id === comp.id)?.skor || 0;
            total += (score * Number(comp.bobot)) / 100;
            totalWeight += Number(comp.bobot);
        });

        return { score: total.toFixed(2), weight: totalWeight };
    };

    const getGradeLabel = (score: number) => {
        if (score >= 85) return { label: 'A', color: 'bg-green-100 text-green-800 border-green-200' };
        if (score >= 75) return { label: 'B', color: 'bg-blue-100 text-blue-800 border-blue-200' };
        if (score >= 65) return { label: 'C', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
        if (score >= 50) return { label: 'D', color: 'bg-orange-100 text-orange-800 border-orange-200' };
        return { label: 'E', color: 'bg-red-100 text-red-800 border-red-200' };
    };

    return (
        <>
            <Head title={`Rekap Nilai ${kelas.kode_kelas}`} />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href={NilaiRoutes.index.url()}>
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Heading
                            variant="small"
                            title="Rekap Nilai Mahasiswa"
                            description={`${kelas.mata_kuliah[0].nama} (${kelas.kode_kelas})`}
                        />
                    </div>
                    <Button variant="outline" size="sm" onClick={() => window.print()}>
                        <Printer className="mr-2 h-4 w-4" /> Cetak Rekap
                    </Button>
                </div>

                <div className="rounded-md border bg-card overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="min-w-[150px]">Mahasiswa</TableHead>
                                {kelas.komponen_nilai.map(comp => (
                                    <TableHead key={comp.id} className="text-center min-w-[80px]">
                                        <div className="space-y-0.5">
                                            <p className="text-[10px] uppercase font-bold text-muted-foreground">{comp.nama}</p>
                                            <p className="text-xs font-normal">({comp.bobot}%)</p>
                                        </div>
                                    </TableHead>
                                ))}
                                <TableHead className="text-center bg-muted/30 font-bold min-w-[100px]">Total (100%)</TableHead>
                                <TableHead className="text-center min-w-[80px]">Grade</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {kelas.kelas_mahasiswa.map((m) => {
                                const final = calculateFinal(m.nilai);
                                const grade = getGradeLabel(Number(final.score));
                                
                                return (
                                    <TableRow key={m.id}>
                                        <TableCell>
                                            <div className="space-y-0.5">
                                                <p className="text-sm font-medium leading-none">{m.mahasiswa.name}</p>
                                                <p className="text-xs text-muted-foreground">{m.mahasiswa.nim}</p>
                                            </div>
                                        </TableCell>
                                        {kelas.komponen_nilai.map(comp => (
                                            <TableCell key={comp.id} className="text-center text-sm">
                                                {m.nilai.find(n => n.komponen_nilai_id === comp.id)?.skor || 0}
                                            </TableCell>
                                        ))}
                                        <TableCell className="text-center font-bold bg-muted/10">
                                            {final.score}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge className={`${grade.color} border shadow-none px-2 rounded-full`}>
                                                {grade.label}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            {kelas.kelas_mahasiswa.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={3 + kelas.komponen_nilai.length} className="h-24 text-center text-muted-foreground">
                                        Belum ada data mahasiswa.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                
                <div className="p-4 rounded-lg bg-muted/40 border text-xs text-muted-foreground">
                    <p className="font-semibold mb-2">Informasi:</p>
                    <ul className="list-disc ml-4 space-y-1">
                        <li>Skor Akhir dihitung berdasarkan bobot masing-masing komponen.</li>
                        <li>Pastikan total bobot komponen adalah 100% untuk akurasi nilai akhir.</li>
                        <li>Status pengisian bobot saat ini: <span className={calculateFinal([]).weight === 100 ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>{calculateFinal([]).weight}%</span></li>
                    </ul>
                </div>
            </div>
        </>
    );
}
