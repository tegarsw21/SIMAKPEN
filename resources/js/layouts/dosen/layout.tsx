import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/types';
import { GraduationCap, PenLine, ClipboardList, FileBarChart } from 'lucide-react';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Kelas Saya',
        href: '/dosen/kelas',
        icon: GraduationCap,
    },
    {
        title: 'Komponen Nilai',
        href: '/dosen/komponen-nilai',
        icon: PenLine,
    },
    {
        title: 'Input Nilai',
        href: '/dosen/nilai/input',
        icon: PenLine,
    },
    {
        title: 'Lihat Nilai',
        href: '/dosen/nilai',
        icon: ClipboardList,
    },
    {
        title: 'Rekap Nilai',
        href: '/dosen/nilai/rekap',
        icon: FileBarChart,
    },
];

export default function DosenLayout({ children }: PropsWithChildren) {
    return (
        <div className="px-4 py-6 space-y-8">
            <Heading
                title="Dosen Panel"
                description="Kelola kelas dan penilaian mahasiswa"
            />
            <div className="md:max-w-6xl">
                {children}
            </div>
        </div>
    );
}
