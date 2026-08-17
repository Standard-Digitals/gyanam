'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BookOpen, Trophy, ClipboardCheck, BarChart3, Download, Package, User, type LucideIcon } from 'lucide-react';

export const NAV_ITEMS: { href: string; label: string; shortLabel: string; icon: LucideIcon; showInBottomNav?: boolean }[] = [
  { href: '/dashboard', label: 'Overview', shortLabel: 'Home', icon: LayoutDashboard, showInBottomNav: true },
  { href: '/dashboard/courses', label: 'My Courses', shortLabel: 'Courses', icon: BookOpen, showInBottomNav: true },
  { href: '/dashboard/mock-tests', label: 'Mock Tests', shortLabel: 'Mocks', icon: ClipboardCheck, showInBottomNav: true },
  { href: '/dashboard/quiz-history', label: 'Quiz History', shortLabel: 'Quizzes', icon: Trophy },
  { href: '/dashboard/performance', label: 'Performance', shortLabel: 'Stats', icon: BarChart3, showInBottomNav: true },
  { href: '/dashboard/downloads', label: 'Downloads', shortLabel: 'Files', icon: Download },
  { href: '/dashboard/orders', label: 'My Orders', shortLabel: 'Orders', icon: Package },
  { href: '/dashboard/profile', label: 'Profile', shortLabel: 'Profile', icon: User, showInBottomNav: true },
];

function isActive(pathname: string, href: string) {
  return href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href);
}

export function SidebarNav() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = isActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
              active ? 'bg-[#FDEAE9] text-[#C12223]' : 'text-[#6B6162] hover:bg-white hover:text-[#C12223]'
            }`}
          >
            <Icon className="w-[18px] h-[18px] shrink-0" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-white/95 backdrop-blur border-t border-[#F3DCDD] flex px-1 pt-1.5 pb-[calc(6px+env(safe-area-inset-bottom))]">
      {NAV_ITEMS.filter((item) => item.showInBottomNav).map(({ href, shortLabel, icon: Icon }) => {
        const active = isActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex-1 flex flex-col items-center gap-1 py-1.5 rounded-xl text-[9.5px] font-bold ${
              active ? 'text-[#C12223]' : 'text-[#C7B4B3]'
            }`}
          >
            <Icon className="w-5 h-5" strokeWidth={active ? 2.4 : 2} />
            {shortLabel}
          </Link>
        );
      })}
    </nav>
  );
}
