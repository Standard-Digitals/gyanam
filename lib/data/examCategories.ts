// Quiz/MockTest.examCategory holds one of these admin-facing group names (see
// app/admin/(dashboard)/_components/examCategories.ts), not the specific exam the student typed
// into chat (e.g. "Bank Clerk", "SSC cgl") — this maps free text to the right group by keyword.
// Shared by lib/data/aiMentor.ts (test-matching) and lib/data/performance.ts (scoping subject
// accuracy / mistake review to the student's current target exam) — kept in its own module so
// neither has to import the other.
export const EXAM_CATEGORY_KEYWORDS: Record<string, string[]> = {
  SSC: ['ssc'],
  Banking: ['bank', 'ibps', 'sbi', 'rrb po'],
  Railway: ['railway', 'rrb', 'ntpc', 'rpf', 'alp'],
  UPSC: ['upsc', 'civil services'],
  'State PSC': ['state pcs', 'psc'],
  Defence: ['cds', 'nda', 'afcat', 'capf', 'defence'],
  'Assam Govt': ['adre', 'apdcl', 'assam'],
  'Teaching Exams': ['tet', 'ugc net', 'cadre', 'teaching'],
};

export function matchExamCategory(targetExam: string | null): string | null {
  if (!targetExam) return null;
  const lower = targetExam.toLowerCase();
  for (const [category, keywords] of Object.entries(EXAM_CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) return category;
  }
  return null;
}
