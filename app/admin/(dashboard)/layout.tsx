import Link from 'next/link';
import { getCurrentAdmin } from '@/lib/adminSession';
import AdminLogoutButton from './AdminLogoutButton';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/leads', label: 'Leads Inbox' },
  { href: '/admin/orders', label: 'Orders' },
  { href: '/admin/tickets', label: 'Support Tickets' },
  { href: '/admin/courses', label: 'Courses' },
  { href: '/admin/mentors', label: 'Mentors' },
  { href: '/admin/current-affairs', label: 'Current Affairs' },
  { href: '/admin/quizzes', label: 'Daily Quiz' },
  { href: '/admin/resources', label: 'Resources' },
  { href: '/admin/blog', label: 'Blog' },
  { href: '/admin/faq', label: 'FAQ' },
];

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const admin = await getCurrentAdmin();

  return (
    <div className="min-h-screen bg-[#FFF5F5] flex">
      <aside className="w-60 shrink-0 bg-white border-r border-[#F3DCDD] p-5 flex flex-col justify-between">
        <div>
          <h1 className="font-heading font-black text-lg text-[#1F1A1C] mb-6">GYANAM Admin</h1>
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-[#555555] hover:bg-[#FFF5F5] hover:text-[#C12223] transition"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="space-y-2">
          {admin && <p className="text-xs text-[#888888] px-3">{admin.email}</p>}
          <AdminLogoutButton />
        </div>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
