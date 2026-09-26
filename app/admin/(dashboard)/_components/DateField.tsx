'use client';
import FormField from './FormField';

// These forms store dates as a plain display string (e.g. "26 September 2026"),
// not an ISO date, since that's what gets shown as-is on the public site. This
// field gives a native calendar picker while keeping that same string format.
function toISODate(humanDate: string): string {
  if (!humanDate) return '';
  const parsed = new Date(humanDate);
  return isNaN(parsed.getTime()) ? '' : parsed.toISOString().slice(0, 10);
}

function toHumanDate(isoDate: string): string {
  if (!isoDate) return '';
  const parsed = new Date(`${isoDate}T00:00:00`);
  return isNaN(parsed.getTime()) ? '' : parsed.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function todayHumanDate(): string {
  return toHumanDate(new Date().toISOString().slice(0, 10));
}

export default function DateField({
  label = 'Date',
  value,
  onChange,
}: {
  label?: string;
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <FormField label={label}>
      <input
        type="date"
        value={toISODate(value)}
        onChange={(e) => onChange(e.target.value ? toHumanDate(e.target.value) : '')}
        className="w-full px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold"
      />
    </FormField>
  );
}
