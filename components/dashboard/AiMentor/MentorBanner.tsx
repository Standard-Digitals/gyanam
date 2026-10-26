import Link from 'next/link';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import type { MentorBannerInfo } from '@/lib/data/aiMentor';

export function MentorBanner({ banner }: { banner: MentorBannerInfo }) {
  return (
    <Link
      href={banner.href}
      className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4 hover:border-amber-400 transition"
    >
      <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
        <Sparkles className="w-4 h-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-black text-amber-700 uppercase tracking-wide">Gyanmitra · Your mentor</p>
        <p className="text-sm font-bold text-[#1F1A1C] mt-0.5">{banner.title}</p>
        <p className="text-xs text-[#555555] mt-0.5">{banner.body}</p>
      </div>
      <ArrowUpRight className="w-4 h-4 text-amber-700 shrink-0 mt-1" />
    </Link>
  );
}
