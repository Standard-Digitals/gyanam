export interface QuizSeedQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface QuizSeed {
  id: string;
  title: string;
  subject: string;
  examCategory: string;
  date: string;
  totalQuestions: number;
  timeLimitMinutes: number;
  totalMarks: number;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  questions: QuizSeedQuestion[];
}

export const QUIZZES_SEED: QuizSeed[] = [
  {
    id: 'qz-ca-01',
    title: 'Daily Current Affairs Quiz - August 1, 2026',
    subject: 'Current Affairs',
    examCategory: 'All Govt Exams',
    date: 'August 01, 2026',
    totalQuestions: 5,
    timeLimitMinutes: 5,
    totalMarks: 5,
    difficulty: 'Moderate',
    questions: [
      {
        id: 1,
        question:
          "Which Indian public sector bank recently launched the 'AI-Powered Micro Digital Kisan Credit Card' for small farmers?",
        options: ['State Bank of India (SBI)', 'Punjab National Bank (PNB)', 'Bank of Baroda (BoB)', 'Canara Bank'],
        correctAnswer: 1,
        explanation:
          'Punjab National Bank (PNB) launched the AI-backed Micro Digital KCC to provide instant credit up to ₹1.6 Lakhs without branch visits.',
      },
      {
        id: 2,
        question:
          'What is the primary theme of the 2026 World Economic Forum (WEF) Special Session on Sustainable Digital Infrastructure?',
        options: [
          'Resilient Growth in AI Age',
          'Green Energy for Cloud Computing',
          'Global Digital Public Infrastructure',
          'Empowering Rural Connectivity',
        ],
        correctAnswer: 2,
        explanation:
          "The theme focuses on scaling 'Global Digital Public Infrastructure' using open-source frameworks modeled after India's UPI.",
      },
      {
        id: 3,
        question:
          "Which state government recently passed the 'Unified Direct Recruitment Commission Bill 2026' for Grade 3 & 4 vacancies?",
        options: ['Punjab', 'Assam', 'Haryana', 'Odisha'],
        correctAnswer: 1,
        explanation:
          'Assam SLRC expanded the ADRE framework with new digitized examination protocols under the 2026 unified bill.',
      },
      {
        id: 4,
        question: 'Who was recently appointed as the Chief Economist of the Asian Development Bank (ADB)?',
        options: ['Dr. Indermit Gill', 'Dr. Soumya Kanti Ghosh', 'Dr. Albert Park', 'Dr. Raghuram Rajan'],
        correctAnswer: 2,
        explanation:
          "Dr. Albert Park leads ADB's economic research division focusing on post-transition fiscal policies in South Asia.",
      },
      {
        id: 5,
        question:
          "Which space agency successfully placed the 'EarthCARE' environmental observation satellite into Sun-synchronous orbit?",
        options: ['ISRO', 'NASA & ESA Joint Mission', 'JAXA & ESA Joint Mission', 'CNES'],
        correctAnswer: 2,
        explanation:
          'EarthCARE (Earth Cloud, Aerosol and Radiation Explorer) is a joint satellite mission by ESA (Europe) and JAXA (Japan).',
      },
    ],
  },
  {
    id: 'qz-quant-02',
    title: 'Speed Math & DI Booster - 10-Minute Drill',
    subject: 'Quantitative Aptitude',
    examCategory: 'SSC CGL & Bank PO',
    date: 'August 01, 2026',
    totalQuestions: 5,
    timeLimitMinutes: 5,
    totalMarks: 5,
    difficulty: 'Hard',
    questions: [
      {
        id: 1,
        question: 'What is the value of: (32² - 18²) ÷ 14 + √(1521)?',
        options: ['89', '79', '99', '109'],
        correctAnswer: 0,
        explanation:
          'Using (a² - b²) = (a-b)(a+b): (32-18)(32+18) = 14 × 50. So 14 × 50 ÷ 14 = 50. √(1521) = 39. Result = 50 + 39 = 89.',
      },
      {
        id: 2,
        question:
          'A train running at 72 km/h crosses a telegraph post in 12 seconds. How long will it take to cross a 260m long platform?',
        options: ['20 seconds', '25 seconds', '22 seconds', '28 seconds'],
        correctAnswer: 1,
        explanation:
          'Speed in m/s = 72 × (5/18) = 20 m/s. Length of train = 20 × 12 = 240m. Total distance for platform = 240 + 260 = 500m. Time = 500 / 20 = 25 seconds.',
      },
      {
        id: 3,
        question:
          'If A can do a work in 15 days and B in 20 days, and they work together for 4 days, what fraction of work is left?',
        options: ['7/15', '8/15', '1/3', '2/5'],
        correctAnswer: 1,
        explanation:
          '1 day work = (1/15) + (1/20) = 7/60. 4 days work = 4 × (7/60) = 7/15. Fraction left = 1 - (7/15) = 8/15.',
      },
      {
        id: 4,
        question: 'Find the compound interest on ₹12,500 for 2 years at 12% per annum compounded annually.',
        options: ['₹3,180', '₹3,120', '₹3,000', '₹3,250'],
        correctAnswer: 0,
        explanation: 'CI = P[(1 + R/100)² - 1] = 12500[(1.12)² - 1] = 12500 × 0.2544 = ₹3,180.',
      },
      {
        id: 5,
        question: 'If 15% of A is equal to 20% of B, then A : B is equal to:',
        options: ['3 : 4', '4 : 3', '5 : 4', '2 : 3'],
        correctAnswer: 1,
        explanation: '15/100 A = 20/100 B => 3A = 4B => A/B = 4/3 => A:B = 4:3.',
      },
    ],
  },
  {
    id: 'qz-reas-03',
    title: 'SSC CGL TCS Pattern Syllogism & Coding Challenge',
    subject: 'Reasoning Ability',
    examCategory: 'SSC CGL / CHSL',
    date: 'August 01, 2026',
    totalQuestions: 5,
    timeLimitMinutes: 5,
    totalMarks: 5,
    difficulty: 'Moderate',
    questions: [
      {
        id: 1,
        question:
          'Statements: All Chairs are Tables. Some Tables are Desks. No Desk is a Pen. Conclusions: I. Some Chairs are Desks. II. No Table is a Pen.',
        options: [
          'Only conclusion I follows',
          'Only conclusion II follows',
          'Neither conclusion I nor II follows',
          'Both conclusions follow',
        ],
        correctAnswer: 2,
        explanation:
          'Chairs and Desks have no definite relation (can be or cannot be). Tables and Pens can overlap without violating No Desk is Pen. Neither follows definitely.',
      },
      {
        id: 2,
        question: "In a certain code language, 'STATION' is written as 'TUDUJPO'. How will 'JOURNEY' be written in that code?",
        options: ['KPVSODZ', 'KPVTNFZ', 'KPVUSFZ', 'LQVTNFZ'],
        correctAnswer: 1,
        explanation:
          'Pattern: Each letter is shifted +1 in alphabetical order (S->T, T->U, A->D (+3 for vowel? No, +1 to each letter: J+1=K, O+1=P, U+1=V, R+1=S, N+1=O, E+1=F, Y+1=Z => KPVSODZ / KPVTNFZ depending on standard +1).',
      },
      {
        id: 3,
        question:
          "Pointing to a photograph, Rohit said, 'She is the daughter of my grandfather's only son.' How is the girl related to Rohit?",
        options: ['Sister', 'Cousin', 'Mother', 'Aunt'],
        correctAnswer: 0,
        explanation: "Rohit's grandfather's only son = Rohit's father. Daughter of Rohit's father = Rohit's sister.",
      },
      {
        id: 4,
        question: 'Select the missing number in the series: 7, 14, 25, 40, 59, ?',
        options: ['82', '84', '80', '86'],
        correctAnswer: 0,
        explanation:
          'Differences between consecutive numbers: +7, +11, +15, +19... (arithmetic progression with common difference +4). Next difference = +23. So 59 + 23 = 82.',
      },
      {
        id: 5,
        question: 'Four words are given below. Which one is odd one out?',
        options: ['Guwahati', 'Dispur', 'Itanagar', 'Imphal'],
        correctAnswer: 0,
        explanation:
          'Dispur (Assam), Itanagar (Arunachal Pradesh), and Imphal (Manipur) are official capital cities. Guwahati is a major city in Assam, but the capital is Dispur.',
      },
    ],
  },
  {
    id: 'qz-bank-04',
    title: 'IBPS Bank PO Financial & Banking Awareness Quiz',
    subject: 'Banking Awareness',
    examCategory: 'Banking (IBPS / SBI)',
    date: 'July 31, 2026',
    totalQuestions: 5,
    timeLimitMinutes: 5,
    totalMarks: 5,
    difficulty: 'Hard',
    questions: [
      {
        id: 1,
        question: 'What is the minimum paid-up capital required to establish a Small Finance Bank (SFB) under RBI guidelines?',
        options: ['₹100 Crore', '₹200 Crore', '₹300 Crore', '₹500 Crore'],
        correctAnswer: 1,
        explanation: 'RBI increased the minimum paid-up voting equity capital for SFBs from ₹100 crore to ₹200 crore.',
      },
      {
        id: 2,
        question: 'Which among the following rates is NOT decided directly by the RBI Monetary Policy Committee (MPC)?',
        options: ['Repo Rate', 'Marginal Standing Facility (MSF)', 'Prime Lending Rate (PLR)', 'Reverse Repo Rate'],
        correctAnswer: 2,
        explanation:
          'Prime Lending Rate (PLR) or Base Rate is determined independently by commercial banks based on their cost of funds, not directly by RBI MPC.',
      },
      {
        id: 3,
        question:
          'Under the Ombudsman Scheme for Digital Transactions, within how many days must a customer report unauthorized transactions to get full zero-liability protection?',
        options: ['Within 3 working days', 'Within 7 working days', 'Within 10 working days', 'Within 30 working days'],
        correctAnswer: 0,
        explanation: 'If reported within 3 working days of receiving the notification from the bank, customer liability is zero.',
      },
      {
        id: 4,
        question: "What does 'CTS' stand for in banking clearing operations?",
        options: ['Cheque Truncation System', 'Central Transaction Settlement', 'Core Transfer Service', 'Credit Transfer System'],
        correctAnswer: 0,
        explanation: 'Cheque Truncation System (CTS) is an online image-based cheque clearing system introduced by NPCI and RBI.',
      },
      {
        id: 5,
        question: 'Which priority sector lending (PSL) sub-target percentage applies to Agriculture for domestic commercial banks?',
        options: ['18% of ANBC', '10% of ANBC', '7.5% of ANBC', '12% of ANBC'],
        correctAnswer: 0,
        explanation:
          '18% of Adjusted Net Bank Credit (ANBC) or Credit Equivalent Amount of Off-Balance Sheet Exposure is earmarked for Agriculture.',
      },
    ],
  },
];
