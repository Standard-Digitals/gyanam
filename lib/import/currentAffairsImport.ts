export interface ParsedMcqQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface ParsedCurrentAffairs {
  title: string;
  category: string;
  date: string;
  readTime: string;
  sourceName: string;
  author: string;
  thumbnail: string;
  summary: string;
  bulletsText: string;
  impForExamsText: string;
  backgroundContext: string;
  fullContentText: string;
  keyTakeawaysText: string;
  syllabusTag: string;
  mcqQuestion: ParsedMcqQuestion;
}

export interface CAParseResult {
  fields: Partial<ParsedCurrentAffairs>;
  warnings: string[];
}

// Single-line "Label: value" fields
const FIELD_LINE = /^(title|category|date|read\s*time|source|author|thumbnail|syllabus\s*tag)\s*:\s*(.*)$/i;
const FIELD_KEY_MAP: Record<string, keyof Omit<ParsedCurrentAffairs, 'mcqQuestion'>> = {
  title: 'title',
  category: 'category',
  date: 'date',
  readtime: 'readTime',
  source: 'sourceName',
  author: 'author',
  thumbnail: 'thumbnail',
  syllabustag: 'syllabusTag',
};

// "MCQ ...: value" single-line fields, assembled into one mcqQuestion object at the end
const MCQ_LINE = /^mcq\s*(question|option\s*a|option\s*b|option\s*c|option\s*d|answer|explanation)\s*:\s*(.*)$/i;

// Multi-line block sections — everything until the next recognized label goes into the block
const SECTION_HEADERS: Record<string, keyof Omit<ParsedCurrentAffairs, 'mcqQuestion'>> = {
  summary: 'summary',
  bullets: 'bulletsText',
  'key bullet points': 'bulletsText',
  'important for exams': 'impForExamsText',
  'background context': 'backgroundContext',
  'full content': 'fullContentText',
  'key takeaways': 'keyTakeawaysText',
};

const LIST_FIELDS = new Set<keyof ParsedCurrentAffairs>(['bulletsText', 'impForExamsText', 'keyTakeawaysText', 'fullContentText']);

function stripBullet(line: string): string {
  return line.replace(/^[-*•]\s*/, '').trim();
}

export function parseCurrentAffairsText(rawText: string, knownCategories: string[]): CAParseResult {
  const lines = rawText.replace(/\r\n/g, '\n').split('\n').map((l) => l.trim());
  const warnings: string[] = [];
  const fields: Partial<Record<keyof Omit<ParsedCurrentAffairs, 'mcqQuestion'>, string>> = {};
  const blocks: Partial<Record<keyof Omit<ParsedCurrentAffairs, 'mcqQuestion'>, string[]>> = {};
  const mcq: { question?: string; optiona?: string; optionb?: string; optionc?: string; optiond?: string; answer?: string; explanation?: string } = {};
  let currentBlockKey: keyof Omit<ParsedCurrentAffairs, 'mcqQuestion'> | null = null;

  for (const line of lines) {
    if (!line) continue;

    const mcqMatch = line.match(MCQ_LINE);
    if (mcqMatch) {
      currentBlockKey = null;
      const key = mcqMatch[1].toLowerCase().replace(/\s+/g, '') as keyof typeof mcq;
      mcq[key] = mcqMatch[2].trim();
      continue;
    }

    const fieldMatch = line.match(FIELD_LINE);
    if (fieldMatch) {
      currentBlockKey = null;
      const key = FIELD_KEY_MAP[fieldMatch[1].toLowerCase().replace(/\s+/g, '')];
      if (key) fields[key] = fieldMatch[2].trim();
      continue;
    }

    const headerKey = Object.keys(SECTION_HEADERS).find((h) => line.toLowerCase().replace(/:$/, '').trim() === h);
    if (headerKey) {
      currentBlockKey = SECTION_HEADERS[headerKey];
      blocks[currentBlockKey] = blocks[currentBlockKey] ?? [];
      continue;
    }

    if (currentBlockKey) {
      const list = blocks[currentBlockKey];
      list?.push(LIST_FIELDS.has(currentBlockKey) ? stripBullet(line) : line);
    }
  }

  for (const [key, arr] of Object.entries(blocks) as [keyof Omit<ParsedCurrentAffairs, 'mcqQuestion'>, string[]][]) {
    if (!arr || arr.length === 0) continue;
    fields[key] = LIST_FIELDS.has(key) ? arr.filter(Boolean).join('\n') : arr.join(' ').trim();
  }

  if (!fields.title) warnings.push('No "Title:" line found — please fill in the title manually.');
  if (!fields.summary) warnings.push('No "Summary:" block found — please add one manually.');

  if (fields.category) {
    const match = knownCategories.find((c) => c.toLowerCase() === fields.category!.toLowerCase());
    if (match) fields.category = match;
    else {
      warnings.push(`Category "${fields.category}" didn't match a known category — left unchanged, please pick one.`);
      delete fields.category;
    }
  }

  const result: Partial<ParsedCurrentAffairs> = { ...fields };

  if (mcq.question) {
    const options = [mcq.optiona, mcq.optionb, mcq.optionc, mcq.optiond].filter((o): o is string => !!o?.trim());
    const answerLetter = mcq.answer?.trim().toUpperCase();
    const answerIdx = answerLetter ? ['A', 'B', 'C', 'D'].indexOf(answerLetter) : -1;
    if (options.length < 2) {
      warnings.push('MCQ Question found but fewer than 2 options were given — MCQ was not filled in, add it manually.');
    } else if (!mcq.explanation) {
      warnings.push('MCQ Question found but no "MCQ Explanation:" line — MCQ was not filled in, add it manually.');
    } else if (answerIdx < 0 || answerIdx >= options.length) {
      warnings.push('MCQ "Answer:" line must be A, B, C or D matching a filled-in option — MCQ was not filled in, add it manually.');
    } else {
      result.mcqQuestion = { question: mcq.question, options, correctAnswer: answerIdx, explanation: mcq.explanation };
    }
  }

  return { fields: result, warnings };
}
