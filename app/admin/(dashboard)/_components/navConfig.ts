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

export const QUICK_ACTIONS = [
  { href: '/admin/courses', label: 'New Course', sub: 'Create a batch', icon: BookOpen, bg: 'linear-gradient(135deg,#E94C3D,#C12223)' },
  { href: '/admin/mentors', label: 'Add Mentor', sub: 'Faculty profile', icon: Users, bg: 'linear-gradient(135deg,#4C6EF5,#3B5BDB)' },
  { href: '/admin/current-affairs', label: 'Publish Article', sub: 'Current affairs', icon: Newspaper, bg: 'linear-gradient(135deg,#F59F00,#E67700)' },
  { href: '/admin/resources', label: 'New Resource', sub: 'Notes & PYQs', icon: FolderDown, bg: 'linear-gradient(135deg,#0CA5B0,#0B8792)' },
];

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
