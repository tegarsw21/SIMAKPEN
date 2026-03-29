import { Head, Link } from '@inertiajs/react';
import Heading from '@/components/heading';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Users, Calendar } from 'lucide-react';

interface MataKuliah {
    id: number;
    nama: string;
    kode: string;
}

interface Kelas {
    id: number;
    kode_kelas: string;
    semester: string;
    ruangan: string | null;
    jadwal: string | null;
    kapasitas: number;
    status: string;
    mata_kuliah: MataKuliah[];
}

export default function Index({ kelas }: { kelas: Kelas[] }) {
    return (
        <>
            <Head title="Kelas Saya" />

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Daftar Kelas Saya"
                    description="Lihat mata kuliah yang sedang Anda ampu pada semester ini."
                />

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {kelas.map((kls) => (
                        <Card key={kls.id} className="relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-3">
                                <Badge variant={kls.status === 'aktif' ? 'default' : 'secondary'}>
                                    {kls.status}
                                </Badge>
                            </div>
                            <CardHeader className="pb-4">
                                <CardDescription className="text-xs font-mono">{kls.kode_kelas}</CardDescription>
                                <CardTitle className="text-xl">
                                    {kls.mata_kuliah[0]?.nama || 'Mata Kuliah'}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Calendar className="mr-2 h-4 w-4" />
                                        {kls.jadwal || 'Jadwal belum diatur'}
                                    </div>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Users className="mr-2 h-4 w-4" />
                                        Kapasitas: {kls.kapasitas} Mahasiswa
                                    </div>
                                </div>
                                
                                <div className="pt-2">
                                    <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Mata Kuliah Terkait:</p>
                                    <div className="flex flex-wrap gap-1">
                                        {kls.mata_kuliah.map(mk => (
                                            <Badge key={mk.id} variant="outline" className="text-[10px]">
                                                {mk.kode} - {mk.nama}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {kelas.length === 0 && (
                    <div className="text-center py-20 border-2 border-dashed rounded-xl">
                        <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground/30" />
                        <h3 className="mt-4 text-sm font-semibold">Belum Ada Kelas</h3>
                        <p className="text-sm text-muted-foreground mt-1">Anda belum ditugaskan untuk mengampu kelas pada semester ini.</p>
                    </div>
                )}
            </div>
        </>
    );
}
