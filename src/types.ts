export interface Course {
  id: string;
  title: string;
  category: 'SSC' | 'Banking' | 'Railway' | 'UPSC' | 'Assam Govt' | 'State PSC' | 'Defence';
  targetExam: string;
  badge?: string;
  rating: number;
  reviewsCount: number;
  studentsEnrolled: number;
  instructor: {
    name: string;
    designation: string;
    avatar: string;
  };
  duration: string;
  lessonsCount: number;
  language: 'Bilingual (Hindi + Eng)' | 'English' | 'Assamese + Eng';
  originalPrice: number;
  discountPrice: number;
  features: string[];
  thumbnail: string;
  popular?: boolean;
  syllabusOverview: {
    module: string;
    topics: string[];
  }[];
  startDate: string;
}

export interface SuccessStory {
  id: string;
  studentName: string;
  examCleared: string;
  rank: string;
  year: number;
  photoUrl: string;
  videoUrl?: string;
  hasVideo: boolean;
  testimonial: string;
  previousAttempts: string;
  hometown: string;
  badge: string;
  category: string;
}

export interface Mentor {
  id: string;
  name: string;
  title: string;
  experienceYears: number;
  qualification: string;
  exRole?: string;
  subject: string;
  selectionsMentored: number;
  rating: number;
  image: string;
  bio: string;
}

export interface CurrentAffairItem {
  id: string;
  title: string;
  category: 'National' | 'Economy' | 'State Exams' | 'Defense' | 'Science & Tech';
  date: string;
  readTime: string;
  summary: string;
  bullets: string[];
  impForExams: string[];
}

export interface DailyQuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  examTag: string;
}

export interface FreeResource {
  id: string;
  title: string;
  type: 'PDF Notes' | 'PYQ Paper' | 'Current Affairs Magazine' | 'Formula Sheet';
  category: string;
  fileSize: string;
  downloadsCount: number;
  rating: number;
  description: string;
}

export interface BlogPost {
  id: string;
  title: string;
  category: 'Exam Alert' | 'Strategy' | 'Syllabus & Pattern' | 'Cut-Off Analysis';
  date: string;
  readTime: string;
  author: string;
  excerpt: string;
  imageUrl: string;
}

export interface FAQItem {
  id: string;
  category: 'General' | 'Courses & Batches' | 'Mock Tests' | 'App & Access' | 'Payments';
  question: string;
  answer: string;
}
