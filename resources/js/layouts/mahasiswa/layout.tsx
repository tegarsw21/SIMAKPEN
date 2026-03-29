import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/types';
import { ClipboardList } from 'lucide-react';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Nilai Saya',
        href: '/mahasiswa/nilai',
        icon: ClipboardList,
    },
];

export default function MahasiswaLayout({ children }: PropsWithChildren) {
    return (
        <div className="px-4 py-6 space-y-8">
            <Heading
                title="Mahasiswa Panel"
                description="Lihat hasil penilaian akademik Anda"
            />
            <div className="md:max-w-6xl">
                {children}
            </div>
        </div>
    );
}
