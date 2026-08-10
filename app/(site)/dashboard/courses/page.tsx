import { BookOpen } from 'lucide-react';

export default function DashboardCoursesPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-heading font-black text-2xl text-[#1F1A1C]">My Enrolled Courses</h1>
      <div className="bg-white p-10 rounded-2xl border border-[#F3DCDD] shadow-sm text-center space-y-2">
        <BookOpen className="w-10 h-10 text-[#C12223] mx-auto" />
        <p className="text-sm text-[#555555]">
          Course enrollment & payments are launching soon. Once live, your enrolled batches will show up here automatically.
        </p>
      </div>
    </div>
  );
}
