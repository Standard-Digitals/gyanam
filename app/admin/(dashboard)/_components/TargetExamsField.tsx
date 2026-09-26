'use client';
import FormField from './FormField';
import { TARGET_EXAM_GROUPS } from '@/lib/targetExams';

export default function TargetExamsField({
  label = 'Target Exams',
  value,
  onChange,
}: {
  label?: string;
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const toggle = (exam: string) => {
    onChange(value.includes(exam) ? value.filter((e) => e !== exam) : [...value, exam]);
  };

  return (
    <FormField label={label}>
      <div className="space-y-1.5">
        {TARGET_EXAM_GROUPS.map(({ group, exams }) => (
          <div key={group} className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-extrabold text-gray-400 uppercase w-20 shrink-0">{group}</span>
            {exams.map((exam) => {
              const isSelected = value.includes(exam);
              return (
                <button
                  key={exam}
                  type="button"
                  onClick={() => toggle(exam)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition ${
                    isSelected ? 'bg-[#C12223] text-white' : 'bg-[#FFF5F5] border border-[#F3DCDD] text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {exam}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </FormField>
  );
}
