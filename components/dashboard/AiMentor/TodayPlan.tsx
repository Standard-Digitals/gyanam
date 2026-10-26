import Link from 'next/link';
import { Sparkles, ChevronRight } from 'lucide-react';
import type { MentorPlanItem } from '@/lib/data/aiMentor';

export function TodayPlan({ plan }: { plan: MentorPlanItem[] }) {
  if (plan.length === 0) return null;

  return (
    <div className="bg-white p-4 rounded-2xl border border-[#F3DCDD] shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-[#C12223]" />
        <h3 className="font-heading font-black text-sm text-[#1F1A1C]">Today&apos;s plan from Gyanmitra</h3>
      </div>
      <div className="space-y-2">
        {plan.map((item, i) => (
          <Link
            key={i}
            href={item.href}
            className="flex items-center gap-3 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl p-3 hover:border-[#C12223] transition"
          >
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-[#1F1A1C] truncate">{item.title}</p>
              <p className="text-[11px] text-[#888888]">{item.meta}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-[#C12223] shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}
