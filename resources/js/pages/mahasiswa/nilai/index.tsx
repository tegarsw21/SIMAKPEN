import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap } from 'lucide-react';

interface NilaiRecord {
    id: number;
    skor: number;
    catatan: string | null;
    komponen_nilai: {
        id: number;
        nama: string;
        bobot: number;
        kelas: {
            id: number;
            kode_kelas: string;
            dosen: {
                name: string;
            };
            mata_kuliah: Array<{
                nama: string;
                kode: string;
                sks: number;
            }>;
        };
    };
}

interface Props {
    nilai_per_kelas: Record<number, NilaiRecord[]>;
}

export default function NilaiMahasiswa({ nilai_per_kelas }: Props) {
    const calculateSummary = (records: NilaiRecord[]) => {
        let total = 0;
        let subject = records[0]?.komponen_nilai.kelas.mata_kuliah[0];
        let sks = subject?.sks || 0;
        
        records.forEach(r => {
            total += (r.skor * Number(r.komponen_nilai.bobot)) / 100;
        });

        return { score: total.toFixed(2), sks };
    };

    const getGradeLabel = (score: number) => {
        if (score >= 85) return { label: 'A', color: 'bg-green-100 text-green-800' };
        if (score >= 75) return { label: 'B', color: 'bg-blue-100 text-blue-800' };
        if (score >= 65) return { label: 'C', color: 'bg-yellow-100 text-yellow-800' };
        if (score >= 50) return { label: 'D', color: 'bg-orange-100 text-orange-800' };
        return { label: 'E', color: 'bg-red-100 text-red-800' };
    };

    const kelasIds = Object.keys(nilai_per_kelas);

    return (
        <>
            <Head title="Nilai Saya" />

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Hasil Studi"
                    description="Daftar nilai mata kuliah yang Anda ikuti pada semester ini."
                />

                {kelasIds.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed rounded-xl">
                        <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground/30" />
                        <h3 className="mt-4 text-sm font-semibold">Belum Ada Nilai</h3>
                        <p className="text-sm text-muted-foreground mt-1">Anda belum terdaftar di kelas manapun atau nilai belum dirilis.</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {kelasIds.map(kelasId => {
                            const records = nilai_per_kelas[Number(kelasId)];
                            const meta = records[0].komponen_nilai.kelas;
                            const subject = meta.mata_kuliah[0]; // Many-to-Many returns array
                            const summary = calculateSummary(records);
                            const grade = getGradeLabel(Number(summary.score));

                            return (
                                <Card key={kelasId} className="overflow-hidden border-sidebar-border shadow-sm">
                                    <CardHeader className="bg-muted/30 border-b py-4">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                            <div>
                                                <CardTitle className="text-lg">
                                                    {subject?.nama || 'Mata Kuliah Tidak Diketahui'} 
                                                    <span className="ml-2 font-normal text-muted-foreground text-sm">({subject?.kode})</span>
                                                </CardTitle>
                                                <p className="text-xs text-muted-foreground mt-1 font-medium">
                                                    Dosen: {meta.dosen.name}
                                                </p>
                                                <p className="text-[11px] text-muted-foreground/80 mt-0.5">
                                                    Kelas: {meta.kode_kelas} • SKS: {subject?.sks || 0}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="text-right">
                                                    <p className="text-[10px] uppercase text-muted-foreground font-bold leading-none">Nilai Akhir</p>
                                                    <p className="text-xl font-black">{summary.score}</p>
                                                </div>
                                                <Badge className={`${grade.color} text-sm px-3 py-1 font-bold shadow-none`}>
                                                    Grade {grade.label}
                                                </Badge>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-muted/10">
                                                    <TableHead className="pl-6">Komponen Penilaian</TableHead>
                                                    <TableHead className="text-center">Bobot</TableHead>
                                                    <TableHead className="text-center">Skor</TableHead>
                                                    <TableHead className="pr-6">Catatan Dosen</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {records.map(record => (
                                                    <TableRow key={record.id}>
                                                        <TableCell className="pl-6 font-medium">{record.komponen_nilai.nama}</TableCell>
                                                        <TableCell className="text-center text-xs">{record.komponen_nilai.bobot}%</TableCell>
                                                        <TableCell className="text-center font-bold">{record.skor}</TableCell>
                                                        <TableCell className="pr-6 text-xs text-muted-foreground italic">
                                                            {record.catatan || '-'}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
}
