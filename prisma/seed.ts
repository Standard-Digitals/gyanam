import 'dotenv/config';
import { prisma } from '../lib/prisma';
import {
  COURSES_DATA,
  SUCCESS_STORIES,
  MENTORS,
  CURRENT_AFFAIRS_ITEMS,
  DAILY_QUIZ_QUESTIONS,
  FREE_RESOURCES,
  BLOG_POSTS,
  FAQS_DATA,
} from '../data/mockData';

async function main() {
  for (const c of COURSES_DATA) {
    const data = { ...c, slug: c.slug ?? c.id };
    await prisma.course.upsert({
      where: { id: c.id },
      update: data,
      create: data,
    });
  }
  console.log(`Seeded ${COURSES_DATA.length} courses`);

  for (const m of MENTORS) {
    await prisma.mentor.upsert({ where: { id: m.id }, update: { ...m }, create: { ...m } });
  }
  console.log(`Seeded ${MENTORS.length} mentors`);

  for (const s of SUCCESS_STORIES) {
    await prisma.successStory.upsert({ where: { id: s.id }, update: { ...s }, create: { ...s } });
  }
  console.log(`Seeded ${SUCCESS_STORIES.length} success stories`);

  for (const ca of CURRENT_AFFAIRS_ITEMS) {
    await prisma.currentAffairItem.upsert({ where: { id: ca.id }, update: { ...ca }, create: { ...ca } });
  }
  console.log(`Seeded ${CURRENT_AFFAIRS_ITEMS.length} current affairs items`);

  for (const q of DAILY_QUIZ_QUESTIONS) {
    await prisma.dailyQuizQuestion.upsert({ where: { id: q.id }, update: { ...q }, create: { ...q } });
  }
  console.log(`Seeded ${DAILY_QUIZ_QUESTIONS.length} daily quiz questions`);

  for (const r of FREE_RESOURCES) {
    await prisma.freeResource.upsert({ where: { id: r.id }, update: { ...r }, create: { ...r } });
  }
  console.log(`Seeded ${FREE_RESOURCES.length} free resources`);

  for (const b of BLOG_POSTS) {
    await prisma.blogPost.upsert({ where: { id: b.id }, update: { ...b }, create: { ...b } });
  }
  console.log(`Seeded ${BLOG_POSTS.length} blog posts`);

  for (const f of FAQS_DATA) {
    await prisma.fAQItem.upsert({ where: { id: f.id }, update: { ...f }, create: { ...f } });
  }
  console.log(`Seeded ${FAQS_DATA.length} FAQ items`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
