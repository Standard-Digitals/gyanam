'use client';
import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { 
  HelpCircle, Search, ChevronDown, Phone, Mail, MessageSquare, 
  CheckCircle2, Clock, ShieldCheck, FileText, ArrowRight, X, 
  Send, ThumbsUp, ThumbsDown, Copy, Check, AlertCircle, Headphones, 
  Smartphone, BookOpen, CreditCard, GraduationCap, MapPin, RefreshCw, 
  Truck, Key, LifeBuoy, Sparkles, ChevronRight, UserCheck, ExternalLink
} from 'lucide-react';

interface FAQCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  desc: string;
  count: number;
}

interface ExpandedFAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
  popular?: boolean;
  helpfulCount: number;
  tags: string[];
}

const EXTENDED_FAQS: ExpandedFAQ[] = [
  // General & Admissions
  {
    id: 'faq-1',
    category: 'Admissions & Batches',
    question: 'Why is GYANM Academy considered India\'s premier government exam preparation portal?',
    answer: 'GYANM combines over 14 years of offline classroom heritage with state-of-the-art digital learning: 100% TCS-pattern mock test engines, author-written printed study materials, daily current affairs compendiums, and personal 1-on-1 mentorship from top rankers and ex-government officers.',
    popular: true,
    helpfulCount: 482,
    tags: ['about gyanam', 'reputation', 'results']
  },
  {
    id: 'faq-2',
    category: 'Admissions & Batches',
    question: 'How do I join an Offline Classroom Batch or Online Live App Batch?',
    answer: 'You can register directly on our website or mobile app by selecting your target exam (SSC CGL, Banking PO/Clerk, Assam ADRE, Punjab Patwari, Railway NTPC, UPSC/State PSC) and clicking "Enroll Now". For offline centers in Chandigarh, Guwahati, Amritsar, Bathinda, or Delhi, you can also walk in or request a free counseling call.',
    popular: true,
    helpfulCount: 390,
    tags: ['enrollment', 'admission process', 'offline batch']
  },
  {
    id: 'faq-3',
    category: 'Admissions & Batches',
    question: 'Are live classes interactive? What happens if I miss a live class session?',
    answer: 'Yes! All live online sessions feature real-time two-way voice and chat doubt clarification with senior faculty. If you miss a live class, complete 4K HD recorded backup videos are automatically uploaded to your GYANM App account within 2 hours, alongside downloadable class PDF annotations.',
    popular: true,
    helpfulCount: 512,
    tags: ['live class', 'recorded backup', 'missed class']
  },
  {
    id: 'faq-4',
    category: 'Admissions & Batches',
    question: 'Can I switch from an Online Live Batch to an Offline Center Batch later?',
    answer: 'Yes, batch transfer requests from Online to Offline (or vice versa) are permitted within 14 days of enrollment by adjusting the fee difference through your assigned Student Relationship Officer or center helpdesk.',
    popular: false,
    helpfulCount: 198,
    tags: ['batch transfer', 'offline to online']
  },

  // Mobile App & Technical Support
  {
    id: 'faq-5',
    category: 'Mobile App & Web',
    question: 'Can I access my GYANM courses on both Android, iOS, and Laptop Web browsers?',
    answer: 'Absolutely! Single account login works seamlessly across Android phones/tablets, iPhones/iPads, and Desktop Web Browsers. Your video watch history, bookmarked test questions, and quiz progress sync instantly across devices.',
    popular: true,
    helpfulCount: 620,
    tags: ['app login', 'ios app', 'laptop access', 'multi-device']
  },
  {
    id: 'faq-6',
    category: 'Mobile App & Web',
    question: 'What should I do if videos buffer or fail to play on the GYANM App?',
    answer: '1. Ensure your GYANM Mobile App is updated to the latest version from Play Store / App Store.\n2. In the video player settings, lower the video resolution from 1080p to 480p or Auto.\n3. Try clearing the app cache via App Settings > Storage > Clear Cache.\n4. If the issue persists, download the lecture for offline viewing within the app.',
    popular: true,
    helpfulCount: 410,
    tags: ['video playback', 'buffering', 'app update', 'cache']
  },
  {
    id: 'faq-7',
    category: 'Mobile App & Web',
    question: 'How do I download lecture notes and class PDF study files?',
    answer: 'Inside any course section on the GYANM App or Web Portal, open the specific lecture or topic card and click the "Download PDF" icon located below the video player. Downloaded PDFs can be viewed offline or printed.',
    popular: false,
    helpfulCount: 275,
    tags: ['pdf download', 'notes', 'study material']
  },

  // Mock Tests & TCS Pattern
  {
    id: 'faq-8',
    category: 'Mock Test Engine',
    question: 'Do GYANM Mock Tests accurately replicate the official TCS exam UI?',
    answer: '100% Yes. Our mock test engine matches the exact color palette, question status palette (Answered, Not Answered, Marked for Review), countdown timers, section switching logic, and keyboard shortcuts used by SSC, RRB Railways, and Banking TCS exam centers.',
    popular: true,
    helpfulCount: 780,
    tags: ['tcs pattern', 'mock test interface', 'timer']
  },
  {
    id: 'faq-9',
    category: 'Mock Test Engine',
    question: 'When are mock test rank lists and AI percentile performance reports published?',
    answer: 'Instant AI Analytics: As soon as you submit a test, you receive immediate subject-wise accuracy, speed analysis, and negative mark breakdown. All-India Percentile Ranks and topper comparison leaderboards are updated daily at 9:00 PM for all test takers.',
    popular: true,
    helpfulCount: 340,
    tags: ['rank list', 'percentile', 'ai report', 'topper comparison']
  },
  {
    id: 'faq-10',
    category: 'Mock Test Engine',
    question: 'What if a test gets interrupted due to a power outage or internet disconnect?',
    answer: 'Do not panic! Your answered responses and timer state are auto-saved to our cloud servers every 5 seconds. Simply re-open the test from your dashboard to resume right where you left off.',
    popular: false,
    helpfulCount: 220,
    tags: ['test crash', 'auto save', 'internet disconnect']
  },

  // Books & Delivery
  {
    id: 'faq-11',
    category: 'Books & Delivery',
    question: 'How many days does it take to deliver printed GYANM textbooks to my home?',
    answer: 'Printed book orders are dispatched via Express Courier (BlueDart / DTDC / SpeedPost) within 24 hours of purchase. Delivery timelines: Metro cities (2–3 working days), Tier 2/3 towns & Northeast India (4–6 working days). You will receive an SMS and WhatsApp tracking link.',
    popular: true,
    helpfulCount: 590,
    tags: ['book delivery', 'courier tracking', 'shipping time']
  },
  {
    id: 'faq-12',
    category: 'Books & Delivery',
    question: 'What if I receive a damaged book or misprinted pages?',
    answer: 'GYANM guarantees a 100% free doorstep replacement. Simply snap 2 clear photos of the damaged cover or misprinted pages and submit a ticket here or message our WhatsApp Helpdesk (+91 9117 35 35 35). Replacement copy is dispatched within 24 hours.',
    popular: false,
    helpfulCount: 185,
    tags: ['damaged book', 'replacement', 'misprint']
  },

  // Payments & Refunds
  {
    id: 'faq-13',
    category: 'Payment & EMI',
    question: 'Which payment options are supported on GYANM? Is No-Cost EMI available?',
    answer: 'We accept UPI (GPay, PhonePe, Paytm), All Bank Credit/Debit Cards, NetBanking, and Wallet payments. For flagship long-duration courses, 0% Interest No-Cost EMI is available on major credit cards and Bajaj Finserv EMI cards.',
    popular: true,
    helpfulCount: 440,
    tags: ['payment modes', 'no cost emi', 'upi', 'credit card']
  },
  {
    id: 'faq-14',
    category: 'Payment & EMI',
    question: 'Money was deducted from my account but the course is not unlocked yet. What should I do?',
    answer: 'Usually bank servers update transaction status within 5 to 15 minutes. If your course is still locked after 15 minutes, please submit your UPI Reference / Bank UTR Number via the Ticket Form below or email payments@gyanam.co.in. Our team will verify and activate your course instantly.',
    popular: true,
    helpfulCount: 670,
    tags: ['payment failure', 'money deducted', 'course activation']
  },
  {
    id: 'faq-15',
    category: 'Payment & EMI',
    question: 'How can I download my GST Fee Payment Receipt / Tax Invoice?',
    answer: 'Log into your GYANM App or Web account, go to "My Profile" > "Purchase History" > click "Download GST Invoice". A PDF receipt with full fee breakdown will be saved to your device.',
    popular: false,
    helpfulCount: 310,
    tags: ['fee receipt', 'gst invoice', 'tax receipt']
  },

  // Regional & Offline Centers
  {
    id: 'faq-16',
    category: 'State Exams & Regional',
    question: 'Does GYANM offer dedicated state exam prep for Assam (ADRE/APSC) and Punjab (Patwari/PPSC)?',
    answer: 'Yes! GYANM operates dedicated regional content wings. We offer bilingual Assamese/English courses for Assam ADRE 3.0 & APSC, as well as Punjabi/English courses for Punjab Patwari, PPSC, and Punjab Police, prepared by native expert faculty.',
    popular: true,
    helpfulCount: 520,
    tags: ['assam adre', 'punjab patwari', 'regional language', 'apsc']
  }
];

export default function HelpdeskFAQPage() {
  const router = useRouter();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [openFaqId, setOpenFaqId] = useState<string>('faq-1');

  // Helpfulness feedback state
  const [feedbackGiven, setFeedbackGiven] = useState<{ [key: string]: 'up' | 'down' }>({});
  const [copiedFaqId, setCopiedFaqId] = useState<string | null>(null);

  // Ticket Modal / Form State
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    studentName: '',
    phone: '',
    email: '',
    rollNoOrOrderId: '',
    category: 'Course Access & Video Player',
    urgency: 'Normal',
    description: ''
  });
  const [ticketSubmitting, setTicketSubmitting] = useState(false);
  const [generatedTicketRef, setGeneratedTicketRef] = useState<string | null>(null);

  // Quick Action Modals State
  const [activeQuickAction, setActiveQuickAction] = useState<'order' | 'reset' | 'receipt' | null>(null);
  const [quickActionInput, setQuickActionInput] = useState('');
  const [quickActionResult, setQuickActionResult] = useState<string | null>(null);

  // Categories List
  const helpCategories: FAQCategory[] = [
    { id: 'Admissions & Batches', name: 'Admissions & Batches', icon: <GraduationCap className="w-5 h-5 text-[#C12223]" />, desc: 'Batch schedules, enrollment & live classes', count: 4 },
    { id: 'Mobile App & Web', name: 'Mobile App & Web', icon: <Smartphone className="w-5 h-5 text-emerald-600" />, desc: 'Login issues, video playback & app downloads', count: 3 },
    { id: 'Mock Test Engine', name: 'Mock Test Engine', icon: <FileText className="w-5 h-5 text-[#C12223]" />, desc: 'TCS pattern tests, rank lists & score cards', count: 3 },
    { id: 'Books & Delivery', name: 'Books & Delivery', icon: <Truck className="w-5 h-5 text-amber-600" />, desc: 'Courier tracking, dispatch time & replacements', count: 2 },
    { id: 'Payment & EMI', name: 'Payment & EMI', icon: <CreditCard className="w-5 h-5 text-purple-600" />, desc: 'Failed payments, EMI options & fee receipts', count: 3 },
    { id: 'State Exams & Regional', name: 'State Exams & Regional', icon: <MapPin className="w-5 h-5 text-blue-600" />, desc: 'Assam ADRE, Punjab Govt & regional notes', count: 1 }
  ];

  // Filtered FAQs
  const filteredFaqs = useMemo(() => {
    return EXTENDED_FAQS.filter((faq) => {
      const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        faq.question.toLowerCase().includes(q) ||
        faq.answer.toLowerCase().includes(q) ||
        faq.tags.some(t => t.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Handle Helpfulness vote
  const handleFeedback = (id: string, type: 'up' | 'down') => {
    setFeedbackGiven(prev => ({ ...prev, [id]: type }));
  };

  // Copy FAQ answer
  const handleCopyAnswer = (faq: ExpandedFAQ) => {
    const textToCopy = `Q: ${faq.question}\n\nA: ${faq.answer}\n\nRead more at GYANM Student Helpdesk: https://gyanam.co.in/helpdesk`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedFaqId(faq.id);
    setTimeout(() => setCopiedFaqId(null), 2000);
  };

  // Handle Ticket Submission
  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketForm.studentName || !ticketForm.phone || !ticketForm.description) return;

    setTicketSubmitting(true);
    try {
      const res = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticketForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit ticket');
      setGeneratedTicketRef(data.ticketNumber);
    } catch (err) {
      console.error('Failed to submit ticket', err);
    } finally {
      setTicketSubmitting(false);
    }
  };

  // Handle Quick Actions Search
  const handleQuickActionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickActionInput) return;

    if (activeQuickAction === 'reset') {
      setQuickActionResult(`GYANM login uses mobile OTP, not a password — there's nothing to reset. Just enter your mobile number and OTP each time to log in.`);
      return;
    }

    if (activeQuickAction === 'order' || activeQuickAction === 'receipt') {
      try {
        const res = await fetch(`/api/orders/lookup?query=${encodeURIComponent(quickActionInput)}`);
        const data = await res.json();
        if (!data.found) {
          setQuickActionResult(`No order found for "${quickActionInput}". Please check your Order ID or mobile number and try again.`);
          return;
        }
        const o = data.order;
        if (activeQuickAction === 'order') {
          setQuickActionResult(`Order #${o.orderNumber}: Status — ${o.orderStatus}. Payment: ${o.paymentMethod.toUpperCase()} (${o.paymentStatus}).`);
        } else {
          setQuickActionResult(`Receipt for Order #${o.orderNumber}: ₹${o.grandTotal} paid via ${o.paymentMethod.toUpperCase()} on ${new Date(o.createdAt).toLocaleDateString()}.`);
        }
      } catch (err) {
        setQuickActionResult('Something went wrong looking up your order. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF5F5] text-[#1F1A1C] pb-20">
      
      {/* 1. HERO HEADER - Red & Gold Knowledge Desk Vault */}
      <section className="relative bg-gradient-to-br from-[#8C1316] via-[#C12223] to-[#8C1316] text-white pt-12 pb-20 overflow-hidden border-b border-red-400/30">
        {/* Subtle glowing halos */}
        <div className="absolute top-0 right-10 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-red-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff20_1px,transparent_1px)] [background-size:28px_28px]" />

        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 relative z-10">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-semibold text-red-200 mb-6">
            <button onClick={() => router.push('/')} className="hover:text-amber-300 transition cursor-pointer">Home</button>
            <ChevronRight className="w-3.5 h-3.5 text-red-300" />
            <span className="text-amber-300 font-bold">Helpdesk & FAQs</span>
          </div>

          <div className="text-center max-w-3xl mx-auto space-y-4">
            
            <div className="inline-flex items-center gap-2 bg-amber-400 text-red-950 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-lg shadow-amber-400/20">
              <LifeBuoy className="w-4 h-4 text-red-800 animate-spin" style={{ animationDuration: '8s' }} />
              <span>GYANM Student Resolution Desk • 24/7 Knowledge Base</span>
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-[1.15] tracking-tight">
              How Can We <span className="text-amber-300">Help You Today?</span>
            </h1>

            <p className="text-red-100 text-xs sm:text-sm font-medium leading-relaxed max-w-2xl mx-auto">
              Search instant answers for course access, mock test reset, video player issues, printed book delivery status, and fee receipts.
            </p>

            {/* Smart Live Search Input */}
            <div className="relative max-w-2xl mx-auto pt-2">
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search your question (e.g. video buffer, book delivery, mock test reset, fee receipt)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-10 py-4 bg-white rounded-2xl text-gray-900 text-xs sm:text-sm font-semibold shadow-2xl focus:outline-none focus:ring-2 focus:ring-amber-400 transition placeholder:text-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 font-bold text-sm w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Common Search Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
              <span className="text-red-200 font-semibold">Popular Searches:</span>
              {[
                'App Video Buffering',
                'Book Courier Tracking',
                'TCS Mock Test Reset',
                'Assam ADRE Batch',
                'Fee GST Invoice'
              ].map((pill) => (
                <button
                  key={pill}
                  onClick={() => setSearchQuery(pill)}
                  className="px-3 py-1 bg-white/10 hover:bg-white/20 text-red-100 rounded-full border border-white/20 transition cursor-pointer text-[11px] font-bold"
                >
                  {pill}
                </button>
              ))}
            </div>

          </div>

          {/* Key Resolution Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto mt-10">
            <div className="bg-red-900/60 backdrop-blur-md p-3.5 rounded-2xl border border-red-400/30 text-center">
              <div className="font-heading font-black text-xl sm:text-2xl text-amber-300">12 Mins</div>
              <div className="text-[10px] font-bold text-red-100 uppercase tracking-wider mt-0.5">Avg Ticket Resolution</div>
            </div>
            <div className="bg-red-900/60 backdrop-blur-md p-3.5 rounded-2xl border border-red-400/30 text-center">
              <div className="font-heading font-black text-xl sm:text-2xl text-white">99.4%</div>
              <div className="text-[10px] font-bold text-red-100 uppercase tracking-wider mt-0.5">Student Satisfaction</div>
            </div>
            <div className="bg-red-900/60 backdrop-blur-md p-3.5 rounded-2xl border border-red-400/30 text-center">
              <div className="font-heading font-black text-xl sm:text-2xl text-amber-300">100%</div>
              <div className="text-[10px] font-bold text-red-100 uppercase tracking-wider mt-0.5">TCS Test Sync</div>
            </div>
            <div className="bg-red-900/60 backdrop-blur-md p-3.5 rounded-2xl border border-red-400/30 text-center">
              <div className="font-heading font-black text-xl sm:text-2xl text-emerald-400">24/7</div>
              <div className="text-[10px] font-bold text-red-100 uppercase tracking-wider mt-0.5">Self-Service Desk</div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. SELF-SERVICE QUICK ACTION TOOLBAR */}
      <section className="py-8 max-w-[1320px] mx-auto px-4 sm:px-6 -mt-8 relative z-20">
        <div className="bg-white rounded-3xl p-6 border border-red-100 shadow-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <button
            onClick={() => { setActiveQuickAction('order'); setQuickActionResult(null); setQuickActionInput(''); }}
            className="p-4 bg-red-50/70 hover:bg-red-50 border border-red-100 rounded-2xl text-left transition group cursor-pointer flex items-center gap-3.5"
          >
            <div className="w-11 h-11 rounded-xl bg-[#C12223] text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-heading font-black text-xs text-gray-900 group-hover:text-[#C12223] transition">
                Track Book Order Status
              </h4>
              <p className="text-[11px] text-gray-500 font-medium">Courier AWB & delivery timeline</p>
            </div>
          </button>

          <button
            onClick={() => { setActiveQuickAction('reset'); setQuickActionResult(null); setQuickActionInput(''); }}
            className="p-4 bg-red-50/70 hover:bg-red-50 border border-red-100 rounded-2xl text-left transition group cursor-pointer flex items-center gap-3.5"
          >
            <div className="w-11 h-11 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-heading font-black text-xs text-gray-900 group-hover:text-[#C12223] transition">
                Reset App Password
              </h4>
              <p className="text-[11px] text-gray-500 font-medium">Recover account login link</p>
            </div>
          </button>

          <button
            onClick={() => { setActiveQuickAction('receipt'); setQuickActionResult(null); setQuickActionInput(''); }}
            className="p-4 bg-red-50/70 hover:bg-red-50 border border-red-100 rounded-2xl text-left transition group cursor-pointer flex items-center gap-3.5"
          >
            <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-heading font-black text-xs text-gray-900 group-hover:text-[#C12223] transition">
                Download Fee Receipt
              </h4>
              <p className="text-[11px] text-gray-500 font-medium">GST Tax invoice & payment slip</p>
            </div>
          </button>

          <button
            onClick={() => { setIsTicketModalOpen(true); setGeneratedTicketRef(null); }}
            className="p-4 bg-gradient-to-r from-[#8C1316] to-[#C12223] text-white rounded-2xl text-left transition group cursor-pointer flex items-center gap-3.5 shadow-md hover:opacity-95"
          >
            <div className="w-11 h-11 rounded-xl bg-amber-400 text-red-950 flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-heading font-black text-xs text-white">
                Submit Support Ticket
              </h4>
              <p className="text-[11px] text-red-100 font-medium">Get unique reference ID</p>
            </div>
          </button>

        </div>
      </section>

      {/* 3. HELP TOPIC CATEGORIES GRID */}
      <section className="py-10 max-w-[1320px] mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <span className="text-xs font-black text-[#C12223] uppercase tracking-wider">
            Explore By Topic
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-black text-gray-900">
            Browse Support Categories
          </h2>
          <p className="text-xs text-gray-500 font-medium">
            Click any category to filter specific solutions and step-by-step guides.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {helpCategories.map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(isSelected ? 'All' : cat.id)}
                className={`p-6 rounded-3xl border text-left transition-all duration-300 cursor-pointer flex flex-col justify-between group ${
                  isSelected
                    ? 'bg-white border-[#C12223] shadow-xl ring-2 ring-[#C12223]/20'
                    : 'bg-white border-red-100 shadow-sm hover:shadow-md hover:border-red-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-3 bg-red-50 rounded-2xl border border-red-100 group-hover:scale-110 transition">
                      {cat.icon}
                    </div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider bg-gray-100 px-2.5 py-1 rounded-full">
                      {cat.count} FAQs
                    </span>
                  </div>

                  <h3 className="font-heading font-black text-base text-gray-900 group-hover:text-[#C12223] transition">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium mt-1 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#C12223]">
                  <span>{isSelected ? 'Viewing Category' : 'View Solutions'}</span>
                  <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'rotate-90' : 'group-hover:translate-x-1'}`} />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. MAIN FAQ ACCORDION SECTION */}
      <section className="py-10 max-w-[1320px] mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-red-100 shadow-xl space-y-6">
          
          {/* Header & Filter Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-5">
            <div>
              <h3 className="font-heading font-black text-xl text-gray-900">
                Frequently Asked Questions ({filteredFaqs.length})
              </h3>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                Showing answers for: <strong className="text-[#C12223]">{activeCategory}</strong>
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              <button
                onClick={() => setActiveCategory('All')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  activeCategory === 'All'
                    ? 'bg-[#C12223] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All Categories
              </button>
              {helpCategories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveCategory(c.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    activeCategory === c.id
                      ? 'bg-[#C12223] text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Accordion List */}
          {filteredFaqs.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <HelpCircle className="w-12 h-12 text-red-300 mx-auto" />
              <h4 className="font-heading font-black text-base text-gray-900">No matching questions found</h4>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                Try searching with different keywords or submit a direct ticket to our student support team.
              </p>
              <button
                onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
                className="px-4 py-2 bg-[#C12223] text-white text-xs font-bold rounded-xl hover:opacity-90 transition cursor-pointer"
              >
                Clear Search Filters
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFaqs.map((faq) => {
                const isOpen = openFaqId === faq.id;
                const feedback = feedbackGiven[faq.id];

                return (
                  <div
                    key={faq.id}
                    className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                      isOpen
                        ? 'bg-red-50/50 border-red-300 shadow-md'
                        : 'bg-white border-gray-100 hover:border-red-200'
                    }`}
                  >
                    <button
                      onClick={() => setOpenFaqId(isOpen ? '' : faq.id)}
                      className="w-full p-5 text-left flex items-start justify-between gap-4 cursor-pointer"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 bg-red-100 text-[#C12223] text-[10px] font-black rounded-full uppercase">
                            {faq.category}
                          </span>
                          {faq.popular && (
                            <span className="px-2.5 py-0.5 bg-amber-100 text-red-950 text-[10px] font-black rounded-full uppercase border border-amber-300">
                              ★ Popular
                            </span>
                          )}
                        </div>
                        <h4 className="font-heading font-extrabold text-sm sm:text-base text-gray-900 hover:text-[#C12223] transition">
                          {faq.question}
                        </h4>
                      </div>

                      <div className={`p-2 rounded-xl text-[#C12223] transition-transform ${isOpen ? 'rotate-180 bg-red-100' : 'bg-gray-100'}`}>
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="px-5 pb-5 text-xs sm:text-sm text-gray-700 leading-relaxed border-t border-red-100/60 pt-4 space-y-4"
                        >
                          <div className="whitespace-pre-line font-medium text-gray-700">
                            {faq.answer}
                          </div>

                          {/* Interactive Helpful & Share bar */}
                          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-red-100/60 text-xs">
                            <div className="flex items-center gap-2 text-gray-500 font-semibold">
                              <span>Was this helpful?</span>
                              <button
                                onClick={() => handleFeedback(faq.id, 'up')}
                                className={`px-2.5 py-1 rounded-lg border transition flex items-center gap-1 cursor-pointer ${
                                  feedback === 'up'
                                    ? 'bg-emerald-100 border-emerald-300 text-emerald-800 font-bold'
                                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}
                              >
                                <ThumbsUp className="w-3.5 h-3.5" />
                                <span>{faq.helpfulCount + (feedback === 'up' ? 1 : 0)}</span>
                              </button>
                              <button
                                onClick={() => handleFeedback(faq.id, 'down')}
                                className={`px-2.5 py-1 rounded-lg border transition flex items-center gap-1 cursor-pointer ${
                                  feedback === 'down'
                                    ? 'bg-red-100 border-red-300 text-red-800 font-bold'
                                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}
                              >
                                <ThumbsDown className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <button
                              onClick={() => handleCopyAnswer(faq)}
                              className="px-3 py-1 bg-white border border-gray-200 hover:border-[#C12223] text-gray-700 font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer text-xs"
                            >
                              {copiedFaqId === faq.id ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  <span className="text-emerald-600">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5 text-gray-400" />
                                  <span>Copy Solution</span>
                                </>
                              )}
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </section>

      {/* 5. DIRECT HOTLINE & ESCALATION CONTACT CARDS */}
      <section className="py-10 max-w-[1320px] mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-[#8C1316] via-[#A6181B] to-[#C12223] text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-red-400/30">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="bg-amber-400 text-red-950 font-black text-[11px] px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-2">
                DIRECT STUDENT DESK
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-black text-white">
                Still Need Assistance? We're Here For You.
              </h2>
            </div>
            <p className="text-xs text-red-100 font-medium max-w-md">
              Speak directly to our senior student counselors or visit our physical academy centers across India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-white text-gray-900 p-6 rounded-2xl border border-amber-300 shadow-md space-y-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-[#C12223] flex items-center justify-center">
                <Headphones className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-black text-base text-gray-900">Student Helpline Desk</h3>
              <p className="text-xs text-gray-500 font-medium">Instant guidance for batch schedules, admissions & test access.</p>
              <div className="text-lg font-black text-[#C12223] font-mono">+91 9117 34 34 34</div>
              <a
                href="tel:919117343434"
                className="w-full py-2.5 bg-[#C12223] hover:bg-[#A6181B] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Call Helpline Now</span>
              </a>
            </div>

            <div className="bg-white text-gray-900 p-6 rounded-2xl border border-amber-300 shadow-md space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-black text-base text-gray-900">WhatsApp Helpdesk</h3>
              <p className="text-xs text-gray-500 font-medium">Get PDF syllabus, fee receipts & order tracking on WhatsApp.</p>
              <div className="text-lg font-black text-emerald-700 font-mono">+91 9117 35 35 35</div>
              <a
                href="https://wa.me/919117353535?text=Hi%20Gyanm%20Helpdesk,%20I%20need%20assistance%20with%20my%20account."
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>

            <div className="bg-white text-gray-900 p-6 rounded-2xl border border-amber-300 shadow-md space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-black text-base text-gray-900">Email & Grievance Cell</h3>
              <p className="text-xs text-gray-500 font-medium">For official course invoices, corporate inquiries & escalations.</p>
              <div className="text-xs font-black text-gray-800 font-mono">support@gyanam.co.in</div>
              <a
                href="mailto:support@gyanam.co.in"
                className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>Send Support Mail</span>
              </a>
            </div>

          </div>

        </div>
      </section>

      {/* QUICK ACTION POPUP MODAL */}
      <AnimatePresence>
        {activeQuickAction && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-red-100 relative space-y-4"
            >
              <button
                onClick={() => setActiveQuickAction(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 font-bold w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
              >
                ✕
              </button>

              <h3 className="font-heading font-black text-lg text-gray-900">
                {activeQuickAction === 'order' && 'Track Book Order Status'}
                {activeQuickAction === 'reset' && 'Reset GYANM App Password'}
                {activeQuickAction === 'receipt' && 'Download Fee Receipt'}
              </h3>

              <form onSubmit={handleQuickActionSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {activeQuickAction === 'order' && 'Enter Order ID or Mobile Number:'}
                    {activeQuickAction === 'reset' && 'Enter Registered Mobile Number:'}
                    {activeQuickAction === 'receipt' && 'Enter Registered Mobile or Roll No:'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 9876543210 or GYN-94821"
                    value={quickActionInput}
                    onChange={(e) => setQuickActionInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 focus:outline-none focus:border-[#C12223]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#C12223] hover:bg-[#A6181B] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition cursor-pointer"
                >
                  Submit Query
                </button>
              </form>

              {quickActionResult && (
                <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl text-xs text-emerald-800 font-bold leading-relaxed">
                  ✓ {quickActionResult}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SUBMIT SUPPORT TICKET MODAL */}
      <AnimatePresence>
        {isTicketModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-red-100 relative space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsTicketModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 font-bold w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
              >
                ✕
              </button>

              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-[#C12223]" />
                <h3 className="font-heading font-black text-xl text-gray-900">
                  Submit Support Ticket
                </h3>
              </div>

              {generatedTicketRef ? (
                <div className="bg-red-50 border border-red-200 p-6 rounded-2xl text-center space-y-3 animate-fade-in">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="font-heading font-black text-lg text-gray-900">
                    Ticket Created Successfully!
                  </h4>
                  <div className="text-2xl font-black text-[#C12223] font-mono">
                    {generatedTicketRef}
                  </div>
                  <p className="text-xs text-gray-600 font-medium leading-relaxed">
                    Our student support executive will review your ticket and reach out via call / WhatsApp within <strong>2 to 4 hours</strong>.
                  </p>
                  <a
                    href={`https://wa.me/919117353535?text=Hi%20Gyanm%20Team,%20I%20created%20support%20ticket%20${generatedTicketRef}.%20Please%20check.`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase rounded-xl transition shadow-md"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Track Ticket on WhatsApp</span>
                  </a>
                </div>
              ) : (
                <form onSubmit={handleTicketSubmit} className="space-y-3.5 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Student Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Full Name"
                        value={ticketForm.studentName}
                        onChange={(e) => setTicketForm({ ...ticketForm, studentName: e.target.value })}
                        className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-800 focus:outline-none focus:border-[#C12223]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Registered Phone *</label>
                      <input
                        type="tel"
                        required
                        placeholder="10-digit mobile"
                        value={ticketForm.phone}
                        onChange={(e) => setTicketForm({ ...ticketForm, phone: e.target.value })}
                        className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-800 focus:outline-none focus:border-[#C12223]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Query Category *</label>
                      <select
                        value={ticketForm.category}
                        onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                        className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-800 focus:outline-none focus:border-[#C12223]"
                      >
                        <option value="Course Access & Video Player">Course Access & Video Player</option>
                        <option value="Mock Test & TCS Engine">Mock Test & TCS Engine</option>
                        <option value="Printed Books & Delivery">Printed Books & Delivery</option>
                        <option value="Payment & Fee Receipt">Payment & Fee Receipt</option>
                        <option value="Offline Center Query">Offline Center Query</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Urgency Level</label>
                      <select
                        value={ticketForm.urgency}
                        onChange={(e) => setTicketForm({ ...ticketForm, urgency: e.target.value })}
                        className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-800 focus:outline-none focus:border-[#C12223]"
                      >
                        <option value="Normal">Normal (Response in 4 hrs)</option>
                        <option value="High">High (Exam Coming Up!)</option>
                        <option value="Urgent">Urgent (Payment Deducted)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Issue Description *</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Describe your query in detail..."
                      value={ticketForm.description}
                      onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                      className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-800 focus:outline-none focus:border-[#C12223]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={ticketSubmitting}
                    className="w-full py-3 bg-[#C12223] hover:bg-[#A6181B] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition cursor-pointer"
                  >
                    {ticketSubmitting ? 'Generating Ticket Reference...' : 'Submit Support Ticket'}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
