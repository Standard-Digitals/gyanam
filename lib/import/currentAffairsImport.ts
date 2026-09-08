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
}

export interface CAParseResult {
  fields: Partial<ParsedCurrentAffairs>;
  warnings: string[];
}

// Single-line "Label: value" fields
const FIELD_LINE = /^(title|category|date|read\s*time|source|author|thumbnail)\s*:\s*(.*)$/i;
const FIELD_KEY_MAP: Record<string, keyof ParsedCurrentAffairs> = {
  title: 'title',
  category: 'category',
  date: 'date',
  readtime: 'readTime',
  source: 'sourceName',
  author: 'author',
  thumbnail: 'thumbnail',
};

// Multi-line block sections — everything until the next recognized label goes into the block
const SECTION_HEADERS: Record<string, keyof ParsedCurrentAffairs> = {
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
  const fields: Partial<Record<keyof ParsedCurrentAffairs, string>> = {};
  const blocks: Partial<Record<keyof ParsedCurrentAffairs, string[]>> = {};
  let currentBlockKey: keyof ParsedCurrentAffairs | null = null;

  for (const line of lines) {
    if (!line) continue;

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

  for (const [key, arr] of Object.entries(blocks) as [keyof ParsedCurrentAffairs, string[]][]) {
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

  return { fields, warnings };
}
