import 'dotenv/config';
import { prisma } from '../lib/prisma';

const SAMPLE_QUESTIONS = [
  {
    id: 1,
    question: 'Simplify: 15% of 240 + 20% of 150',
    options: ['66', '60', '72', '56'],
    correctAnswer: 0,
    explanation: '15% of 240 = 36; 20% of 150 = 30; 36 + 30 = 66.',
  },
  {
    id: 2,
    question: 'Find the next number in the series: 2, 6, 12, 20, 30, ?',
    options: ['40', '42', '44', '36'],
    correctAnswer: 1,
    explanation: 'The differences increase by 2 each time (4, 6, 8, 10, 12) → 30 + 12 = 42.',
  },
  {
    id: 3,
    question: 'Choose the correctly spelt word.',
    options: ['Recieve', 'Receive', 'Receeve', 'Receve'],
    correctAnswer: 1,
    explanation: '"Receive" follows the "i before e except after c" spelling rule.',
  },
  {
    id: 4,
    question: 'A train 150 m long crosses a pole in 15 seconds. What is its speed?',
    options: ['30 km/h', '36 km/h', '40 km/h', '45 km/h'],
    correctAnswer: 1,
    explanation: 'Speed = 150/15 = 10 m/s = 10 × 18/5 = 36 km/h.',
  },
  {
    id: 5,
    question: 'If CODING is coded as DPEJOH, how is FLOWER coded in the same pattern?',
    options: ['GMPXFS', 'GMQXFS', 'GMPXGS', 'HMPXFS'],
    correctAnswer: 0,
    explanation: 'Each letter is shifted forward by one position in the alphabet.',
  },
];

async function main() {
  const courses = await prisma.course.findMany({ select: { id: true, title: true, category: true } });
  let created = 0;

  for (const course of courses) {
    const existing = await prisma.quiz.findFirst({ where: { courseId: course.id } });
    if (existing) continue;

    await prisma.quiz.create({
      data: {
        title: `${course.title} — Practice Quiz`,
        subject: 'Mixed',
        examCategory: course.category,
        date: new Date().toISOString().slice(0, 10),
        totalQuestions: SAMPLE_QUESTIONS.length,
        timeLimitMinutes: 10,
        totalMarks: SAMPLE_QUESTIONS.length,
        difficulty: 'Moderate',
        courseId: course.id,
        questions: SAMPLE_QUESTIONS,
      },
    });
    created++;
    console.log(`Linked a practice quiz to "${course.title}"`);
  }

  console.log(
    created > 0
      ? `Done — created ${created} course-linked quiz(zes). Nothing else was touched (existing chapters, resources, enrollments, and attempts are untouched).`
      : 'Every course already has a linked quiz — nothing to do.'
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
