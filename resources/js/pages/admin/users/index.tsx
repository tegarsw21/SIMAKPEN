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
import { useState } from 'react';
import { UserPlus, Edit, Trash2 } from 'lucide-react';
import * as UserRoutes from '@/routes/admin/users';

interface Role {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    nim: string | null;
    nidn: string | null;
    roles: Role[];
}

export default function Index({ users, roles }: { users: User[], roles: string[] }) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        name: '',
        email: '',
        password: '',
        role: 'mahasiswa',
        nim: '',
        nidn: '',
    });

    const openCreate = () => {
        reset();
        clearErrors();
        setEditingUser(null);
        setIsCreateOpen(true);
    };

    const openEdit = (user: User) => {
        setData({
            name: user.name,
            email: user.email,
            password: '', // Leave empty for update
            role: user.roles[0]?.name || 'mahasiswa',
            nim: user.nim || '',
            nidn: user.nidn || '',
        });
        clearErrors();
        setEditingUser(user);
        setIsCreateOpen(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingUser) {
            put(UserRoutes.update.url({ user: editingUser.id }), {
                onSuccess: () => setIsCreateOpen(false),
            });
        } else {
            post(UserRoutes.store.url(), {
                onSuccess: () => setIsCreateOpen(false),
            });
        }
    };

    const deleteUser = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus user ini?')) {
            destroy(UserRoutes.destroy.url({ user: id }));
        }
    };

    return (
        <>
            <Head title="Manajemen User" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <Heading
                        variant="small"
                        title="Daftar Pengguna"
                        description="Kelola admin, dosen, dan mahasiswa dalam sistem."
                    />
                    <Button onClick={openCreate}>
                        <UserPlus className="mr-2 h-4 w-4" /> Tambah User
                    </Button>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nama</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Identitas</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                        Belum ada data user.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            {user.nim && <span className="text-xs">NIM: {user.nim}</span>}
                                            {user.nidn && <span className="text-xs">NIDN: {user.nidn}</span>}
                                            {!user.nim && !user.nidn && <span className="text-xs text-muted-foreground">-</span>}
                                        </TableCell>
                                        <TableCell>
                                            {user.roles.map((role) => (
                                                <Badge key={role.id} variant="secondary" className="capitalize">
                                                    {role.name}
                                                </Badge>
                                            ))}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => openEdit(user)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => deleteUser(user.id)}>
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
                        <DialogTitle>{editingUser ? 'Edit User' : 'Tambah User'}</DialogTitle>
                        <DialogDescription>
                            Lengkapi informasi pengguna di bawah ini.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submit} className="space-y-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nama Lengkap</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Joko Susilo"
                            />
                            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="user@example.com"
                            />
                            {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">{editingUser ? 'Password (Kosongkan jika tidak diubah)' : 'Password'}</Label>
                            <Input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="role">Role</Label>
                            <Select
                                value={data.role}
                                onValueChange={(value) => setData('role', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map((role) => (
                                        <SelectItem key={role} value={role} className="capitalize">
                                            {role}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {data.role === 'mahasiswa' && (
                            <div className="grid gap-2">
                                <Label htmlFor="nim">NIM</Label>
                                <Input
                                    id="nim"
                                    value={data.nim}
                                    onChange={(e) => setData('nim', e.target.value)}
                                    placeholder="2024001"
                                />
                                {errors.nim && <p className="text-xs text-destructive">{errors.nim}</p>}
                            </div>
                        )}

                        {data.role === 'dosen' && (
                            <div className="grid gap-2">
                                <Label htmlFor="nidn">NIDN</Label>
                                <Input
                                    id="nidn"
                                    value={data.nidn}
                                    onChange={(e) => setData('nidn', e.target.value)}
                                    placeholder="000101..."
                                />
                                {errors.nidn && <p className="text-xs text-destructive">{errors.nidn}</p>}
                            </div>
                        )}

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {editingUser ? 'Perbarui' : 'Simpan'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
