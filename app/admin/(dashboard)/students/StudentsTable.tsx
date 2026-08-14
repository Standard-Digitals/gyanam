'use client';
import { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Download } from 'lucide-react';
import FilterPopover from '../_components/FilterPopover';
import FilterSelect from '../_components/FilterSelect';
import DateRangeFields from '../_components/DateRangeFields';
import { downloadCsv } from '../_components/exportCsv';

interface StudentRow {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  targetExam: string | null;
  course: string | null;
  status: 'active' | 'pending';
  joinedAt: string;
}

const FILTER_TABS = [
  { key: 'all', label: 'All students' },
  { key: 'active', label: 'Active' },
  { key: 'pending', label: 'Trial / Pending' },
] as const;

const AVATAR_COLORS = ['#C12223', '#B4590A', '#127A52', '#3B5BDB', '#7048E8', '#0B8792', '#E67700'];

function colorFor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase() || '?';
}

function getPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
  const pages: (number | 'ellipsis')[] = [];
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
    return pages;
  }
  pages.push(1);
  if (current > 3) pages.push('ellipsis');
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i);
  if (current < total - 2) pages.push('ellipsis');
  pages.push(total);
  return pages;
}

export default function StudentsTable({
  rows,
  total,
  page,
  pageSize,
  filter,
  examFilter,
  courseFilter,
  from,
  to,
  targetExams,
  allCourses,
}: {
  rows: StudentRow[];
  total: number;
  page: number;
  pageSize: number;
  filter: string;
  examFilter: string;
  courseFilter: string;
  from: string;
  to: string;
  targetExams: string[];
  allCourses: { id: string; title: string }[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [draftFilter, setDraftFilter] = useState(filter);
  const [draftExam, setDraftExam] = useState(examFilter);
  const [draftCourse, setDraftCourse] = useState(courseFilter);
  const [draftFrom, setDraftFrom] = useState(from);
  const [draftTo, setDraftTo] = useState(to);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pageNumbers = getPageNumbers(page, totalPages);

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
      filter: draftFilter === 'all' ? null : draftFilter,
      exam: draftExam || null,
      course: draftCourse || null,
      from: draftFrom || null,
      to: draftTo || null,
      page: null,
    });
  };

  const clearFilters = () => {
    setDraftFilter('all');
    setDraftExam('');
    setDraftCourse('');
    setDraftFrom('');
    setDraftTo('');
    navigate({ filter: null, exam: null, course: null, from: null, to: null, page: null });
  };

  const activeFilterCount = (examFilter ? 1 : 0) + (courseFilter ? 1 : 0) + (from || to ? 1 : 0);

  const handleExport = () => {
    downloadCsv(
      `students-page-${page}.csv`,
      ['Name', 'Email', 'Phone', 'Target Exam', 'Course', 'Status', 'Joined'],
      rows.map((r) => [r.name, r.email ?? '', r.phone, r.targetExam ?? '', r.course ?? '', r.status, new Date(r.joinedAt).toLocaleDateString()])
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          {FILTER_TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => {
                setDraftFilter(t.key);
                navigate({ filter: t.key === 'all' ? null : t.key, page: null });
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                filter === t.key
                  ? 'bg-white text-[#1F1A1C] border border-[#F3DCDD] shadow-sm'
                  : 'text-[#8A7A7B] hover:text-[#1F1A1C]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <FilterPopover activeCount={activeFilterCount} onApply={applyFilters} onClear={clearFilters}>
            <FilterSelect
              label="Status"
              value={draftFilter}
              onChange={setDraftFilter}
              options={FILTER_TABS.map((t) => ({ label: t.label, value: t.key }))}
            />
            <FilterSelect
              label="Target Exam"
              value={draftExam}
              onChange={setDraftExam}
              options={[{ label: 'All exams', value: '' }, ...targetExams.map((ex) => ({ label: ex, value: ex }))]}
            />
            <FilterSelect
              label="Course"
              value={draftCourse}
              onChange={setDraftCourse}
              options={[{ label: 'All courses', value: '' }, ...allCourses.map((c) => ({ label: c.title, value: c.id }))]}
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
              <th className="px-4 py-3">Target Exam</th>
              <th className="px-4 py-3">Course</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Joined</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-[#F3DCDD] last:border-0 hover:bg-[#FFF9F9] transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                      style={{ backgroundColor: colorFor(r.name) }}
                    >
                      {initials(r.name)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-[#1F1A1C] truncate">{r.name}</p>
                      <p className="text-xs text-[#888888] truncate">{r.email || r.phone}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-[#555555]">{r.targetExam || '—'}</td>
                <td className="px-4 py-3 text-[#555555]">{r.course || '—'}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold">
                    <span className={`w-1.5 h-1.5 rounded-full ${r.status === 'active' ? 'bg-[#127A52]' : 'bg-[#B4590A]'}`} />
                    <span className={r.status === 'active' ? 'text-[#127A52]' : 'text-[#B4590A]'}>{r.status}</span>
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-[#888888]">
                  {new Date(r.joinedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[#888888] text-sm">No students found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {total > 0 && (
        <div className="flex items-center justify-between flex-wrap gap-3">
          <p className="text-xs text-[#888888]">
            Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total.toLocaleString()} students
          </p>
          <div className="flex items-center gap-1.5">
            <button
              disabled={page <= 1}
              onClick={() => navigate({ page: page - 1 === 1 ? null : String(page - 1) })}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold border border-[#F3DCDD] text-[#1F1A1C] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              ‹
            </button>
            {pageNumbers.map((p, i) =>
              p === 'ellipsis' ? (
                <span key={`e-${i}`} className="w-8 h-8 flex items-center justify-center text-xs text-[#888888]">…</span>
              ) : (
                <button
                  key={p}
                  onClick={() => navigate({ page: p === 1 ? null : String(p) })}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold cursor-pointer ${
                    p === page ? 'bg-[#C12223] text-white' : 'border border-[#F3DCDD] text-[#1F1A1C] hover:bg-[#FFF5F5]'
                  }`}
                >
                  {p}
                </button>
              )
            )}
            <button
              disabled={page >= totalPages}
              onClick={() => navigate({ page: String(page + 1) })}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold border border-[#F3DCDD] text-[#1F1A1C] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
