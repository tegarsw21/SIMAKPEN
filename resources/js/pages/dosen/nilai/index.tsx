import { Head, Link } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ClipboardList, FileBarChart, PenLine } from 'lucide-react';
import * as NilaiRoutes from '@/routes/dosen/nilai';

interface KomponenNilai {
    id: number;
    nama: string;
    bobot: number;
}

interface MataKuliah {
    id: number;
    nama: string;
    kode: string;
}

interface Kelas {
    id: number;
    kode_kelas: string;
    mata_kuliah: MataKuliah[];
    komponen_nilai: KomponenNilai[];
}

export default function Index({ kelas }: { kelas: Kelas[] }) {
    return (
        <>
            <Head title="Manajemen Nilai" />

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Manajemen Penginputan Nilai"
                    description="Pilih kelas dan komponen untuk mulai menginput nilai mahasiswa."
                />

                <div className="grid gap-6 md:grid-cols-2">
                    {kelas.map((kls) => (
                        <Card key={kls.id}>
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <Badge variant="outline">{kls.kode_kelas}</Badge>
                                    <Link 
                                        href={NilaiRoutes.rekap.url({ query: { kelas_id: kls.id } })}
                                        className="text-xs text-primary hover:underline flex items-center"
                                    >
                                        <FileBarChart className="mr-1 h-3 w-3" /> Rekap Nilai
                                    </Link>
                                </div>
                                <CardTitle className="text-lg mt-2">
                                    {kls.mata_kuliah[0]?.nama || 'Mata Kuliah'}
                                </CardTitle>
                                <CardDescription>
                                    {kls.komponen_nilai.length} Komponen Penilaian
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                        Input per Komponen:
                                    </p>
                                    <div className="divide-y border rounded-lg overflow-hidden bg-background/50">
                                        {kls.komponen_nilai.length === 0 ? (
                                            <p className="text-sm text-yellow-600 bg-yellow-50/50 p-4 text-center">
                                                Belum ada komponen nilai.
                                            </p>
                                        ) : (
                                            kls.komponen_nilai.map((comp) => (
                                                <Link 
                                                    key={comp.id} 
                                                    href={NilaiRoutes.input.url({ query: { kelas_id: kls.id, komponen_id: comp.id } })}
                                                    className="flex items-center justify-between p-3 py-2.5 hover:bg-accent transition-colors group"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-1.5 rounded bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                                            <PenLine className="h-3.5 w-3.5" />
                                                        </div>
                                                        <span className="text-sm font-medium">{comp.nama}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter opacity-70">
                                                            Bobot
                                                        </span>
                                                        <Badge variant="secondary" className="text-[10px] font-bold min-w-[32px] justify-center">
                                                            {comp.bobot}%
                                                        </Badge>
                                                    </div>
                                                </Link>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {kelas.length === 0 && (
                    <div className="text-center py-12 rounded-lg border border-dashed">
                        <ClipboardList className="mx-auto h-12 w-12 text-muted-foreground/50" />
                        <h3 className="mt-4 text-sm font-medium">Tidak ada kelas aktif</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Anda belum memiliki kelas yang diampu pada semester ini.
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}
