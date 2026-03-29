import { Head, useForm, Link } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { ArrowLeft, Save } from 'lucide-react';
import { useEffect } from 'react';
import * as NilaiRoutes from '@/routes/dosen/nilai';

interface Mahasiswa {
    id: number;
    name: string;
    nim: string;
}

interface KelasMahasiswa {
    id: number;
    mahasiswa: Mahasiswa;
}

interface Nilai {
    skor: number;
    catatan: string | null;
}

interface Props {
    kelas: { id: number; kode_kelas: string; mata_kuliah: Array<{ nama: string }> };
    komponen: { id: number; nama: string; bobot: number };
    mahasiswas: KelasMahasiswa[];
    existing_nilai: Record<number, Nilai>;
}

export default function InputNilai({ kelas, komponen, mahasiswas, existing_nilai }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        komponen_id: komponen.id,
        nilai: mahasiswas.map(m => ({
            kelas_mahasiswa_id: m.id,
            skor: existing_nilai[m.id]?.skor || 0,
            catatan: existing_nilai[m.id]?.catatan || '',
        })),
    });

    const handleSkorChange = (index: number, value: string) => {
        const newNilai = [...data.nilai];
        newNilai[index].skor = parseFloat(value) || 0;
        setData('nilai', newNilai);
    };

    const handleCatatanChange = (index: number, value: string) => {
        const newNilai = [...data.nilai];
        newNilai[index].catatan = value;
        setData('nilai', newNilai);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(NilaiRoutes.store.url());
    };

    return (
        <>
            <Head title={`Input Nilai ${komponen.nama}`} />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={NilaiRoutes.index.url()}>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <Heading
                        variant="small"
                        title={`Input Nilai: ${komponen.nama}`}
                        description={`${kelas.mata_kuliah[0].nama} (${kelas.kode_kelas}) - Bobot: ${komponen.bobot}%`}
                    />
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div className="rounded-md border bg-card">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[150px]">NIM</TableHead>
                                    <TableHead>Nama Mahasiswa</TableHead>
                                    <TableHead className="w-[120px]">Skor (0-100)</TableHead>
                                    <TableHead>Catatan (Opsional)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mahasiswas.map((m, index) => (
                                    <TableRow key={m.id}>
                                        <TableCell className="font-mono text-xs">{m.mahasiswa.nim}</TableCell>
                                        <TableCell className="font-medium text-sm">{m.mahasiswa.name}</TableCell>
                                        <TableCell>
                                            <Input
                                                type="number"
                                                min="0"
                                                max="100"
                                                step="0.01"
                                                value={data.nilai[index].skor}
                                                onChange={(e) => handleSkorChange(index, e.target.value)}
                                                className="h-8 text-center"
                                            />
                                            {errors[`nilai.${index}.skor` as keyof typeof errors] && (
                                                <p className="text-[10px] text-destructive mt-1">Error</p>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                value={data.nilai[index].catatan || ''}
                                                onChange={(e) => handleCatatanChange(index, e.target.value)}
                                                placeholder="Berikan feedback..."
                                                className="h-8 text-xs"
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}

                                {mahasiswas.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                            Tidak ada mahasiswa terdaftar di kelas ini.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button variant="outline" type="button" asChild>
                            <Link href={NilaiRoutes.index.url()}>Batal</Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" /> Simpan Semua Nilai
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}
