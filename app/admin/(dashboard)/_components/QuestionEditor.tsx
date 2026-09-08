'use client';
import { GripVertical } from 'lucide-react';
import { type EditableQuestion, MIN_OPTIONS, MAX_OPTIONS, LEVEL_OPTIONS, ENTRY_TYPE_OPTIONS, YEAR_OPTIONS } from './questionTypes';

export interface DragHandleProps {
  draggable: true;
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragEnd: () => void;
}

export default function QuestionEditor({
  index,
  question,
  onChange,
  onRemove,
  canRemove,
  showFlagged,
  showMeta,
  sections,
  dragHandleProps,
  isDragging,
}: {
  index: number;
  question: EditableQuestion;
  onChange: (patch: Partial<EditableQuestion>) => void;
  onRemove: () => void;
  canRemove: boolean;
  showFlagged?: boolean;
  showMeta?: boolean;
  sections?: string[];
  dragHandleProps?: DragHandleProps;
  isDragging?: boolean;
}) {
  const updateOption = (optIdx: number, value: string) => {
    onChange({ options: question.options.map((o, i) => (i === optIdx ? value : o)) });
  };

  const addOption = () => {
    if (question.options.length >= MAX_OPTIONS) return;
    onChange({ options: [...question.options, ''] });
  };

  const removeOption = (optIdx: number) => {
    if (question.options.length <= MIN_OPTIONS) return;
    const newOptions = question.options.filter((_, i) => i !== optIdx);
    const newCorrect =
      question.correctAnswer === optIdx ? 0 : question.correctAnswer > optIdx ? question.correctAnswer - 1 : question.correctAnswer;
    onChange({ options: newOptions, correctAnswer: newCorrect });
  };

  return (
    <div
      {...dragHandleProps}
      className={`p-4 bg-[#FFF5F5] rounded-2xl border border-[#F3DCDD] space-y-2 ${isDragging ? 'opacity-40' : ''}`}
    >
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="flex items-center gap-1.5 text-xs font-black text-[#C12223]">
          {dragHandleProps && <GripVertical className="w-3.5 h-3.5 text-[#C7B4B3] cursor-grab" />}
          Question {index + 1}
        </span>
        <div className="flex items-center gap-3">
          <select
            value={question.type}
            onChange={(e) => onChange({ type: e.target.value === 'fill_blank' ? 'fill_blank' : 'mcq' })}
            className="px-2.5 py-1 bg-white border border-[#F3DCDD] rounded-lg text-[11px] font-bold cursor-pointer"
          >
            <option value="mcq">Multiple Choice</option>
            <option value="fill_blank">Fill in the Blank</option>
          </select>
          {showFlagged && (
            <label className="flex items-center gap-1.5 text-[11px] font-bold text-[#888888] cursor-pointer">
              <input type="checkbox" checked={question.flagged ?? false} onChange={(e) => onChange({ flagged: e.target.checked })} />
              Flag for review
            </label>
          )}
          {canRemove && (
            <button onClick={onRemove} className="text-xs font-bold text-red-600 cursor-pointer">
              Remove
            </button>
          )}
        </div>
      </div>

      <textarea
        placeholder="Question text"
        rows={2}
        value={question.question}
        onChange={(e) => onChange({ question: e.target.value })}
        className="w-full px-3 py-2 bg-white border border-[#F3DCDD] rounded-xl text-sm font-semibold"
      />

      {showMeta && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {sections && sections.length > 0 && (
            <div>
              <label className="text-[9px] font-bold text-[#888888] uppercase tracking-wide">Section</label>
              <select
                value={question.section}
                onChange={(e) => onChange({ section: e.target.value })}
                className="w-full mt-0.5 px-2.5 py-1.5 bg-white border border-[#F3DCDD] rounded-lg text-[11px] font-semibold cursor-pointer"
              >
                {sections.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="text-[9px] font-bold text-[#888888] uppercase tracking-wide">Question Level</label>
            <select
              value={question.level}
              onChange={(e) => onChange({ level: e.target.value })}
              className="w-full mt-0.5 px-2.5 py-1.5 bg-white border border-[#F3DCDD] rounded-lg text-[11px] font-semibold cursor-pointer"
            >
              {LEVEL_OPTIONS.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[9px] font-bold text-[#888888] uppercase tracking-wide">Question Type</label>
            <select
              value={question.entryType}
              onChange={(e) => onChange({ entryType: e.target.value })}
              className="w-full mt-0.5 px-2.5 py-1.5 bg-white border border-[#F3DCDD] rounded-lg text-[11px] font-semibold cursor-pointer"
            >
              {ENTRY_TYPE_OPTIONS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[9px] font-bold text-[#888888] uppercase tracking-wide" title="Select NA if year not known">
              Question Year
            </label>
            <select
              value={question.year}
              onChange={(e) => onChange({ year: e.target.value })}
              className="w-full mt-0.5 px-2.5 py-1.5 bg-white border border-[#F3DCDD] rounded-lg text-[11px] font-semibold cursor-pointer"
            >
              {YEAR_OPTIONS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {question.type === 'mcq' ? (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            {question.options.map((opt, optIdx) => (
              <div key={optIdx} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`correct-${question.id}`}
                  checked={question.correctAnswer === optIdx}
                  onChange={() => onChange({ correctAnswer: optIdx })}
                  title="Mark as correct answer"
                />
                <input
                  type="text"
                  placeholder={`Option ${optIdx + 1}`}
                  value={opt}
                  onChange={(e) => updateOption(optIdx, e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-[#F3DCDD] rounded-lg text-xs font-semibold"
                />
                {question.options.length > MIN_OPTIONS && (
                  <button
                    onClick={() => removeOption(optIdx)}
                    title="Remove this option"
                    className="text-red-500 hover:text-red-700 text-sm font-black cursor-pointer shrink-0 w-5"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
          {question.options.length < MAX_OPTIONS && (
            <button
              onClick={addOption}
              className="px-3 py-1.5 bg-white border border-[#F3DCDD] text-[#C12223] font-bold text-[11px] rounded-lg cursor-pointer"
            >
              + Add Option
            </button>
          )}
        </div>
      ) : (
        <input
          type="text"
          placeholder="Correct answer (student's typed answer is matched case-insensitively)"
          value={question.correctAnswerText}
          onChange={(e) => onChange({ correctAnswerText: e.target.value })}
          className="w-full px-3 py-2 bg-white border border-[#F3DCDD] rounded-xl text-sm font-semibold"
        />
      )}

      <textarea
        placeholder="Explanation"
        rows={2}
        value={question.explanation}
        onChange={(e) => onChange({ explanation: e.target.value })}
        className="w-full px-3 py-2 bg-white border border-[#F3DCDD] rounded-xl text-xs font-semibold"
      />
    </div>
  );
}
