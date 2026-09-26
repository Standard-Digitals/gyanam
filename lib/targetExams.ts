// Shared "Target Exam(s)" list — specific exam names (not the broader SSC/Banking/
// Railway/etc. category groups from examCategories.ts) used wherever admin content
// (Resources, Courses, ...) tags itself to individual exams. Grouped by family for
// display; flatten with TARGET_EXAMS for a plain list of every value.
export const TARGET_EXAM_GROUPS: { group: string; exams: string[] }[] = [
  { group: 'SSC', exams: ['SSC CGL', 'SSC CHSL', 'SSC CPO', 'SSC MTS', 'SSC GD', 'SSC JE'] },
  { group: 'Banking', exams: ['IBPS PO', 'IBPS Clerk', 'SBI PO', 'SBI Clerk', 'RRB PO'] },
  { group: 'Railway', exams: ['RRB NTPC', 'RRB ALP', 'RRB Group D', 'RPF SI'] },
  { group: 'UPSC', exams: ['UPSC Civil Services', 'State PCS'] },
  { group: 'Defence', exams: ['CDS', 'NDA', 'AFCAT', 'CAPF'] },
  {
    group: 'Assam Govt',
    exams: ['ADRE Grade III', 'ADRE Grade IV', 'APDCL', 'Assam Police SI', 'Assam Police Constable', 'Assam Commando Battalion'],
  },
];

export const TARGET_EXAMS: string[] = TARGET_EXAM_GROUPS.flatMap((g) => g.exams);
