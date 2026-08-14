'use client';
import { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Download } from 'lucide-react';
import { StatusPill } from '../_components/AdminUI';
import FilterPopover from '../_components/FilterPopover';
import FilterSelect from '../_components/FilterSelect';
import DateRangeFields from '../_components/DateRangeFields';
import { downloadCsv } from '../_components/exportCsv';

interface EnrollmentRow {
  id: string;
  studentName: string;
  phone: string;
  courseTitle: string | null;
  paymentType: string;
  status: string;
  enrolledAt: string;
}

const QUICK_RANGES: { label: string; days: number | null }[] = [
  { label: 'Today', days: 0 },
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 30 days', days: 30 },
  { label: 'All time', days: null },
];

function addDaysISO(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

export default function EnrollmentsManager({
  rows,
  from,
  to,
  courseId,
  paymentType,
  status,
  allCourses,
  paymentTypeOptions,
  statusOptions,
  todayISO,
}: {
  rows: EnrollmentRow[];
  from: string;
  to: string;
  courseId: string;
  paymentType: string;
  status: string;
  allCourses: { id: string; title: string }[];
  paymentTypeOptions: string[];
  statusOptions: string[];
  todayISO: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [draftCourse, setDraftCourse] = useState(courseId);
  const [draftType, setDraftType] = useState(paymentType);
  const [draftStatus, setDraftStatus] = useState(status);
  const [draftFrom, setDraftFrom] = useState(from);
  const [draftTo, setDraftTo] = useState(to);

  const navigate = (patch: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [k, v] of Object.entries(patch)) {
      if (v === null || v === '') params.delete(k);
      else params.set(k, v);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const applyFilters = () => {
    navigate({
      course: draftCourse || null,
      type: draftType || null,
      status: draftStatus || null,
      from: draftFrom || null,
      to: draftTo || null,
    });
  };

  const clearFilters = () => {
    setDraftCourse('');
    setDraftType('');
    setDraftStatus('');
    setDraftFrom('');
    setDraftTo('');
    navigate({ course: null, type: null, status: null, from: null, to: null });
  };

  const isFiltered = Boolean(from || to || courseId || paymentType || status);
  const activeFilterCount = (from || to ? 1 : 0) + (courseId ? 1 : 0) + (paymentType ? 1 : 0) + (status ? 1 : 0);

  const handleExport = () => {
    downloadCsv(
      'enrollments.csv',
      ['Student', 'Phone', 'Course', 'Type', 'Status', 'Date'],
      rows.map((r) => [r.studentName, r.phone, r.courseTitle ?? '', r.paymentType, r.status, new Date(r.enrolledAt).toLocaleDateString()])
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          {QUICK_RANGES.map((r) => {
            const isAllTime = r.days === null;
            const rangeFrom = isAllTime ? '' : addDaysISO(todayISO, r.days!);
            const rangeTo = isAllTime ? '' : todayISO;
            const isActive = isAllTime ? !from && !to : from === rangeFrom && to === rangeTo;
            return (
              <button
                key={r.label}
                onClick={() => navigate({ from: rangeFrom || null, to: rangeTo || null })}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  isActive
                    ? 'bg-white text-[#1F1A1C] border border-[#F3DCDD] shadow-sm'
                    : 'text-[#8A7A7B] hover:text-[#1F1A1C]'
                }`}
              >
                {r.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <FilterPopover activeCount={activeFilterCount} onApply={applyFilters} onClear={clearFilters}>
            <FilterSelect
              label="Course"
              value={draftCourse}
              onChange={setDraftCourse}
              options={[{ label: 'All courses', value: '' }, ...allCourses.map((c) => ({ label: c.title, value: c.id }))]}
            />
            <FilterSelect
              label="Type"
              value={draftType}
              onChange={setDraftType}
              options={[{ label: 'All types', value: '' }, ...paymentTypeOptions.map((t) => ({ label: t, value: t }))]}
            />
            <FilterSelect
              label="Status"
              value={draftStatus}
              onChange={setDraftStatus}
              options={[{ label: 'All statuses', value: '' }, ...statusOptions.map((s) => ({ label: s, value: s }))]}
            />
            <DateRangeFields from={draftFrom} to={draftTo} onFromChange={setDraftFrom} onToChange={setDraftTo} />
          </FilterPopover>
          <button onClick={handleExport} className="flex items-center gap-2 px-3.5 py-2 bg-white border border-[#F3DCDD] rounded-xl text-xs font-bold text-[#1F1A1C] cursor-pointer">
            <Download size={13} strokeWidth={2.25} />
            Export
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#F3DCDD] shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#F3DCDD] text-left text-[11px] uppercase text-[#888888] font-bold font-plexmono tracking-wide">
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Course</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-[#F3DCDD] last:border-0 hover:bg-[#FFF9F9] transition-colors">
                <td className="px-4 py-3">
                  <p className="font-semibold text-[#1F1A1C]">{r.studentName}</p>
                  <p className="text-xs text-[#888888]">{r.phone}</p>
                </td>
                <td className="px-4 py-3 text-[#555555]">{r.courseTitle ?? '—'}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded-lg text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">{r.paymentType}</span>
                </td>
                <td className="px-4 py-3">
                  <StatusPill status={r.status} />
                </td>
                <td className="px-4 py-3 text-xs text-[#888888]">{new Date(r.enrolledAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[#888888] text-sm">
                  {isFiltered ? 'No enrollments match these filters.' : 'No enrollments yet.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
