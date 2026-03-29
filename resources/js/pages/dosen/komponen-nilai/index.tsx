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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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
import * as KomponenRoutes from '@/routes/dosen/komponen-nilai';

interface Kelas {
    id: number;
    kode_kelas: string;
}

interface KomponenNilai {
    id: number;
    kelas_id: number;
    nama: string;
    bobot: number;
    kelas: Kelas;
}

export default function Index({ komponen, my_kelas }: { komponen: KomponenNilai[], my_kelas: Kelas[] }) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingKomponen, setEditingKomponen] = useState<KomponenNilai | null>(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        kelas_id: '',
        nama: '',
        bobot: 0,
    });

    const openCreate = () => {
        reset();
        clearErrors();
        setEditingKomponen(null);
        setIsCreateOpen(true);
    };

    const openEdit = (item: KomponenNilai) => {
        setData({
            kelas_id: item.kelas_id.toString(),
            nama: item.nama,
            bobot: item.bobot,
        });
        clearErrors();
        setEditingKomponen(item);
        setIsCreateOpen(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const options = {
            onSuccess: () => setIsCreateOpen(false),
        };

        if (editingKomponen) {
            put(KomponenRoutes.update.url({ komponen_nilai: editingKomponen.id }), options);
        } else {
            post(KomponenRoutes.store.url(), options);
        }
    };

    const deleteKomponen = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus komponen nilai ini?')) {
            destroy(KomponenRoutes.destroy.url({ komponen_nilai: id }));
        }
    };

    // Grouping components by class for better view
    const groupedKomponen = my_kelas.map(kelas => ({
        ...kelas,
        components: komponen.filter(k => k.kelas_id === kelas.id)
    }));

    return (
        <>
            <Head title="Komponen Nilai" />

            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <Heading
                        variant="small"
                        title="Pengaturan Komponen Nilai"
                        description="Atur bobot UTS, UAS, Tugas, dll untuk setiap kelas Anda."
                    />
                    <Button onClick={openCreate}>
                        <Plus className="mr-2 h-4 w-4" /> Tambah Komponen
                    </Button>
                </div>

                {groupedKomponen.map((kls) => (
                    <div key={kls.id} className="space-y-4">
                        <div className="flex items-center gap-2">
                            <h3 className="text-sm font-semibold">Kelas: {kls.kode_kelas}</h3>
                            <span className="text-xs text-muted-foreground">
                                (Total Bobot: {kls.components.reduce((sum, k) => sum + Number(k.bobot), 0)}%)
                            </span>
                        </div>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nama Komponen</TableHead>
                                        <TableHead className="text-center">Bobot (%)</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {kls.components.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={3} className="h-16 text-center text-muted-foreground text-xs">
                                                Belum ada komponen nilai untuk kelas ini.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        kls.components.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell className="font-medium">{item.nama}</TableCell>
                                                <TableCell className="text-center">{item.bobot}%</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button variant="ghost" size="icon" onClick={() => openEdit(item)}>
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => deleteKomponen(item.id)}>
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
                ))}
            </div>

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingKomponen ? 'Edit Komponen' : 'Tambah Komponen'}</DialogTitle>
                        <DialogDescription>
                            Pastikan total bobot dalam satu kelas berjumlah 100%.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submit} className="space-y-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="kelas_id">Pilih Kelas</Label>
                            <Select 
                                value={data.kelas_id} 
                                onValueChange={(v) => setData('kelas_id', v)}
                                disabled={!!editingKomponen}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Kelas" />
                                </SelectTrigger>
                                <SelectContent>
                                    {my_kelas.map((k) => (
                                        <SelectItem key={k.id} value={k.id.toString()}>{k.kode_kelas}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.kelas_id && <p className="text-xs text-destructive">{errors.kelas_id}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="nama">Nama Komponen</Label>
                            <Input 
                                id="nama" 
                                value={data.nama} 
                                onChange={(e) => setData('nama', e.target.value)} 
                                placeholder="Misal: UTS" 
                            />
                            {errors.nama && <p className="text-xs text-destructive">{errors.nama}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="bobot">Bobot (%)</Label>
                            <Input 
                                id="bobot" 
                                type="number" 
                                value={data.bobot} 
                                onChange={(e) => setData('bobot', parseFloat(e.target.value) || 0)} 
                            />
                            {errors.bobot && <p className="text-xs text-destructive">{errors.bobot}</p>}
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {editingKomponen ? 'Perbarui' : 'Simpan'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
