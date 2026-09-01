import { z } from 'zod';

export const questionSchema = z
  .object({
    id: z.number(),
    type: z.enum(['mcq', 'fill_blank']).default('mcq'),
    question: z.string().min(1),
    options: z.array(z.string()).default([]),
    correctAnswer: z.number().int().nonnegative().default(0),
    correctAnswerText: z.string().optional(),
    explanation: z.string().min(1),
    flagged: z.boolean().optional(),
    level: z.string().optional(),
    entryType: z.string().optional(),
    year: z.string().optional(),
    section: z.string().optional(),
  })
  .refine(
    (q) => {
      if (q.type === 'fill_blank') return !!q.correctAnswerText?.trim();
      return q.options.filter((o) => o.trim().length > 0).length >= 2 && q.correctAnswer < q.options.length;
    },
    { message: 'Each question needs either 2+ MCQ options with a correct answer, or a fill-in-the-blank answer' }
  );
