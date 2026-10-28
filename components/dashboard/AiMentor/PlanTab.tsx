'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sparkles, ChevronRight, ChevronDown, GraduationCap, CheckCircle2, Circle, ClipboardList, Map as MapIcon, ListChecks } from 'lucide-react';
import type { MentorOverview, WeeklySchedule, RoadmapPhase, WeeklyChecklistState } from '@/lib/data/aiMentor';

interface PlanData extends MentorOverview {
  dailyScheduleBlocks: WeeklySchedule | null;
  roadmap: RoadmapPhase[] | null;
}

function WeeklyChecklist() {
  const [state, setState] = useState<WeeklyChecklistState | null>(null);
  const [pending, setPending] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/dashboard/ai-mentor/checklist')
      .then((res) => (res.ok ? res.json() : null))
      .then(setState)
      .catch(() => setState(null));
  }, []);

  if (!state) return null;

  const toggle = async (index: number) => {
    setPending(index);
    try {
      const res = await fetch('/api/dashboard/ai-mentor/checklist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ index }),
      });
      if (res.ok) setState(await res.json());
    } finally {
      setPending(null);
    }
  };

  const doneCount = state.items.filter((i) => i.checked).length;

  return (
    <div className="bg-white p-4 rounded-2xl border border-[#F3DCDD] space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ListChecks className="w-4 h-4 text-[#C12223]" />
          <p className="text-[10px] font-black text-[#C12223] uppercase tracking-wide">This Week's Checklist</p>
        </div>
        <span className="font-plexmono font-bold text-xs text-[#888888]">
          {doneCount}/{state.items.length}
        </span>
      </div>
      <div className="space-y-2">
        {state.items.map((item) => (
          <button
            key={item.index}
            onClick={() => toggle(item.index)}
            disabled={pending === item.index}
            className="w-full flex items-start gap-2.5 text-left cursor-pointer disabled:opacity-60"
          >
            {item.checked ? (
              <CheckCircle2 className="w-4 h-4 text-[#C12223] shrink-0 mt-0.5" />
            ) : (
              <Circle className="w-4 h-4 text-[#D9B4B5] shrink-0 mt-0.5" />
            )}
            <span className={`text-xs ${item.checked ? 'text-[#888888] line-through' : 'text-[#1F1A1C]'}`}>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ScheduleChart({ schedule }: { schedule: WeeklySchedule }) {
  const maxMinutes = Math.max(...schedule.weekdayBlocks.map((b) => b.minutes));
  return (
    <div className="bg-white p-4 rounded-2xl border border-[#F3DCDD] space-y-3">
      <div className="flex items-center gap-2">
        <ClipboardList className="w-4 h-4 text-[#C12223]" />
        <p className="text-[10px] font-black text-[#C12223] uppercase tracking-wide">Your Weekly Study Routine</p>
      </div>
      <p className="text-[10px] font-bold text-[#888888] uppercase tracking-wide">Monday – Saturday, daily</p>
      <div className="space-y-2.5">
        {schedule.weekdayBlocks.map((b, i) => (
          <div key={i}>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-[#1F1A1C]">{b.subject}</span>
              <span className="font-plexmono font-bold text-[#888888]">{b.minutes} min</span>
            </div>
            <div className="h-2 bg-[#F3DCDD] rounded-full overflow-hidden">
              <div className="h-full bg-[#C12223] rounded-full" style={{ width: `${(b.minutes / maxMinutes) * 100}%` }} />
            </div>
            {b.topic && <p className="text-[11px] text-[#C12223] font-semibold mt-1">Today: {b.topic}</p>}
          </div>
        ))}
      </div>
      <div className="pt-2 border-t border-[#F3DCDD]">
        <p className="text-[10px] font-black text-[#888888] uppercase tracking-wide mb-1">Sunday</p>
        <p className="text-xs text-[#555555]">{schedule.sundayPlan}</p>
      </div>
    </div>
  );
}

function RoadmapView({ phases }: { phases: RoadmapPhase[] }) {
  const [openIndex, setOpenIndex] = useState(0);
  return (
    <div className="bg-white p-4 rounded-2xl border border-[#F3DCDD] space-y-3">
      <div className="flex items-center gap-2">
        <MapIcon className="w-4 h-4 text-[#C12223]" />
        <p className="text-[10px] font-black text-[#C12223] uppercase tracking-wide">Your Roadmap to Exam Day</p>
      </div>
      <div className="space-y-2">
        {phases.map((phase, i) => {
          const open = openIndex === i;
          return (
            <div key={i} className="border border-[#F3DCDD] rounded-xl overflow-hidden">
              <button onClick={() => setOpenIndex(open ? -1 : i)} className="w-full flex items-center justify-between gap-2 p-3 text-left cursor-pointer">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#1F1A1C]">{phase.label}</p>
                  <p className="text-[10px] text-[#888888] mt-0.5">{phase.dateRangeLabel}</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-[#C12223] shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
              </button>
              {open && (
                <div className="px-3 pb-3 space-y-2.5">
                  <p className="text-[11px] text-[#555555]">{phase.targetNote}</p>
                  {phase.subjects.map((s, j) => (
                    <div key={j}>
                      <p className="text-[11px] font-bold text-[#1F1A1C]">{s.subject}</p>
                      <p className="text-[11px] text-[#888888]">{s.topics.length ? s.topics.join(', ') : 'Revision & practice'}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function PlanTab({ onTalkToCounsellor, onBrowseCourses }: { onTalkToCounsellor?: () => void; onBrowseCourses?: () => void }) {
  const [data, setData] = useState<PlanData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard/ai-mentor/plan')
      .then((res) => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-xs text-[#888888] p-4">Loading...</p>;
  if (!data) return <p className="text-xs text-[#888888] p-4">Couldn't load your plan — try again.</p>;

  if (data.mode === 'counsellor') {
    return (
      <div className="p-4 space-y-4">
        {data.dailyScheduleBlocks && <ScheduleChart schedule={data.dailyScheduleBlocks} />}
        {data.roadmap && data.roadmap.length > 0 && <RoadmapView phases={data.roadmap} />}
        {data.dailyScheduleBlocks && <WeeklyChecklist />}
        {data.courseSuggestion ? (
          <div className="bg-white p-4 rounded-2xl border border-[#F3DCDD]">
            <div className="flex items-center gap-2 mb-1">
              <GraduationCap className="w-4 h-4 text-[#C12223]" />
              <p className="text-[10px] font-black text-[#C12223] uppercase tracking-wide">Suggested by Gyanmitra · Premium batch</p>
            </div>
            <h3 className="font-heading font-black text-sm text-[#1F1A1C] mb-1">{data.courseSuggestion.title}</h3>
            <p className="text-xs mb-2">
              <span className="font-black text-[#C12223]">₹{data.courseSuggestion.discountPrice}</span>{' '}
              {data.courseSuggestion.originalPrice > data.courseSuggestion.discountPrice && (
                <span className="text-[#888888] line-through">₹{data.courseSuggestion.originalPrice}</span>
              )}
            </p>
            <ul className="space-y-1.5 mb-3">
              {data.courseSuggestion.reasons.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-[#555555]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-2">
              <Link href={data.courseSuggestion.href} className="inline-block px-4 py-2 bg-[#C12223] text-white font-bold text-xs rounded-xl">
                Enroll Now
              </Link>
              {onTalkToCounsellor && (
                <button
                  onClick={onTalkToCounsellor}
                  className="inline-block px-4 py-2 bg-[#FDEAE9] text-[#C12223] font-bold text-xs rounded-xl cursor-pointer"
                >
                  Talk to a Counsellor
                </button>
              )}
            </div>
          </div>
        ) : onBrowseCourses ? (
          <div className="space-y-2">
            <p className="text-xs text-[#888888]">You're not enrolled in a course yet.</p>
            <button onClick={onBrowseCourses} className="px-4 py-2 bg-[#C12223] text-white font-bold text-xs rounded-xl cursor-pointer">
              Browse Courses
            </button>
          </div>
        ) : (
          <p className="text-xs text-[#888888]">You're not enrolled in a course yet — browse courses to get started.</p>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 space-y-3">
      {data.dailyScheduleBlocks && <ScheduleChart schedule={data.dailyScheduleBlocks} />}
      {data.roadmap && data.roadmap.length > 0 && <RoadmapView phases={data.roadmap} />}
      {data.dailyScheduleBlocks && <WeeklyChecklist />}
      {data.banner && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5">
          <p className="text-[10px] font-black text-amber-700 uppercase tracking-wide">Waiting for you</p>
          <p className="text-sm font-bold text-[#1F1A1C] mt-0.5">{data.banner.title}</p>
          <p className="text-xs text-[#555555] mt-0.5">{data.banner.body}</p>
        </div>
      )}
      {data.plan.length === 0 ? (
        <p className="text-xs text-[#888888]">Nothing left for today — nicely done.</p>
      ) : (
        <div className="space-y-2">
          {data.plan.map((item, i) => (
            <Link key={i} href={item.href} className="flex items-center gap-3 bg-white border border-[#F3DCDD] rounded-xl p-3 hover:border-[#C12223] transition">
              <div className="w-7 h-7 rounded-lg bg-[#FDEAE9] text-[#C12223] flex items-center justify-center shrink-0">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-[#1F1A1C] truncate">{item.title}</p>
                <p className="text-[11px] text-[#888888]">{item.meta}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#C12223] shrink-0" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
