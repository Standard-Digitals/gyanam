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
    testimonial: 'Gyanam’s TCS-pattern Mock Tests and calculation speed shortcuts helped me score 342/390 in Mains. The strategy sessions kept me focused throughout my 1-year journey.',
    previousAttempts: 'Targeted AIR 1 with Gyanam Full Batch',
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
    testimonial: 'Gyanam’s TCS-pattern Mock Tests and Rakesh Sir’s Maths shortcuts transformed my score from 120 to 184 in Tier-1. The daily analytics showed me exactly where I lost time.',
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
    testimonial: 'The high-level Puzzles masterclasses and 1-on-1 mock interviews at Gyanam were the turning point for my SBI & IBPS PO prep. Government jobs are truly made easy here!',
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
    testimonial: 'Preparing for Assam state exams used to be confusing with outdated books. Gyanam provided structured Assamese & English notes and Assam GK modules that guaranteed my selection.',
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
    testimonial: 'Dr. Nanda Sir’s daily answer writing feedback was unmatched. Gyanam provided the exact structure needed for UPSC mains without blowing up tuition fees.',
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
    testimonial: 'The dedicated Assam Heritage & History notes along with mock interview panels at Gyanam Guwahati center helped me secure Rank 3 in APSC Civil Services.',
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
    testimonial: 'NCERT General Science breakdown and RRB shift-wise PYQs from Gyanam made CBT-1 and CBT-2 smooth sailing. Reached 99.8 percentile in speed tests.',
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
    testimonial: 'Banking Awareness capsules and Speed Math shortcuts allowed me to crack SBI PO in my very first attempt. Gyanam mentorship is top notch!',
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
    testimonial: 'Gyanam Assam State Special mocks prepared me for the tough GK & Language sections in ADRE 3.0. Highly recommended for Assam aspirants!',
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
    testimonial: 'Speed tests and daily doubt clearing at Gyanam boosted my typing & tier 2 score. Secured AIR 2 with 310/360 marks!',
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
    testimonial: 'Accuracy is key in IBPS Clerk Mains. Gyanam mock series simulated the exact exam interface and difficulty level.',
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
    testimonial: 'Physical endurance guidance combined with Essay Writing workshops by Gyanam ex-officers made my CAPF dream a reality.',
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
    title: 'RBI Keeps Repo Rate Unchanged at 6.5%: Implications for Banking Exams',
    category: 'Economy',
    date: 'Today, 25 July 2026',
    readTime: '3 min read',
    summary: 'The Monetary Policy Committee (MPC) of the Reserve Bank of India announced its latest decision regarding interest rates and inflation target.',
    bullets: [
      'Repo Rate maintained at 6.50% for 8th consecutive cycle.',
      'Reverse Repo Rate stands at 3.35%, MSF & Bank Rate at 6.75%.',
      'Real GDP growth projection for FY27 retained at 7.2%.',
      'Crucial takeaway for IBPS PO, SBI PO & SSC CGL Economics portion.'
    ],
    impForExams: ['IBPS PO', 'SBI PO', 'SSC CGL', 'UPSC Prelims', 'Assam ADRE']
  },
  {
    id: 'ca-2',
    title: 'Assam Govt Announces 15,000 New Vacancies for ADRE 3.0 & Police Recruitment',
    category: 'State Exams',
    date: 'Yesterday, 24 July 2026',
    readTime: '2 min read',
    summary: 'The Cabinet meeting approved the launch of SLRC ADRE 3.0 notification covering Grade III, IV and Forest Guard cadres.',
    bullets: [
      'Official notification expected in August 2026.',
      'Age relaxation granted up to 40 years for open category.',
      'Domicile requirement & Employment Exchange registration mandatory.',
      'Gyanam to launch dedicated Free Special Mock Tests series.'
    ],
    impForExams: ['Assam ADRE 3.0', 'Assam Police SI', 'APDCL', 'Assam TET']
  },
  {
    id: 'ca-3',
    title: 'ISRO Successfully Launches Earth Observation Satellite EOS-09 via PSLV-C59',
    category: 'Science & Tech',
    date: '23 July 2026',
    readTime: '4 min read',
    summary: 'Indian Space Research Organisation marked another milestone in space exploration with precise orbit injection.',
    bullets: [
      'Launched from Satish Dhawan Space Centre, Sriharikota.',
      'Payload includes hyper-spectral imaging for disaster management & agriculture.',
      'Expected questions in SSC CGL General Awareness & UPSC Science & Tech.'
    ],
    impForExams: ['SSC CGL', 'RRB NTPC', 'CDS', 'UPSC', 'State PSC']
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
    description: 'Comprehensive 120-page monthly magazine with national, international, banking, and state-wise news compilation with 200 MCQ practice set.'
  },
  {
    id: 'res-2',
    title: 'SSC CGL Tier-1 Last 5 Years Solved Papers (2021 - 2025)',
    type: 'PYQ Paper',
    category: 'SSC',
    fileSize: '28.5 MB',
    downloadsCount: 68900,
    rating: 4.95,
    description: 'Original shift-wise question papers with official answer keys, detailed step-by-step explanations, and short tricks by Gyanam Faculty.'
  },
  {
    id: 'res-3',
    title: 'Assam History & Geography Master Cheat Sheet (Assamese & Eng)',
    type: 'PDF Notes',
    category: 'Assam Govt',
    fileSize: '8.4 MB',
    downloadsCount: 35100,
    rating: 4.98,
    description: 'Quick revision booklet covering Ahom Dynasty timeline, Freedom Struggle in Assam, National Parks, Rivers, and Culture.'
  },
  {
    id: 'res-4',
    title: 'Advanced Quant & Vedic Maths 100 Formula Booklet',
    type: 'Formula Sheet',
    category: 'SSC & Banking',
    fileSize: '5.1 MB',
    downloadsCount: 51200,
    rating: 4.88,
    description: 'Essential formulas, short calculation tricks, square roots tables, and cube roots shortcuts to boost speed by 3x.'
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
    question: 'Why is Gyanam considered India\'s most trusted government exam prep platform?',
    answer: 'Gyanam combines over 15+ years of offline exam teaching experience with cutting-edge technology: AI-powered performance analytics, TCS-pattern mock test engine, daily current affairs summaries, and direct mentorship from top rankers and ex-officers.'
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
    question: 'Do the Gyanam Mock Tests match the actual TCS exam interface?',
    answer: '100% Yes. Our mock test interface replicates the exact TCS exam UI used by SSC, Railways, and Banking boards — complete with official color schemes, mark for review, section switching, and time countdown.'
  },
  {
    id: 'faq-4',
    category: 'App & Access',
    question: 'Can I access Gyanam courses on both mobile app and desktop laptop?',
    answer: 'Yes! You can login seamlessly across Android App, iOS App, and Web Laptop Browser. Progress, test scores, and bookmark notes sync instantly across all devices.'
  },
  {
    id: 'faq-5',
    category: 'Courses & Batches',
    question: 'Does Gyanam offer dedicated courses for Assam & Northeast State exams?',
    answer: 'Yes! Gyanam has specialized regional expert faculty and dedicated bilingual batches for Assam ADRE 3.0, APDCL, Assam Police SI, APSC, and Assam TET in both Assamese and English mediums.'
  },
  {
    id: 'faq-6',
    category: 'Payments',
    question: 'Is EMI or instalment option available for Gyanam online courses?',
    answer: 'Yes, we support No-Cost EMI via major credit/debit cards, UPI AutoPay, and simple 2-part instalment plans for flagship long-duration foundation batches.'
  }
];
