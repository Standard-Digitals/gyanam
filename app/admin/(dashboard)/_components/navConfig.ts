import {
  LayoutDashboard,
  Inbox,
  GraduationCap,
  LifeBuoy,
  ShoppingBag,
  CreditCard,
  BookOpen,
  Users,
  Newspaper,
  Brain,
  FolderDown,
  FileText,
  HelpCircle,
} from 'lucide-react';

export const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [{ href: '/admin', label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    label: 'Learning Ops',
    items: [
      { href: '/admin/leads', label: 'Leads Inbox', icon: Inbox },
      { href: '/admin/enrollments', label: 'Enrollments', icon: GraduationCap },
      { href: '/admin/tickets', label: 'Support Tickets', icon: LifeBuoy },
    ],
  },
  {
    label: 'Commerce',
    items: [
      { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
      { href: '/admin/payments', label: 'Payments', icon: CreditCard },
    ],
  },
  {
    label: 'Content',
    items: [
      { href: '/admin/courses', label: 'Courses', icon: BookOpen },
      { href: '/admin/mentors', label: 'Mentors', icon: Users },
      { href: '/admin/current-affairs', label: 'Current Affairs', icon: Newspaper },
      { href: '/admin/quizzes', label: 'Daily Quiz', icon: Brain },
      { href: '/admin/resources', label: 'Resources', icon: FolderDown },
      { href: '/admin/blog', label: 'Blog', icon: FileText },
      { href: '/admin/faq', label: 'FAQ', icon: HelpCircle },
    ],
  },
];
