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
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import * as KelasRoutes from '@/routes/admin/kelas';

interface MataKuliah {
    id: number;
    kode: string;
    nama: string;
}

interface Dosen {
    id: number;
    name: string;
}

interface Kelas {
    id: number;
    kode_kelas: string;
    dosen_id: number;
    semester: string;
    ruangan: string | null;
    jadwal: string | null;
    kapasitas: number;
    status: 'aktif' | 'selesai' | 'dibatalkan';
    dosen: Dosen;
    mata_kuliah: MataKuliah[];
}

export default function Index({ kelas, dosens, mata_kuliah }: { kelas: Kelas[], dosens: Dosen[], mata_kuliah: MataKuliah[] }) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingKelas, setEditingKelas] = useState<Kelas | null>(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        kode_kelas: '',
        dosen_id: '',
        semester: '2025/2026 Genap',
        ruangan: '',
        jadwal: '',
        kapasitas: 40,
        status: 'aktif',
        mata_kuliah_ids: [] as number[],
    });

    const openCreate = () => {
        reset();
        clearErrors();
        setEditingKelas(null);
        setIsCreateOpen(true);
    };

    const openEdit = (item: Kelas) => {
        setData({
            kode_kelas: item.kode_kelas,
            dosen_id: item.dosen_id.toString(),
            semester: item.semester,
            ruangan: item.ruangan || '',
            jadwal: item.jadwal || '',
            kapasitas: item.kapasitas,
            status: item.status,
            mata_kuliah_ids: item.mata_kuliah.map((mk) => mk.id),
        });
        clearErrors();
        setEditingKelas(item);
        setIsCreateOpen(true);
    };

    const handleMatkulToggle = (id: number) => {
        const current = data.mata_kuliah_ids;
        if (current.includes(id)) {
            setData('mata_kuliah_ids', current.filter((v) => v !== id));
        } else {
            setData('mata_kuliah_ids', [...current, id]);
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const options = {
            onSuccess: () => setIsCreateOpen(false),
        };

        if (editingKelas) {
            put(KelasRoutes.update.url({ kela: editingKelas.id }), options);
        } else {
            post(KelasRoutes.store.url(), options);
        }
    };

    const deleteKelas = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus kelas ini?')) {
            destroy(KelasRoutes.destroy.url({ kela: id }));
        }
    };

    return (
        <>
            <Head title="Manajemen Kelas" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <Heading
                        variant="small"
                        title="Daftar Kelas"
                        description="Kelola jadwal, dosen, dan mata kuliah pengampu."
                    />
                    <Button onClick={openCreate}>
                        <Plus className="mr-2 h-4 w-4" /> Tambah Kelas
                    </Button>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Kode Kelas</TableHead>
                                <TableHead>Dosen Pengampu</TableHead>
                                <TableHead>Mata Kuliah</TableHead>
                                <TableHead>Jadwal / Ruang</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {kelas.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                        Belum ada data kelas.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                kelas.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">{item.kode_kelas}</TableCell>
                                        <TableCell>{item.dosen.name}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {item.mata_kuliah.map((mk) => (
                                                    <Badge key={mk.id} variant="outline" className="text-[10px]">
                                                        {mk.nama}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-xs">
                                                <p>{item.jadwal || '-'}</p>
                                                <p className="text-muted-foreground">{item.ruangan || '-'}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={item.status === 'aktif' ? 'default' : 'secondary'} className="capitalize">
                                                {item.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => openEdit(item)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => deleteKelas(item.id)}>
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
                <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle>{editingKelas ? 'Edit Kelas' : 'Tambah Kelas'}</DialogTitle>
                        <DialogDescription>
                            Tentukan dosen pengampu dan mata kuliah yang diajarkan di kelas ini.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submit} className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="kode_kelas">Kode Kelas</Label>
                                <Input id="kode_kelas" value={data.kode_kelas} onChange={(e) => setData('kode_kelas', e.target.value)} placeholder="IF101-A" />
                                {errors.kode_kelas && <p className="text-xs text-destructive">{errors.kode_kelas}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="dosen_id">Dosen Pengampu</Label>
                                <Select value={data.dosen_id} onValueChange={(v) => setData('dosen_id', v)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Dosen" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {dosens.map((d) => (
                                            <SelectItem key={d.id} value={d.id.toString()}>{d.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.dosen_id && <p className="text-xs text-destructive">{errors.dosen_id}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="semester">Semester</Label>
                                <Input id="semester" value={data.semester} onChange={(e) => setData('semester', e.target.value)} />
                                {errors.semester && <p className="text-xs text-destructive">{errors.semester}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="kapasitas">Kapasitas</Label>
                                <Input id="kapasitas" type="number" value={data.kapasitas} onChange={(e) => setData('kapasitas', parseInt(e.target.value) || 0)} />
                                {errors.kapasitas && <p className="text-xs text-destructive">{errors.kapasitas}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="jadwal">Jadwal</Label>
                                <Input id="jadwal" value={data.jadwal} onChange={(e) => setData('jadwal', e.target.value)} placeholder="Senin 08:00-10:00" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="ruangan">Ruangan</Label>
                                <Input id="ruangan" value={data.ruangan} onChange={(e) => setData('ruangan', e.target.value)} placeholder="Lab 1" />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="status">Status</Label>
                            <Select value={data.status} onValueChange={(v: any) => setData('status', v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="aktif">Aktif</SelectItem>
                                    <SelectItem value="selesai">Selesai</SelectItem>
                                    <SelectItem value="dibatalkan">Dibatalkan</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label>Pilih Mata Kuliah</Label>
                            <div className="grid grid-cols-2 gap-2 border rounded-md p-3 max-h-40 overflow-y-auto">
                                {mata_kuliah.map((mk) => (
                                    <div key={mk.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`mk-${mk.id}`}
                                            checked={data.mata_kuliah_ids.includes(mk.id)}
                                            onCheckedChange={() => handleMatkulToggle(mk.id)}
                                        />
                                        <label htmlFor={`mk-${mk.id}`} className="text-xs">{mk.kode} - {mk.nama}</label>
                                    </div>
                                ))}
                            </div>
                            {errors.mata_kuliah_ids && <p className="text-xs text-destructive">{errors.mata_kuliah_ids}</p>}
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {editingKelas ? 'Perbarui' : 'Simpan'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
