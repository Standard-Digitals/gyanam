import { Course, SuccessStory, Mentor, CurrentAffairItem, DailyQuizQuestion, FreeResource, BlogPost, FAQItem } from '../types';

export const EXAM_CATEGORIES = [
  { id: 'all', name: 'All Exams', icon: 'Sparkles', count: '100+ Courses' },
  { id: 'SSC', name: 'SSC Exams', icon: 'Award', count: '28 Courses' },
  { id: 'Banking', name: 'Banking & Insurance', icon: 'Building2', count: '24 Courses' },
  { id: 'Railway', name: 'Railways (RRB)', icon: 'Train', count: '16 Courses' },
  { id: 'Assam Govt', name: 'Assam Govt (ADRE / APDCL)', icon: 'MapPin', count: '18 Courses' },
  { id: 'State PSC', name: 'State PSCs', icon: 'Landmark', count: '15 Courses' },
  { id: 'UPSC', name: 'UPSC Foundation', icon: 'GraduationCap', count: '12 Courses' },
  { id: 'Defence', name: 'Defence (CDS/NDA)', icon: 'Shield', count: '10 Courses' },
];

export const COURSES_DATA: Course[] = [
  {
    id: 'course-ssc-cgl-2026',
    slug: 'ssc-cgl-2026-foundation-mains-super-batch',
    title: 'SSC CGL 2026 Foundation + Mains Super Batch',
    category: 'SSC',
    targetExam: 'SSC CGL, CHSL, CPO, MTS',
    badge: '🔥 Bestseller',
    rating: 4.9,
    reviewsCount: 3840,
    studentsEnrolled: 14250,
    instructor: {
      name: 'Rakesh Sharma & Team',
      designation: 'Ex-Central Excise Inspector (14+ Yrs Exp)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
    },
    duration: '8 Months (350+ Live Classes)',
    lessonsCount: 420,
    language: 'Bilingual (Hindi + Eng)',
    originalPrice: 8999,
    discountPrice: 3499,
    features: [
      'Complete Tier-I + Tier-II Live Coverage',
      'Daily Practice Sheets (DPP) with Video Solutions',
      '150+ Full Length Mock Tests with TCS Exam Interface',
      'Special Calculation Speed Booster Tricks by Rakesh Sir',
      'Hardcopy Study Material delivered to home'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=600',
    popular: true,
    startDate: 'Batch Starts 28th July',
    syllabusOverview: [
      { module: 'Module 1: Quantitative Aptitude', topics: ['Advanced Maths (Geometry, Trigonometry, Algebra)', 'Arithmetic Speed Hacks', 'Data Interpretation'] },
      { module: 'Module 2: Reasoning & Mental Ability', topics: ['Verbal & Non-Verbal Reasoning', 'Critical Thinking', 'Puzzles & Syllogisms'] },
      { module: 'Module 3: English Language', topics: ['Grammar Precision', 'Reading Comprehension Masterclass', 'Vocabulary 3000 Words Method'] },
      { module: 'Module 4: General Awareness & Science', topics: ['Indian Polity & History Timeline', 'Static GK & Monthly Current Affairs', 'Physics, Chem, Bio'] }
    ]
  },
  {
    id: 'course-ibps-po-clerk',
    slug: 'bank-po-clerk-2026-complete-selection-batch',
    title: 'Bank PO & Clerk 2026 Complete Selection Batch',
    category: 'Banking',
    targetExam: 'IBPS PO, SBI PO, SBI Clerk, RRB PO',
    badge: '⚡ High Success Rate',
    rating: 4.95,
    reviewsCount: 2910,
    studentsEnrolled: 11800,
    instructor: {
      name: 'Anuj Gupta & Banking Faculty',
      designation: 'Ex-SBI PO, Quant & DI Specialist',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
    },
    duration: '6 Months (280+ Live Classes)',
    lessonsCount: 360,
    language: 'Bilingual (Hindi + Eng)',
    originalPrice: 7999,
    discountPrice: 2999,
    features: [
      'Pre + Mains + Interview Preparation',
      'High-Level Puzzles & Advanced DI Special Masterclasses',
      'Financial & Banking Awareness Mastery',
      'Weekly All-India Live Ranking Mock Tests',
      'Personal Interview Grooming by Retired Bank GM'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=600',
    popular: true,
    startDate: 'Batch Starts 1st August',
    syllabusOverview: [
      { module: 'Module 1: Data Analysis & Interpretation', topics: ['Caselet DI', 'Missing DI & Radar Charts', 'Number Series & Quadratic Speed'] },
      { module: 'Module 2: High Level Reasoning', topics: ['Floor-Based Puzzles', 'Input-Output Rules', 'Code Inequality'] },
      { module: 'Module 3: Banking & Financial Awareness', topics: ['RBI Monetary Policy', 'NPA, Capital Markets, Banking Ombudsman', 'Current Financial News'] }
    ]
  },
  {
    id: 'course-assam-adre-2026',
    slug: 'assam-adre-grade-iii-iv-super-target-batch',
    title: 'Assam ADRE Grade III & IV Super Target Batch',
    category: 'Assam Govt',
    targetExam: 'ADRE 2.0 / 3.0, APDCL, Assam Police SI',
    badge: '🏆 #1 Batch in Assam',
    rating: 4.98,
    reviewsCount: 5200,
    studentsEnrolled: 18900,
    instructor: {
      name: 'Pranab Das & Assam Panel',
      designation: 'Senior Faculty for Assam History & GK',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200'
    },
    duration: '5 Months (250+ Live Hours)',
    lessonsCount: 310,
    language: 'Assamese + Eng',
    originalPrice: 5999,
    discountPrice: 1999,
    features: [
      'Complete Coverage of Assam History, Geography & Culture',
      'Assam Specific Current Affairs (Special Magazine Included)',
      'Language Proficiency Tests (Assamese / Bodo / English)',
      '100+ Full Mock Tests in Official SLRC Exam Pattern',
      'Guwahati & Regional Offline Doubt Centers Access'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=600',
    popular: true,
    startDate: 'Immediate Access / New Batch 30th July',
    syllabusOverview: [
      { module: 'Module 1: Assam General Knowledge', topics: ['Ahom Dynasty & Modern History of Assam', 'Geography & National Parks of Assam', 'Assamese Literature & Art Forms'] },
      { module: 'Module 2: General Mathematics & Reasoning', topics: ['Class 10 Standard Arithmetic', 'Reasoning Shortcuts', 'Data Handling'] },
      { module: 'Module 3: English & General Science', topics: ['Grammar & Sentence Correction', 'General Science & Environmental Studies'] }
    ]
  },
  {
    id: 'course-rrb-ntpc-alp',
    slug: 'rrb-ntpc-group-d-ultimate-express-batch',
    title: 'RRB NTPC & Group D Ultimate Express Batch',
    category: 'Railway',
    targetExam: 'RRB NTPC, ALP, Group D, RPF SI',
    badge: '🚂 Railway Special',
    rating: 4.88,
    reviewsCount: 2150,
    studentsEnrolled: 9400,
    instructor: {
      name: 'Suresh Verma & Science Squad',
      designation: 'Ex-Railway Officer & Physics Expert',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200'
    },
    duration: '6 Months (300+ Hours)',
    lessonsCount: 320,
    language: 'Bilingual (Hindi + Eng)',
    originalPrice: 6499,
    discountPrice: 2299,
    features: [
      'CBT-1 + CBT-2 Complete Syllabus',
      '1,000+ NCERT Based General Science MCQs',
      'Previous 10 Years RRB Shift-Wise Paper Analysis',
      'Speed Test Engine with Instant Percentile Rank'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&q=80&w=600',
    popular: false,
    startDate: 'Batch Starts 5th August',
    syllabusOverview: [
      { module: 'Module 1: General Science (NCERT 9th & 10th)', topics: ['Physics Laws & Numericals', 'Chemistry Reactions', 'Biology System & Diseases'] },
      { module: 'Module 2: Mathematics for Railways', topics: ['Speed, Distance, Trains & Boats', 'Mensuration 2D/3D', 'Algebra & Geometry'] }
    ]
  },
  {
    id: 'course-upsc-foundation-2026',
    slug: 'upsc-cse-2026-gs-prelims-mains-integrated-foundation',
    title: 'UPSC CSE 2026 GS Prelims + Mains Integrated Foundation',
    category: 'UPSC',
    targetExam: 'UPSC Civil Services / State PCS',
    badge: '💎 Premium Masterclass',
    rating: 4.96,
    reviewsCount: 1840,
    studentsEnrolled: 4200,
    instructor: {
      name: 'Dr. V. K. Nanda (Ex-Bureaucrat) & Faculty',
      designation: 'Ph.D. Polity & Public Policy Expert',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200'
    },
    duration: '12 Months (600+ Live Hours)',
    lessonsCount: 750,
    language: 'English',
    originalPrice: 24999,
    discountPrice: 12999,
    features: [
      'NCERT Foundations (6th to 12th Class Summary)',
      'Daily Mains Answer Writing Evaluation with Feedback',
      'CSAT Aptitude & Logical Reasoning Masterclass',
      'Monthly Yojana & Kurukshetra Editorial Digest',
      'One-on-One Mentorship by Selected Officers'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=600',
    popular: false,
    startDate: 'Batch Starts 10th August',
    syllabusOverview: [
      { module: 'Module 1: Polity & Governance', topics: ['Constitutional Framework', 'Governance & Public Policy', 'International Relations'] },
      { module: 'Module 2: Indian Economy & Social Dev', topics: ['Macroeconomics & Budgeting', 'Agriculture & Food Security', 'Inclusive Growth'] },
      { module: 'Module 3: History & Geography', topics: ['Ancient to Modern History', 'World & Indian Physical Geography', 'Environment & Ecology'] }
    ]
  },
  {
    id: 'course-defence-cds-afcat',
    slug: 'cds-afcat-nda-2026-officer-target-batch',
    title: 'CDS / AFCAT / NDA 2026 Officer Target Batch',
    category: 'Defence',
    targetExam: 'CDS, AFCAT, NDA, CAPF',
    badge: '🛡️ Officer Cadre',
    rating: 4.92,
    reviewsCount: 1420,
    studentsEnrolled: 5100,
    instructor: {
      name: 'Col. S. K. Roy (Retd.) & Team',
      designation: 'Defence Veteran & SSB Mentor',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200'
    },
    duration: '6 Months (260+ Hours)',
    lessonsCount: 290,
    language: 'Bilingual (Hindi + Eng)',
    originalPrice: 8999,
    discountPrice: 3199,
    features: [
      'Written Exam Complete Syllabus',
      'SSB Interview Guidance & Psychology Assessment',
      'Physical Fitness & Medical Test Briefings',
      'Defense Specific GK & International Affairs'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=600',
    popular: false,
    startDate: 'Batch Starts 2nd August',
    syllabusOverview: [
      { module: 'Module 1: English Command', topics: ['Spotted Errors & Idioms', 'Sentence Completion', 'Comprehension'] },
      { module: 'Module 2: General Knowledge & Defense', topics: ['Defense Technology & Weapons', 'Current Military Exercises', 'General Science'] }
    ]
  },
  {
    id: 'course-assam-police-si',
    slug: 'assam-police-si-ab-ub-constable-selection-batch',
    title: 'Assam Police SI & AB/UB Constable Selection Batch',
    category: 'Assam Govt',
    targetExam: 'Assam Police SI, Constable, Commando Battalion',
    badge: '🌟 Special Regional',
    rating: 4.94,
    reviewsCount: 2100,
    studentsEnrolled: 8700,
    instructor: {
      name: 'Inspector Borah & Team',
      designation: 'Ex-Police Officer & Assam History Specialist',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
    },
    duration: '4 Months (200+ Live Classes)',
    lessonsCount: 240,
    language: 'Assamese + Eng',
    originalPrice: 4999,
    discountPrice: 1799,
    features: [
      'Complete Coverage of Written Exam Syllabus',
      'Physical PST / PET Standard Guidance & Fitness Routine',
      'Assam History, Geography, Polity & Current Affairs',
      '50+ Speed Practice Tests with Assamese Explanations'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=600',
    popular: true,
    startDate: 'Batch Starts 3rd August',
    syllabusOverview: [
      { module: 'Module 1: Assam History & General Awareness', topics: ['History of Assam & Freedom Movement', 'Assam Polity & Local Governance', 'Important Personalities & Wildlife'] },
      { module: 'Module 2: Logical Reasoning & Numerical Aptitude', topics: ['Basic Mathematics', 'Logical Puzzles & Series', 'Data Interpretation'] }
    ]
  },
  {
    id: 'course-ssc-chsl-2026',
    slug: 'ssc-chsl-10-plus-2-tier-i-ii-express-batch',
    title: 'SSC CHSL 10+2 Tier-I + Tier-II Express Batch',
    category: 'SSC',
    targetExam: 'SSC CHSL, DEO, LDC, JSA',
    badge: '⚡ High Speed',
    rating: 4.89,
    reviewsCount: 1950,
    studentsEnrolled: 7600,
    instructor: {
      name: 'Rakesh Sharma & English Squad',
      designation: 'Senior SSC Mentor',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
    },
    duration: '5 Months (220+ Live Hours)',
    lessonsCount: 280,
    language: 'Bilingual (Hindi + Eng)',
    originalPrice: 6999,
    discountPrice: 2499,
    features: [
      'Focus on Tier-I Speed & Tier-II Higher Order Questions',
      'Computer Knowledge & Typing Test Preparation Module',
      '100+ Chapterwise Tests & 40 Full Length Mocks',
      'TCS Latest Pattern Practice Questions'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=600',
    popular: false,
    startDate: 'Batch Starts 6th August',
    syllabusOverview: [
      { module: 'Module 1: Quantitative Aptitude & Algebra', topics: ['Basic Algebra & Identities', 'Trigonometric Ratios', 'Percentages & Profit Loss'] },
      { module: 'Module 2: Computer & Typing Module', topics: ['Basic Computer Fundamentals', 'Networking & Software Tools', 'Speed Typing Drills'] }
    ]
  }
];

export const SUCCESS_STORIES: SuccessStory[] = [
  {
    id: 'story-1',
    studentName: 'Vikram Singhania',
    examCleared: 'SSC CGL 2025',
    rank: 'AIR 01',
    year: 2025,
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    hasVideo: true,
    youtubeViews: '1.8M Views',
    videoDuration: '14:20',
    youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    testimonial: 'GYANM’s TCS-pattern Mock Tests and calculation speed shortcuts helped me score 342/390 in Mains. The strategy sessions kept me focused throughout my 1-year journey.',
    previousAttempts: 'Targeted AIR 1 with GYANM Full Batch',
    hometown: 'Delhi NCR',
    badge: 'Assistant Section Officer (MEA)',
    category: 'SSC',
    rollNumber: '3205019842',
    score: '342/390 (Tier 2)'
  },
  {
    id: 'story-2',
    studentName: 'Priya Sharma',
    examCleared: 'SSC CGL 2025',
    rank: 'AIR 04',
    year: 2025,
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    hasVideo: true,
    youtubeViews: '940K Views',
    videoDuration: '11:45',
    youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    testimonial: 'GYANM’s TCS-pattern Mock Tests and Rakesh Sir’s Maths shortcuts transformed my score from 120 to 184 in Tier-1. The daily analytics showed me exactly where I lost time.',
    previousAttempts: 'Failed in 2023 tier-1, Selected AIR 4 in 2025',
    hometown: 'Guwahati, Assam',
    badge: 'Central Excise Inspector',
    category: 'SSC',
    rollNumber: '1402091183',
    score: '338/390 (Tier 2)'
  },
  {
    id: 'story-3',
    studentName: 'Rohan Deshmukh',
    examCleared: 'IBPS PO 2025',
    rank: 'AIR 12',
    year: 2025,
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    hasVideo: true,
    youtubeViews: '620K Views',
    videoDuration: '09:15',
    youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    testimonial: 'The high-level Puzzles masterclasses and 1-on-1 mock interviews at GYANM were the turning point for my SBI & IBPS PO prep. Government jobs are truly made easy here!',
    previousAttempts: '1st Attempt Clearance',
    hometown: 'Chandigarh',
    badge: 'Probationary Officer, SBI',
    category: 'Banking',
    rollNumber: '2109845112',
    score: '104.5/125 (Mains)'
  },
  {
    id: 'story-4',
    studentName: 'Bishal Saikia',
    examCleared: 'Assam ADRE 3.0',
    rank: 'Rank 01 (General)',
    year: 2025,
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400',
    hasVideo: true,
    youtubeViews: '1.2M Views',
    videoDuration: '18:10',
    youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    testimonial: 'Preparing for Assam state exams used to be confusing with outdated books. GYANM provided structured Assamese & English notes and Assam GK modules that guaranteed my selection.',
    previousAttempts: 'Worked part-time while preparing',
    hometown: 'Jorhat, Assam',
    badge: 'Junior Assistant (SLRC Assam)',
    category: 'Assam Govt',
    rollNumber: '0812904321',
    score: '188/200'
  },
  {
    id: 'story-5',
    studentName: 'Ananya Verma',
    examCleared: 'UPSC CSE 2025',
    rank: 'AIR 48',
    year: 2025,
    photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400',
    hasVideo: true,
    youtubeViews: '810K Views',
    videoDuration: '15:30',
    youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    testimonial: 'Dr. Nanda Sir’s daily answer writing feedback was unmatched. GYANM provided the exact structure needed for UPSC mains without blowing up tuition fees.',
    previousAttempts: 'Cleared in 2nd Attempt',
    hometown: 'New Delhi',
    badge: 'IAS Officer Trainee',
    category: 'UPSC',
    rollNumber: '0854312',
    score: '984 Marks'
  },
  {
    id: 'story-6',
    studentName: 'Rajesh Kalita',
    examCleared: 'APSC CCE 2025',
    rank: 'Rank 03 (ACS)',
    year: 2025,
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
    hasVideo: true,
    youtubeViews: '450K Views',
    videoDuration: '12:05',
    youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    testimonial: 'The dedicated Assam Heritage & History notes along with mock interview panels at GYANM Guwahati center helped me secure Rank 3 in APSC Civil Services.',
    previousAttempts: 'Selected as ACS Officer',
    hometown: 'Guwahati, Assam',
    badge: 'Assam Civil Service (ACS)',
    category: 'Assam Govt',
    rollNumber: '1098421',
    score: 'Top Rank ACS'
  },
  {
    id: 'story-7',
    studentName: 'Neha Agrawal',
    examCleared: 'RRB NTPC 2025',
    rank: 'AIR 09',
    year: 2025,
    photoUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=400',
    hasVideo: true,
    youtubeViews: '530K Views',
    videoDuration: '08:50',
    youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    testimonial: 'NCERT General Science breakdown and RRB shift-wise PYQs from GYANM made CBT-1 and CBT-2 smooth sailing. Reached 99.8 percentile in speed tests.',
    previousAttempts: '1st Attempt Clearance',
    hometown: 'Patna, Bihar',
    badge: 'Station Master (Indian Railways)',
    category: 'Railway',
    rollNumber: '2810982341',
    score: '96.2/100 (CBT-2)'
  },
  {
    id: 'story-8',
    studentName: 'Sourav Bhowmick',
    examCleared: 'SBI PO 2025',
    rank: 'AIR 22',
    year: 2025,
    photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=400',
    hasVideo: true,
    youtubeViews: '390K Views',
    videoDuration: '10:40',
    youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    testimonial: 'Banking Awareness capsules and Speed Math shortcuts allowed me to crack SBI PO in my very first attempt. GYANM mentorship is top notch!',
    previousAttempts: 'First attempt success',
    hometown: 'Silchar, Assam',
    badge: 'Probationary Officer (SBI)',
    category: 'Banking',
    rollNumber: '1904321098',
    score: '58.5/75 (Interview & GD)'
  },
  {
    id: 'story-9',
    studentName: 'Kavita Chhetri',
    examCleared: 'Assam ADRE Grade III',
    rank: 'Rank 05',
    year: 2025,
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
    hasVideo: false,
    testimonial: 'GYANM Assam State Special mocks prepared me for the tough GK & Language sections in ADRE 3.0. Highly recommended for Assam aspirants!',
    previousAttempts: 'Cleared ADRE Grade III in 1st Attempt',
    hometown: 'Tezpur, Assam',
    badge: 'Tax Collector (Assam Govt)',
    category: 'Assam Govt',
    rollNumber: '0912837410',
    score: '184/200'
  },
  {
    id: 'story-10',
    studentName: 'Arjun Dasgupta',
    examCleared: 'SSC CHSL 2025',
    rank: 'AIR 02',
    year: 2025,
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    hasVideo: true,
    youtubeViews: '710K Views',
    videoDuration: '11:20',
    youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    testimonial: 'Speed tests and daily doubt clearing at GYANM boosted my typing & tier 2 score. Secured AIR 2 with 310/360 marks!',
    previousAttempts: '1st Attempt AIR 2',
    hometown: 'Kolkata',
    badge: 'Postal Assistant (India Post)',
    category: 'SSC',
    rollNumber: '2201948192',
    score: '310/360'
  },
  {
    id: 'story-11',
    studentName: 'Meenakshi Sundaram',
    examCleared: 'IBPS Clerk 2025',
    rank: 'AIR 06',
    year: 2025,
    photoUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=400',
    hasVideo: false,
    testimonial: 'Accuracy is key in IBPS Clerk Mains. GYANM mock series simulated the exact exam interface and difficulty level.',
    previousAttempts: 'Cleared in First Attempt',
    hometown: 'Chennai',
    badge: 'Senior Clerk (Punjab National Bank)',
    category: 'Banking',
    rollNumber: '1109283742',
    score: '118/200'
  },
  {
    id: 'story-12',
    studentName: 'Tenzing Norgay',
    examCleared: 'UPSC CAPF 2025',
    rank: 'AIR 14',
    year: 2025,
    photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=400',
    hasVideo: true,
    youtubeViews: '480K Views',
    videoDuration: '13:00',
    youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    testimonial: 'Physical endurance guidance combined with Essay Writing workshops by GYANM ex-officers made my CAPF dream a reality.',
    previousAttempts: 'Assistant Commandant Selected',
    hometown: 'Gangtok',
    badge: 'Assistant Commandant (BSF)',
    category: 'UPSC',
    rollNumber: '0519283',
    score: '326/450'
  }
];

export const MENTORS: Mentor[] = [
  {
    id: 'mentor-1',
    name: 'Rakesh Sharma',
    title: 'Head of Quantitative Aptitude',
    experienceYears: 14,
    qualification: 'Ex-Central Excise Inspector, M.Sc Mathematics',
    exRole: 'Govt Officer & Bestselling Author',
    subject: 'Quantitative Aptitude & Advanced Maths',
    selectionsMentored: 6500,
    rating: 4.98,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    bio: 'Known as the "Calculation Wizard" across North & Northeast India. Developed the famous 10-Second Calculation Formula for SSC & Banking exams.'
  },
  {
    id: 'mentor-2',
    name: 'Anuj Gupta',
    title: 'Lead Banking & Reasoning Faculty',
    experienceYears: 11,
    qualification: 'Ex-SBI PO, MBA Finance',
    exRole: 'Ex-SBI Probationary Officer',
    subject: 'Logical Reasoning & Banking Awareness',
    selectionsMentored: 4200,
    rating: 4.95,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    bio: 'Pioneer in simplifying high-level seating arrangements and complex input-output puzzles for IBPS and SBI exams.'
  },
  {
    id: 'mentor-3',
    name: 'Pranab Kumar Das',
    title: 'Assam State Exam Expert',
    experienceYears: 12,
    qualification: 'M.A. History (Gauhati Univ), B.Ed',
    exRole: 'State Education Advisor',
    subject: 'Assam History, Culture, Geography & Polity',
    selectionsMentored: 3800,
    rating: 4.97,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
    bio: 'Author of top-selling books on Assam GK and SLRC exams. Has personally trained over 15,000 aspirants in Assam & Northeast India.'
  },
  {
    id: 'mentor-4',
    name: 'Dr. V. K. Nanda',
    title: 'UPSC & State PSC Chief Mentor',
    experienceYears: 22,
    qualification: 'Ph.D. Political Science, Ex-Bureaucrat',
    exRole: 'Retd. Additional Secretary',
    subject: 'Indian Polity, Governance & Essay Writing',
    selectionsMentored: 1200,
    rating: 4.99,
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300',
    bio: 'Guided over 120+ IAS, IPS, and State Civil Services officers. Focuses on multidimensional answer writing and interview personality development.'
  }
];

export const CURRENT_AFFAIRS_ITEMS: CurrentAffairItem[] = [
  {
    id: 'ca-1',
    slug: 'rbi-repo-rate-unchanged-6-point-5-percent-monetary-policy',
    title: 'RBI Keeps Repo Rate Unchanged at 6.5%: Complete Monetary Policy Breakdown',
    category: 'Economy',
    date: '25 July 2026',
    readTime: '4 min read',
    summary: 'The Monetary Policy Committee (MPC) of the Reserve Bank of India announced its bi-monthly decision, maintaining key interest rates to ensure durable alignment of inflation with target.',
    bullets: [
      'Repo Rate maintained at 6.50% for the 8th consecutive cycle.',
      'Standing Deposit Facility (SDF) rate stands at 6.25%, MSF & Bank Rate at 6.75%.',
      'Real GDP growth projection for FY27 retained at 7.2%.',
      'CPI Inflation projection estimated at 4.5% for the financial year.'
    ],
    impForExams: ['IBPS PO', 'SBI PO', 'SSC CGL', 'UPSC Prelims', 'Assam ADRE'],
    thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=800',
    sourceName: 'RBI Official Press Release & PIB India',
    author: 'Dr. V. K. Nanda & GYANM Banking Team',
    syllabusTag: 'GS Paper III - Indian Economy & Banking Operations',
    backgroundContext: 'The Reserve Bank of India (RBI) Monetary Policy Committee (MPC) met from July 23 to 25, 2026. After detailed assessment of global financial headwinds and domestic growth-inflation dynamics, the 6-member committee voted 5:1 to keep the policy Repo Rate unchanged at 6.50%. The stance remains focused on "Withdrawal of Accommodation" to anchor inflation expectations toward the 4% target.',
    fullContent: [
      '1. Key Interest Rates Snapshot: Repo Rate = 6.50%, Reverse Repo Rate = 3.35%, SDF = 6.25%, Marginal Standing Facility (MSF) = 6.75%, Bank Rate = 6.75%, Cash Reserve Ratio (CRR) = 4.50%, Statutory Liquidity Ratio (SLR) = 18.00%.',
      '2. Inflation Dynamics: Headline CPI inflation moderated to 4.8% in recent months, but food price volatility due to erratic monsoon distribution continues to pose upside risks to headline trajectory.',
      '3. Growth Outlook: India remains the fastest-growing major economy globally. Urban demand continues to be resilient, while rural consumption is showing steady signs of recovery boosted by good Kharif sowing.',
      '4. Financial Stability & Liquidity: The RBI Governor emphasized that Indian banks maintain robust capital adequacy ratios (CRAR) and liquidity buffers. Non-Performing Assets (NPAs) hit a multi-year low of 2.8% gross NPA.'
    ],
    keyTakeaways: [
      'Monetary Policy Committee consists of 6 members (3 from RBI, 3 appointed by Central Govt).',
      'Section 45ZB of the RBI Act 1934 provides for the constitution of the MPC.',
      'Flexible Inflation Targeting framework mandates maintaining CPI at 4% with a tolerance band of +/- 2% (2% to 6%).'
    ],
    mcqQuestion: {
      question: 'Which section of the Reserve Bank of India Act, 1934 provides for the statutory constitution of the Monetary Policy Committee (MPC)?',
      options: ['Section 45ZB', 'Section 22', 'Section 17', 'Section 42(1)'],
      correctAnswer: 0,
      explanation: 'Under Section 45ZB of the RBI Act 1934, the Central Government is empowered to constitute a six-member Monetary Policy Committee.'
    }
  },
  {
    id: 'ca-2',
    slug: 'assam-govt-announces-15000-vacancies-adre-3-point-0-slrc',
    title: 'Assam Govt Cabinet Approves 15,000 New Vacancies for ADRE 3.0 & Police Recruitment',
    category: 'Assam & NE',
    date: '24 July 2026',
    readTime: '3 min read',
    summary: 'The Assam State Cabinet approved the roadmap for SLRC ADRE 3.0 notification covering Grade III, Grade IV, Police SI, and Forest Guard posts.',
    bullets: [
      'Official ADRE 3.0 advertisement expected in August 2026.',
      'Upper age relaxation extended up to 40 years for open category applicants.',
      'Mandatory registration with Assam Employment Exchange & state domicile.',
      'GYANM Assam special study modules & Assamese test series launched.'
    ],
    impForExams: ['Assam ADRE 3.0', 'Assam Police SI', 'APDCL', 'Assam TET', 'APSC'],
    thumbnail: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=800',
    sourceName: 'Assam Govt Press Release & DIPR Assam',
    author: 'Pranab Kumar Das (Assam Exam Specialist)',
    syllabusTag: 'Assam State GK & SLRC Exam Pattern 2026',
    backgroundContext: 'The State Level Recruitment Commission (SLRC) in Assam was established under the Assam Direct Recruitment Commission for Analogous Posts in Class-III and Class-IV Act, 2021. Following the successful completion of ADRE 1.0 and 2.0, the government is expediting ADRE 3.0 to fill critical vacancies across health, education, revenue, and police departments.',
    fullContent: [
      '1. Post Breakup: Grade III (Bachelor Degree & Computer posts) ~ 7,500 seats; Grade IV (8th/10th pass) ~ 5,000 seats; Assam Police & Forest Battalion ~ 2,500 seats.',
      '2. Exam Pattern: Single stage OMC/OOMR written test followed by skill test/computer proficiency test for Class III and physical standard test (PST/PET) for police cadres.',
      '3. Medium of Instruction: Question papers will be available in Assamese, Bodo, Bengali, Hindi, and English.',
      '4. Preparation Strategy: Special emphasis on Assam History (Ahom Dynasty, Freedom Movement in Assam), Assam Geography, Brahmaputra Basin, Wildlife Sanctuaries, and National Parks.'
    ],
    keyTakeaways: [
      'ADRE SLRC established under Assam Act XXI of 2021.',
      'Assam has 7 National Parks (Kaziranga, Manas, Dibru-Saikhowa, Nameri, Orang, Raimona, Dihing Patkai).',
      'Assam Employment Exchange card is strictly compulsory at the time of online application.'
    ],
    mcqQuestion: {
      question: 'Which is the 7th and latest National Park declared in Assam?',
      options: ['Dihing Patkai', 'Raimona', 'Orang', 'Nameri'],
      correctAnswer: 0,
      explanation: 'Dihing Patkai was notified as the 7th National Park of Assam in June 2021, shortly after Raimona was declared as the 6th.'
    }
  },
  {
    id: 'ca-3',
    slug: 'isro-launches-earth-observation-satellite-eos-09-pslv-c59',
    title: 'ISRO Successfully Launches Earth Observation Satellite EOS-09 via PSLV-C59',
    category: 'Science & Tech',
    date: '23 July 2026',
    readTime: '4 min read',
    summary: 'ISRO marked another milestone with the flawless orbit insertion of EOS-09 aboard the Workhorse rocket PSLV-C59 from Sriharikota.',
    bullets: [
      'Launched from First Launch Pad at Satish Dhawan Space Centre (SDSC-SHAR).',
      'Advanced Thermal Infrared & Hyperspectral Payload for agricultural monitoring.',
      'Expected high-yield questions for SSC CGL Tier 1, CDS & UPSC Science & Tech.'
    ],
    impForExams: ['SSC CGL', 'RRB NTPC', 'CDS', 'UPSC', 'State PSC'],
    thumbnail: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&q=80&w=800',
    sourceName: 'ISRO Official Bulletin & Department of Space',
    author: 'GYANM Science & Defense Desk',
    syllabusTag: 'GS Paper III - Space Technology & Defense Innovations',
    backgroundContext: 'The Polar Satellite Launch Vehicle (PSLV) completed its 61st flight (PSLV-C59). The mission carried EOS-09 into a Sun-Synchronous Polar Orbit (SSPO) at an altitude of 535 km. The satellite provides high-resolution temporal imaging for flood forecasting, crop yield estimation, and coastal erosion monitoring.',
    fullContent: [
      '1. Mission Specifications: PSLV flew in XL configuration with 6 strap-on motors. Total satellite mass is 1,480 kg with a design operational life of 5 years.',
      '2. Applications: Real-time disaster mapping, forest fire detection, mineral exploration, and border surveillance.',
      '3. Co-passenger Payloads: Included two student micro-satellites developed under IN-SPACe university partnership initiatives.',
      '4. Science Takeaway: PSLV is a four-stage launch vehicle using alternate solid and liquid propulsion stages (S1 Solid, S2 Liquid Vikas Engine, S3 Solid, S4 Liquid PS-4).'
    ],
    keyTakeaways: [
      'PSLV is a 4-stage rocket developed by ISRO using solid (HTPB) and liquid (UDMH + N2O4) propellants.',
      'Current ISRO Chairman is S. Somanath.',
      'Satish Dhawan Space Centre is situated on Sriharikota Island, Andhra Pradesh (Pulicat Lake).'
    ],
    mcqQuestion: {
      question: 'Which propellant combination is used in the liquid engines (Vikas Engine) of ISRO rockets like PSLV and LVM3?',
      options: ['UDMH and Nitrogen Tetroxide (N2O4)', 'Liquid Hydrogen and Liquid Oxygen', 'Kerosene and Liquid Oxygen', 'HTPB and Ammonium Perchlorate'],
      correctAnswer: 0,
      explanation: 'The Vikas engine uses Unsymmetrical Dimethylhydrazine (UDMH) as fuel and Nitrogen Tetroxide (N2O4) as oxidizer.'
    }
  },
  {
    id: 'ca-4',
    slug: 'india-host-quad-summit-2026-new-delhi-maritime-security',
    title: 'India to Host 2026 QUAD Leaders Summit in New Delhi: Maritime Security Focus',
    category: 'International',
    date: '22 July 2026',
    readTime: '3 min read',
    summary: 'Prime Minister Narendra Modi announced that India will host the Quad Leaders Summit featuring Leaders from US, Australia, Japan, and India.',
    bullets: [
      'Core focus: Indo-Pacific maritime domain awareness & critical technology supply chains.',
      'IPMDA initiative expansion across Indian Ocean region.',
      'Joint HADR (Humanitarian Assistance & Disaster Relief) exercises announced.'
    ],
    impForExams: ['UPSC CSE', 'SSC CGL', 'Defence CDS/NDA', 'APSC', 'Banking GA'],
    thumbnail: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&q=80&w=800',
    sourceName: 'Ministry of External Affairs (MEA India)',
    author: 'GYANM UPSC Editorial Desk',
    syllabusTag: 'GS Paper II - Bilateral, Regional & Global Groupings involving India',
    backgroundContext: 'The Quadrilateral Security Dialogue (QUAD) comprises India, the United States, Australia, and Japan. First initiated informally in 2007 by former Japanese PM Shinzo Abe, the Quad was revived in 2017 to ensure a free, open, inclusive, and resilient Indo-Pacific region.',
    fullContent: [
      '1. Key Pillars: Maritime Security, Climate Action, Infrastructure Investment, Critical & Emerging Technologies (5G, Semiconductors, AI), and Health Security.',
      '2. IPMDA Expansion: The Indo-Pacific Partnership for Maritime Domain Awareness will provide satellite-based AIS tracking data to island nations.',
      '3. Cyber Security Working Group: Joint standards for securing critical infrastructure against ransomware attacks.'
    ],
    keyTakeaways: [
      'QUAD member nations: India, USA, Japan, Australia.',
      'Malabar Exercise is the annual multilateral naval warfare exercise conducted by QUAD navies.',
      'First in-person QUAD summit was hosted by US President Joe Biden at Washington D.C. in 2021.'
    ],
    mcqQuestion: {
      question: 'Which annual naval exercise is jointly conducted by the member nations of the QUAD grouping?',
      options: ['Malabar Exercise', 'Varuna Exercise', 'Yudh Abhyas', 'Jimex Exercise'],
      correctAnswer: 0,
      explanation: 'Exercise Malabar began as a bilateral naval exercise between India and US in 1992, later expanded to include Japan and Australia.'
    }
  },
  {
    id: 'ca-5',
    slug: 'pm-surya-ghar-muft-bijli-yojana-achieves-1-crore-registrations',
    title: 'PM-Surya Ghar: Muft Bijli Yojana Crosses 1 Crore Applicant Threshold',
    category: 'Schemes',
    date: '21 July 2026',
    readTime: '3 min read',
    summary: 'Ministry of New and Renewable Energy (MNRE) confirmed unprecedented public enthusiasm for solar rooftop installations under the flagship scheme.',
    bullets: [
      'Provides up to 300 units of free electricity monthly for 1 crore households.',
      'Subsidies up to ₹78,000 for 3 kW rooftop solar systems.',
      'Massive expected questions in Government Schemes section for all competitive exams.'
    ],
    impForExams: ['SSC CGL', 'IBPS PO', 'Assam ADRE', 'UPSC', 'Railway RRB'],
    thumbnail: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&q=80&w=800',
    sourceName: 'Ministry of New & Renewable Energy (MNRE)',
    author: 'GYANM Schemes & Policy Desk',
    syllabusTag: 'GS Paper II & III - Welfare Schemes & Renewable Energy Infrastructure',
    backgroundContext: 'PM-Surya Ghar: Muft Bijli Yojana was officially launched in February 2024 with a total financial outlay of ₹75,021 crore. The scheme aims to increase solar rooftop capacity and empower residential households to generate their own electricity, selling surplus power back to DISCOMs.',
    fullContent: [
      '1. Subsidy Structure: ₹30,000 per kW for systems up to 2 kW; ₹18,000 per kW for additional capacity up to 3 kW. Maximum subsidy capped at ₹78,000.',
      '2. Collateral-free Loans: Low-interest bank loans (around 7%) available without collateral for installing rooftop panels.',
      '3. Model Solar Villages: Scheme provisions for developing one Model Solar Village in every district across India.'
    ],
    keyTakeaways: [
      'Total financial outlay: ₹75,021 Crore.',
      'Target: Installation of rooftop solar in 1 Crore (10 Million) households.',
      'Nodal Ministry: Ministry of New and Renewable Energy (MNRE).'
    ],
    mcqQuestion: {
      question: 'What is the maximum central financial assistance (subsidy) provided for a 3 kW rooftop solar system under PM-Surya Ghar Yojana?',
      options: ['₹78,000', '₹50,000', '₹1,00,000', '₹60,000'],
      correctAnswer: 0,
      explanation: 'Under PM-Surya Ghar Yojana, a subsidy of ₹60,000 is given for 2 kW systems and an additional ₹18,000 for 3 kW, making a maximum of ₹78,000.'
    }
  }
];

export const DAILY_QUIZ_QUESTIONS: DailyQuizQuestion[] = [
  {
    id: 1,
    question: 'Who is the current Governor of the Reserve Bank of India (RBI) as of 2026?',
    options: ['Shaktikanta Das', 'Urjit Patel', 'Raghuram Rajan', 'Michael Patra'],
    correctAnswer: 0,
    explanation: 'Shaktikanta Das continues to serve as the Governor of RBI, directing monetary policy and financial regulations.',
    examTag: 'Banking & SSC'
  },
  {
    id: 2,
    question: 'Which Ahom king constructed the famous Rang Ghar in Ahatguri / Sivasagar?',
    options: ['Pramatta Singha', 'Rudra Singha', 'Sutamla', 'Siva Singha'],
    correctAnswer: 0,
    explanation: 'King Pramatta Singha built the iconic two-storied Rang Ghar in Sivasagar around 1744-1751 AD as an amphitheatre for royal sports.',
    examTag: 'Assam ADRE & APSC'
  },
  {
    id: 3,
    question: 'If the price of sugar increases by 25%, by what percentage must a household reduce consumption to keep expenditure unchanged?',
    options: ['20%', '25%', '16.66%', '15%'],
    correctAnswer: 0,
    explanation: 'Formula: [R / (100 + R)] * 100 = [25 / 125] * 100 = 20%. Hence, 20% reduction is required.',
    examTag: 'SSC CGL Quant'
  },
  {
    id: 4,
    question: 'Which Article of the Indian Constitution empowers the President to declare a National Emergency?',
    options: ['Article 352', 'Article 356', 'Article 360', 'Article 370'],
    correctAnswer: 0,
    explanation: 'Article 352 deals with National Emergency on grounds of war, external aggression, or armed rebellion.',
    examTag: 'Polity - All Exams'
  },
  {
    id: 5,
    question: 'Where are the headquarters of the International Monetary Fund (IMF) located?',
    options: ['Washington, D.C.', 'Geneva', 'New York', 'Paris'],
    correctAnswer: 0,
    explanation: 'The IMF headquarters are situated in Washington, D.C., United States.',
    examTag: 'Static GK'
  }
];

export const FREE_RESOURCES: FreeResource[] = [
  {
    id: 'res-1',
    title: 'Monthly Current Affairs Digest - July 2026 Edition (PDF)',
    type: 'Current Affairs Magazine',
    category: 'All Govt Exams',
    fileSize: '14.2 MB',
    downloadsCount: 42300,
    rating: 4.9,
    description: 'Comprehensive 120-page monthly magazine with national, international, banking, and state-wise news compilation with 200 MCQ practice set.',
    language: 'Bilingual (Eng + Hin)',
    pagesCount: 120,
    chapters: ['National News & PIB Summaries', 'Economy, RBI & Banking Updates', 'Assam & NE Gazette Highlights', 'Defense & Science Technology', '200 Practice MCQs with Keys'],
    updatedDate: '25 July 2026',
    targetExams: ['SSC CGL', 'IBPS PO', 'Assam ADRE 3.0', 'UPSC Prelims'],
    isHot: true,
    originalPrice: 299,
    price: 0,
    reviewsCount: 1420,
    author: 'Gyanm Current Affairs Editorial Board',
    badge: 'BESTSELLER E-BOOK',
    coverBg: 'from-red-600 to-red-800'
  },
  {
    id: 'res-2',
    title: 'SSC CGL Tier-1 Last 10 Years Solved PYQ Papers (2016 - 2025)',
    type: 'PYQ Paper',
    category: 'SSC',
    fileSize: '32.5 MB',
    downloadsCount: 68900,
    rating: 4.95,
    description: 'Original shift-wise question papers with official answer keys, detailed step-by-step explanations, and short tricks by GYANM Faculty.',
    language: 'English',
    pagesCount: 240,
    chapters: ['Quantitative Aptitude Shifts 2021-2025', 'General Intelligence & Reasoning', 'English Comprehension & Grammar', 'General Awareness TCS Trend Analysis'],
    updatedDate: '15 July 2026',
    targetExams: ['SSC CGL', 'SSC CHSL', 'SSC CPO', 'SSC MTS'],
    isHot: true,
    originalPrice: 499,
    price: 0,
    reviewsCount: 2890,
    author: 'Gyanm SSC Research Wing',
    badge: '10 YEARS SOLVED',
    coverBg: 'from-rose-600 to-red-900'
  },
  {
    id: 'res-3',
    title: 'Assam History, Geography & Culture Master Notes (Assamese & Eng)',
    type: 'PDF Notes',
    category: 'Assam Govt',
    fileSize: '9.4 MB',
    downloadsCount: 35100,
    rating: 4.98,
    description: 'Handwritten quick revision booklet covering Ahom Dynasty timeline, Freedom Movement in Assam, 7 National Parks, Rivers & Culture.',
    language: 'Bilingual (Assamese + Eng)',
    pagesCount: 85,
    chapters: ['Ahom Kingdom & Battles (Saraighat, Itakhuli)', 'Freedom Movement in Assam & Martyrs', 'Assam Geography, Brahmaputra & Tributaries', 'Assam Art, Culture, Bihu & Festivals'],
    updatedDate: '20 July 2026',
    targetExams: ['Assam ADRE 3.0 Grade III/IV', 'Assam Police SI', 'APSC CCE', 'Assam TET'],
    isHot: true,
    originalPrice: 399,
    price: 0,
    reviewsCount: 1850,
    author: 'Prof. J. Baruah & Gyanm Assam Team',
    badge: 'ASSAM SPECIAL',
    coverBg: 'from-red-700 to-amber-900'
  },
  {
    id: 'res-4',
    title: '100 Advanced Quant Formulas & Speed Math Shortcuts Booklet',
    type: 'Formula Sheet',
    category: 'SSC & Banking',
    fileSize: '5.1 MB',
    downloadsCount: 51200,
    rating: 4.88,
    description: 'Essential formulas, Vedic calculation tricks, square/cube tables, and DI short formulas to boost math speed by 3x.',
    language: 'English',
    pagesCount: 42,
    chapters: ['Vedic Multiplication & Square Roots', 'Percentage, Profit & Loss Golden Formulas', 'Algebra & Geometry Theorem Summary', 'Data Interpretation Quick Chart Hacks'],
    updatedDate: '10 July 2026',
    targetExams: ['SSC CGL', 'IBPS PO/Clerk', 'SBI PO', 'RRB NTPC'],
    originalPrice: 199,
    price: 0,
    reviewsCount: 980,
    author: 'Er. R. Sharma (Maths HOD)',
    badge: 'SPEED MATHS',
    coverBg: 'from-red-600 to-orange-700'
  },
  {
    id: 'res-5',
    title: 'Indian Polity (M. Laxmikanth Gist) Mind Maps & Articles PDF',
    type: 'PDF Notes',
    category: 'UPSC & State PSC',
    fileSize: '11.8 MB',
    downloadsCount: 28400,
    rating: 4.92,
    description: 'High-yield chapter-wise mind maps covering Fundamental Rights, Directive Principles, Parliament, Supreme Court, and Constitutional Bodies.',
    language: 'English',
    pagesCount: 96,
    chapters: ['Preamble & Fundamental Rights (Art 12-35)', 'Directive Principles & Fundamental Duties', 'Parliamentary System & President Powers', 'Judiciary & Landmark Supreme Court Cases'],
    updatedDate: '18 July 2026',
    targetExams: ['UPSC CSE', 'APSC CCE', 'SSC CGL', 'CDS / NDA'],
    originalPrice: 349,
    price: 0,
    reviewsCount: 1120,
    author: 'Dr. A. K. Verma (UPSC Mentor)',
    badge: 'MIND MAP EDITION',
    coverBg: 'from-[#B91C1C] to-[#7F1D1D]'
  },
  {
    id: 'res-6',
    title: 'IBPS PO & SBI PO Memory Based PYQ Papers (2020 - 2025)',
    type: 'PYQ Paper',
    category: 'Banking',
    fileSize: '16.2 MB',
    downloadsCount: 41200,
    rating: 4.89,
    description: 'Exact exam shift questions with detailed solution methods for High-Level Puzzles, Data Interpretation, and New Pattern Grammar.',
    language: 'English',
    pagesCount: 160,
    chapters: ['Prelims Memory Based Papers 2021-2025', 'Mains Reasoning Puzzles & Seating Arrangements', 'Data Analysis & Interpretation Solutions', 'Banking Awareness Static & Dynamic Notes'],
    updatedDate: '12 July 2026',
    targetExams: ['IBPS PO', 'SBI PO', 'IBPS Clerk', 'RBI Grade B'],
    originalPrice: 450,
    price: 0,
    reviewsCount: 1640,
    author: 'Gyanm Banking Expert Panel',
    badge: 'BANKING EXCLUSIVE',
    coverBg: 'from-red-600 to-rose-950'
  },
  {
    id: 'res-7',
    title: 'Official Assam ADRE 3.0 Syllabus & Mark Distribution Pattern',
    type: 'Syllabus PDF',
    category: 'Assam Govt',
    fileSize: '2.8 MB',
    downloadsCount: 52000,
    rating: 4.96,
    description: 'Official notification blueprint for Class-III (Degree & HS level) and Class-IV posts with subject-wise weightage and negative marking rules.',
    language: 'Bilingual (Assamese + Eng)',
    pagesCount: 18,
    chapters: ['Class III Post Weightage & Computer Test Format', 'Class IV Syllabus & Qualification Benchmarks', 'Assam Employment Exchange Guidelines'],
    updatedDate: '22 July 2026',
    targetExams: ['Assam ADRE 3.0 SLRC'],
    originalPrice: 149,
    price: 0,
    reviewsCount: 2310,
    author: 'State Exam Advisory Board',
    badge: 'OFFICIAL SLRC BLUEPRINT',
    coverBg: 'from-red-800 to-[#581C87]'
  },
  {
    id: 'res-8',
    title: 'NCERT Class 6th to 12th History & Geography Gist Notes',
    type: 'NCERT Gist',
    category: 'UPSC & SSC',
    fileSize: '22.0 MB',
    downloadsCount: 39500,
    rating: 4.91,
    description: 'Condensed line-by-line NCERT summary for Ancient, Medieval, Modern History and World/Indian Physical Geography for quick revision.',
    language: 'English',
    pagesCount: 180,
    chapters: ['Indus Valley & Vedic Period Summary', 'Mughal Empire & British Expansion', 'Physical Geography, Monsoon & Soils of India'],
    updatedDate: '08 July 2026',
    targetExams: ['UPSC CSE', 'APSC CCE', 'SSC CGL', 'Railway RRB NTPC'],
    originalPrice: 399,
    price: 0,
    reviewsCount: 1780,
    author: 'Gyanm NCERT Research Division',
    badge: 'NCERT ESSENTIALS',
    coverBg: 'from-red-700 to-stone-900'
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'SSC CGL 2026 Official Exam Pattern & Post-Wise Salary Breakdown',
    category: 'Syllabus & Pattern',
    date: '24 July 2026',
    readTime: '6 min read',
    author: 'Rakesh Sharma',
    excerpt: 'Detailed analysis of Tier-1 and Tier-2 revised exam pattern, marking scheme, negative marking, and post-wise in-hand pay structure for 2026.',
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=500'
  },
  {
    id: 'blog-2',
    title: 'How to Crack Bank PO Puzzles in Under 3 Minutes: SBI & IBPS Strategy',
    category: 'Strategy',
    date: '21 July 2026',
    readTime: '5 min read',
    author: 'Anuj Gupta',
    excerpt: 'Step-by-step framework to eliminate options and master floor-based, box-based, and circular seating arrangements without confusion.',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=500'
  },
  {
    id: 'blog-3',
    title: 'Assam ADRE 3.0 Complete Booklist & Subject-Wise Marks Weightage',
    category: 'Exam Alert',
    date: '18 July 2026',
    readTime: '4 min read',
    author: 'Pranab Das',
    excerpt: 'Standard recommended books and online resources for ADRE Grade III and Grade IV exams to score 180+ out of 200.',
    imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=500'
  }
];

export const FAQS_DATA: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'General',
    question: 'Why is GYANM considered India\'s most trusted government exam prep platform?',
    answer: 'GYANM combines over 15+ years of offline exam teaching experience with cutting-edge technology: AI-powered performance analytics, TCS-pattern mock test engine, daily current affairs summaries, and direct mentorship from top rankers and ex-officers.'
  },
  {
    id: 'faq-2',
    category: 'Courses & Batches',
    question: 'Are the live classes interactive? What if I miss a live session?',
    answer: 'Yes! All live classes allow real-time voice and chat doubts with instructors. If you miss a live class, complete 4K HD recorded backup is uploaded within 2 hours with lifetime or batch validity, along with downloadable class PDF notes.'
  },
  {
    id: 'faq-3',
    category: 'Mock Tests',
    question: 'Do the GYANM Mock Tests match the actual TCS exam interface?',
    answer: '100% Yes. Our mock test interface replicates the exact TCS exam UI used by SSC, Railways, and Banking boards — complete with official color schemes, mark for review, section switching, and time countdown.'
  },
  {
    id: 'faq-4',
    category: 'App & Access',
    question: 'Can I access GYANM courses on both mobile app and desktop laptop?',
    answer: 'Yes! You can login seamlessly across Android App, iOS App, and Web Laptop Browser. Progress, test scores, and bookmark notes sync instantly across all devices.'
  },
  {
    id: 'faq-5',
    category: 'Courses & Batches',
    question: 'Does GYANM offer dedicated courses for Assam & Northeast State exams?',
    answer: 'Yes! GYANM has specialized regional expert faculty and dedicated bilingual batches for Assam ADRE 3.0, APDCL, Assam Police SI, APSC, and Assam TET in both Assamese and English mediums.'
  },
  {
    id: 'faq-6',
    category: 'Payments',
    question: 'Is EMI or instalment option available for GYANM online courses?',
    answer: 'Yes, we support No-Cost EMI via major credit/debit cards, UPI AutoPay, and simple 2-part instalment plans for flagship long-duration foundation batches.'
  }
];
