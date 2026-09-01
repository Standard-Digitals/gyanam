import { LEVEL_OPTIONS, ENTRY_TYPE_OPTIONS, YEAR_OPTIONS } from '@/lib/questionMeta';

export { LEVEL_OPTIONS, ENTRY_TYPE_OPTIONS, YEAR_OPTIONS };

export type QuestionType = 'mcq' | 'fill_blank';

export interface RawQuestion {
  id: number;
  type?: string;
  question: string;
  options: string[];
  correctAnswer: number;
  correctAnswerText?: string;
  explanation: string;
  flagged?: boolean;
  level?: string;
  entryType?: string;
  year?: string;
}

export interface EditableQuestion {
  id: number;
  type: QuestionType;
  question: string;
  options: string[];
  correctAnswer: number;
  correctAnswerText: string;
  explanation: string;
  flagged?: boolean;
  level: string;
  entryType: string;
  year: string;
}

export const MIN_OPTIONS = 2;
export const MAX_OPTIONS = 6;

export function createEmptyQuestion(id: number): EditableQuestion {
  return {
    id,
    type: 'mcq',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    correctAnswerText: '',
    explanation: '',
    flagged: false,
    level: 'Moderate',
    entryType: 'New',
    year: 'NA',
  };
}

export function normalizeQuestion(q: RawQuestion): EditableQuestion {
  const options = Array.isArray(q.options) ? q.options : [];
  return {
    id: q.id,
    type: q.type === 'fill_blank' ? 'fill_blank' : 'mcq',
    question: q.question ?? '',
    options: options.length > 0 ? [...options] : ['', '', '', ''],
    correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0,
    correctAnswerText: q.correctAnswerText ?? '',
    explanation: q.explanation ?? '',
    flagged: q.flagged ?? false,
    level: q.level && LEVEL_OPTIONS.includes(q.level) ? q.level : 'Moderate',
    entryType: q.entryType && ENTRY_TYPE_OPTIONS.includes(q.entryType) ? q.entryType : 'New',
    year: q.year && YEAR_OPTIONS.includes(q.year) ? q.year : 'NA',
  };
}

export function isQuestionValid(q: EditableQuestion): boolean {
  if (!q.question.trim() || !q.explanation.trim()) return false;
  if (q.type === 'fill_blank') return q.correctAnswerText.trim().length > 0;
  const filledCount = q.options.filter((o) => o.trim().length > 0).length;
  return filledCount >= MIN_OPTIONS && !!q.options[q.correctAnswer]?.trim();
}

export function mergeImportedQuestions(existing: EditableQuestion[], imported: RawQuestion[]): EditableQuestion[] {
  const kept = existing.filter(
    (q) => q.question.trim() || q.options.some((o) => o.trim()) || q.correctAnswerText.trim()
  );
  const startId = (kept[kept.length - 1]?.id ?? 0) + 1;
  const normalized = imported.map((q, i) => normalizeQuestion({ ...q, id: startId + i }));
  return [...kept, ...normalized];
}

export function toPayloadQuestion(q: EditableQuestion) {
  const meta = {
    level: q.level,
    entryType: q.entryType,
    year: q.year,
    ...(q.flagged !== undefined ? { flagged: q.flagged } : {}),
  };
  if (q.type === 'fill_blank') {
    return {
      id: q.id,
      type: 'fill_blank' as const,
      question: q.question,
      options: [],
      correctAnswer: 0,
      correctAnswerText: q.correctAnswerText.trim(),
      explanation: q.explanation,
      ...meta,
    };
  }
  return {
    id: q.id,
    type: 'mcq' as const,
    question: q.question,
    options: q.options,
    correctAnswer: q.correctAnswer,
    explanation: q.explanation,
    ...meta,
  };
}
