import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    ClipboardList,
    FileBarChart,
    FolderGit2,
    GraduationCap,
    LayoutGrid,
    Library,
    PenLine,
    School,
    Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

// ─── Menu items per role ─────────────────────────────────

// Menu yang ditampilkan untuk semua role
const commonNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
];

// Menu khusus Admin
const adminNavItems: NavItem[] = [
    {
        title: 'Kelola Kelas',
        href: '/admin/kelas',
        icon: School,
    },
    {
        title: 'Mata Kuliah',
        href: '/admin/mata-kuliah',
        icon: Library,
    },
    {
        title: 'Manajemen User',
        href: '/admin/users',
        icon: Users,
    },
];

// Menu khusus Dosen
const dosenNavItems: NavItem[] = [
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
        title: 'Input & Rekap Nilai',
        href: '/dosen/nilai',
        icon: ClipboardList,
    },
];

// Menu khusus Mahasiswa
const mahasiswaNavItems: NavItem[] = [
    {
        title: 'Nilai Saya',
        href: '/mahasiswa/nilai',
        icon: ClipboardList,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { auth } = usePage().props;
    const roles = auth.roles ?? [];

    // Bangun menu berdasarkan role user
    const roleMenuItems: NavItem[] = [];

    if (roles.includes('admin')) {
        roleMenuItems.push(...adminNavItems);
    }

    if (roles.includes('dosen')) {
        roleMenuItems.push(...dosenNavItems);
    }

    if (roles.includes('mahasiswa')) {
        roleMenuItems.push(...mahasiswaNavItems);
    }

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={commonNavItems} label="Umum" />
                {roleMenuItems.length > 0 && (
                    <NavMain
                        items={roleMenuItems}
                        label={
                            roles.includes('admin')
                                ? 'Admin'
                                : roles.includes('dosen')
                                  ? 'Dosen'
                                  : 'Mahasiswa'
                        }
                    />
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
