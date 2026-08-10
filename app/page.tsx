import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import { SITE } from '@/lib/siteConfig';
import { HomePage } from '@/features/home/HomePage';
import { getAllCourses } from '@/lib/data/courses';
import { getAllMentors } from '@/lib/data/mentors';
import { getAllBlogPosts } from '@/lib/data/blog';
import { getAllFaqs } from '@/lib/data/faqs';
import { getAllSuccessStories } from '@/lib/data/successStories';
import { getAllCurrentAffairs } from '@/lib/data/currentAffairs';
import { getDailyQuizWidgetQuestions } from '@/lib/data/dailyQuizWidget';
import { getAllFreeResources } from '@/lib/data/resources';

export const metadata: Metadata = buildMetadata({
  title: SITE.tagline,
  path: '',
});

export default async function Page() {
  const [courses, mentors, blogPosts, faqs, successStories, currentAffairs, quizQuestions, resources] =
    await Promise.all([
      getAllCourses(),
      getAllMentors(),
      getAllBlogPosts(),
      getAllFaqs(),
      getAllSuccessStories(),
      getAllCurrentAffairs(),
      getDailyQuizWidgetQuestions(),
      getAllFreeResources(),
    ]);
  return (
    <HomePage
      courses={courses}
      mentors={mentors}
      blogPosts={blogPosts}
      faqs={faqs}
      successStories={successStories}
      currentAffairs={currentAffairs}
      quizQuestions={quizQuestions}
      resources={resources}
    />
  );
}
