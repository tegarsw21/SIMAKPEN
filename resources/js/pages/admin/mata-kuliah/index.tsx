import { Head, useForm } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import * as MataKuliahRoutes from '@/routes/admin/mata-kuliah';

interface MataKuliah {
    id: number;
    kode: string;
    nama: string;
    sks: number;
    deskripsi: string | null;
}

export default function Index({ mata_kuliah }: { mata_kuliah: MataKuliah[] }) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingMatkul, setEditingMatkul] = useState<MataKuliah | null>(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        kode: '',
        nama: '',
        sks: 3,
        deskripsi: '',
    });

    const openCreate = () => {
        reset();
        clearErrors();
        setEditingMatkul(null);
        setIsCreateOpen(true);
    };

    const openEdit = (matkul: MataKuliah) => {
        setData({
            kode: matkul.kode,
            nama: matkul.nama,
            sks: matkul.sks,
            deskripsi: matkul.deskripsi || '',
        });
        clearErrors();
        setEditingMatkul(matkul);
        setIsCreateOpen(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingMatkul) {
            put(MataKuliahRoutes.update.url({ mata_kuliah: editingMatkul.id }), {
                onSuccess: () => setIsCreateOpen(false),
            });
        } else {
            post(MataKuliahRoutes.store.url(), {
                onSuccess: () => setIsCreateOpen(false),
            });
        }
    };

    const deleteMatkul = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus mata kuliah ini?')) {
            destroy(MataKuliahRoutes.destroy.url({ mata_kuliah: id }));
        }
    };

    return (
        <>
            <Head title="Manajemen Mata Kuliah" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <Heading
                        variant="small"
                        title="Daftar Mata Kuliah"
                        description="Kelola seluruh mata kuliah yang tersedia di sistem."
                    />
                    <Button onClick={openCreate}>
                        <Plus className="mr-2 h-4 w-4" /> Tambah MK
                    </Button>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Kode</TableHead>
                                <TableHead>Nama Mata Kuliah</TableHead>
                                <TableHead className="text-center">SKS</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mata_kuliah.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                        Belum ada data mata kuliah.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                mata_kuliah.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">{item.kode}</TableCell>
                                        <TableCell>{item.nama}</TableCell>
                                        <TableCell className="text-center">{item.sks}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => openEdit(item)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => deleteMatkul(item.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingMatkul ? 'Edit Mata Kuliah' : 'Tambah Mata Kuliah'}</DialogTitle>
                        <DialogDescription>
                            Lengkapi informasi mata kuliah di bawah ini.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submit} className="space-y-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="kode">Kode Mata Kuliah</Label>
                            <Input
                                id="kode"
                                value={data.kode}
                                onChange={(e) => setData('kode', e.target.value)}
                                placeholder="Misal: IF101"
                            />
                            {errors.kode && <p className="text-xs text-destructive">{errors.kode}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="nama">Nama Mata Kuliah</Label>
                            <Input
                                id="nama"
                                value={data.nama}
                                onChange={(e) => setData('nama', e.target.value)}
                                placeholder="Nama lengkap mata kuliah"
                            />
                            {errors.nama && <p className="text-xs text-destructive">{errors.nama}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="sks">SKS</Label>
                            <Input
                                id="sks"
                                type="number"
                                min="1"
                                max="8"
                                value={data.sks}
                                onChange={(e) => setData('sks', parseInt(e.target.value) || 0)}
                            />
                            {errors.sks && <p className="text-xs text-destructive">{errors.sks}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="deskripsi">Deskripsi (Opsional)</Label>
                            <Textarea
                                id="deskripsi"
                                value={data.deskripsi}
                                onChange={(e) => setData('deskripsi', e.target.value)}
                                placeholder="Deskripsi singkat mengenai mata kuliah"
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {editingMatkul ? 'Perbarui' : 'Simpan'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
