'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import { 
  Phone, Mail, MapPin, Clock, Send, MessageSquare, 
  CheckCircle2, Building2, HelpCircle, ChevronRight, 
  Sparkles, Headphones, ShieldCheck, Globe, ExternalLink,
  BookOpen, User, PhoneCall, AlertCircle, X, ArrowRight
} from 'lucide-react';


export default function ContactPage() {
  const router = useRouter();

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    targetExam: 'SSC CGL / CHSL',
    preferredMode: 'Offline Academy Batch',
    nearestCenter: 'Chandigarh (Sector 34)',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [selectedBranchTab, setSelectedBranchTab] = useState<string>('chandigarh');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || formData.phone.length !== 10) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          targetExam: formData.targetExam,
          mode: formData.preferredMode,
          center: formData.nearestCenter,
          message: formData.message,
          source: 'CONTACT_FORM',
        }),
      });
      const data = await res.json();
      setSubmittedRef(data.refId || 'GYN-000000');
      setFormData({
        fullName: '',
        phone: '',
        email: '',
        targetExam: 'SSC CGL / CHSL',
        preferredMode: 'Offline Academy Batch',
        nearestCenter: 'Chandigarh (Sector 34)',
        message: ''
      });
    } catch (err) {
      console.error('Failed to submit lead', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: <PhoneCall className="w-6 h-6 text-[#C12223]" />,
      title: "Student Helpline Desk",
      desc: "Instant guidance for admissions & batch timings",
      value: "+91 9117 34 34 34",
      actionText: "Call Now",
      actionHref: "tel:919117343434"
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-emerald-600" />,
      title: "Official WhatsApp Desk",
      desc: "Get instant PDF syllabus, fee structure & notes on WhatsApp",
      value: "+91 9117 35 35 35",
      actionText: "Chat on WhatsApp",
      actionHref: "https://wa.me/919117353535?text=Hi%20Gyanam%20Team,%20I%20want%20information%20about%20upcoming%20batches."
    },
    {
      icon: <Mail className="w-6 h-6 text-[#C12223]" />,
      title: "Email Support",
      desc: "For online course access, order tracking & inquiries",
      value: "support@gyanam.co.in",
      actionText: "Send Mail",
      actionHref: "mailto:support@gyanam.co.in"
    },
    {
      icon: <Clock className="w-6 h-6 text-[#C12223]" />,
      title: "Academy Working Hours",
      desc: "Offline Doubt Desks & Counseling Counters",
      value: "Mon - Sat: 7:00 AM - 8:00 PM",
      actionText: "Visit Nearest Center",
      actionHref: "#centers"
    }
  ];

  const centersData = [
    {
      id: "chandigarh",
      city: "Chandigarh (Head Office)",
      address: "SCO 13-14-15, Sector 34-A, Near Sub City Centre, Chandigarh - 160022",
      phone: "+91 9117 34 34 34",
      email: "chandigarh@gyanam.co.in",
      timing: "7:00 AM - 8:00 PM (Monday to Saturday)",
      mapsUrl: "https://maps.google.com/?q=Sector+34A+Chandigarh",
      facilities: ["CBT Computer Lab (120 Nodes)", "Library & Reading Room", "Publication & Bookstore", "1-on-1 Officer Doubt Counters"]
    },
    {
      id: "guwahati",
      city: "Guwahati (North-East Hub)",
      address: "GS Road, Near Christian Basti Flyover, Opp. ABC Bus Stop, Guwahati, Assam - 781005",
      phone: "+91 9117 35 35 35",
      email: "guwahati@gyanam.co.in",
      timing: "8:00 AM - 7:00 PM (Monday to Saturday)",
      mapsUrl: "https://maps.google.com/?q=Christian+Basti+Guwahati",
      facilities: ["Assam ADRE & APSC Wing", "Assamese Language Material Desk", "Speed Test Center"]
    },
    {
      id: "delhi",
      city: "New Delhi Center",
      address: "2nd Floor, Kingsway Camp, Near GTB Nagar Metro Station Gate No. 1, New Delhi - 110009",
      phone: "+91 9117 36 36 36",
      email: "delhi@gyanam.co.in",
      timing: "7:30 AM - 8:30 PM (Daily)",
      mapsUrl: "https://maps.google.com/?q=Kingsway+Camp+GTB+Nagar+Delhi",
      facilities: ["SSC CGL Special Speed Test Wing", "Civil Services Discussion Rooms", "Live Studio"]
    },
    {
      id: "patiala",
      city: "Patiala Academy",
      address: "Leela Bhawan Chowk, Above State Bank of India, Patiala, Punjab - 147001",
      phone: "+91 9117 37 37 37",
      email: "patiala@gyanam.co.in",
      timing: "8:00 AM - 7:00 PM (Monday to Saturday)",
      mapsUrl: "https://maps.google.com/?q=Leela+Bhawan+Patiala",
      facilities: ["Punjab State Exams Cell", "Physical Library", "Weekly Mock Test Center"]
    },
    {
      id: "bathinda",
      city: "Bathinda Branch",
      address: "100 Feet Road, Near Gope Cinema, Bathinda, Punjab - 151001",
      phone: "+91 9117 38 38 38",
      email: "bathinda@gyanam.co.in",
      timing: "8:00 AM - 7:00 PM (Mon-Sat)",
      mapsUrl: "https://maps.google.com/?q=100+Feet+Road+Bathinda",
      facilities: ["Bank PO Special Batch", "Physical Books Counter", "Doubt Desk"]
    }
  ];

  const contactFaqs = [
    {
      q: "How can I book a free demo class at a physical GYANaM center?",
      a: "You can fill out the inquiry form on this page or call our student helpline at +91 9117 34 34 34. Our academic counselors will schedule your free 2-day demo class at your preferred center."
    },
    {
      q: "What should I do if I am facing issues with my online course or book order?",
      a: "For instant support, WhatsApp your Order ID or Registered Mobile Number to +91 9117 35 35 35 or email support@gyanam.co.in. Our technical team resolves all course access queries within 2 hours."
    },
    {
      q: "Are study materials available for delivery across India?",
      a: "Yes! We ship hardcover books and test series modules to all PIN codes in India via SpeedPost and express couriers. Delivery usually takes 2-4 working days."
    },
    {
      q: "Do you offer offline hostel or PG assistance for outstation students?",
      a: "Yes. All our major hubs (Chandigarh, Delhi, Guwahati, Patiala) have dedicated student helpdesks that assist in finding safe, verified PG accommodations within walking distance of the academy."
    }
  ];

  return (
    <div className="min-h-screen bg-[#FFF5F5] text-[#1F1A1C] pb-16">
      
      {/* 1. HERO HEADER */}
      <section className="relative bg-gradient-to-br from-[#8C1316] via-[#A6181B] to-[#6E0E10] text-white pt-12 pb-20 overflow-hidden border-b border-red-500/20">
        <div className="absolute inset-0 bg-[radial-gradient(#EF4444_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
        
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 relative z-10">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-semibold text-red-200 mb-6">
            <button onClick={() => router.push('/')} className="hover:text-white transition cursor-pointer">Home</button>
            <ChevronRight className="w-3.5 h-3.5 text-red-300" />
            <span className="text-white font-bold">Contact Us</span>
          </div>

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-300/30 text-amber-200 px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider backdrop-blur-sm">
              <Headphones className="w-4 h-4 text-amber-300" />
              <span>Dedicated Student Support & Admissions Desk</span>
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
              We are Here to Guide Your <span className="text-amber-300">Government Exam Career.</span>
            </h1>

            <p className="text-red-100/90 text-sm sm:text-base leading-relaxed font-medium">
              Have questions about batch timings, fee structures, book deliveries, or online test series? Reach out to our academic advisors or visit your nearest GYANaM branch.
            </p>
          </div>

        </div>
      </section>

      {/* 2. DIRECT CONTACT CARDS */}
      <section className="max-w-[1320px] mx-auto px-4 sm:px-6 -mt-10 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {contactMethods.map((m, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-5 rounded-2xl border border-red-100 shadow-md hover:shadow-xl transition duration-300 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#FFF5F5] border border-red-200 flex items-center justify-center group-hover:scale-110 transition duration-300">
                  {m.icon}
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-sm text-[#1F1A1C]">{m.title}</h3>
                  <p className="text-[11px] text-gray-500 font-medium mt-0.5">{m.desc}</p>
                </div>
                <div className="text-xs font-black text-[#8C1316] tracking-tight">{m.value}</div>
              </div>

              <a
                href={m.actionHref}
                target={m.actionHref.startsWith('http') ? '_blank' : '_self'}
                rel="noreferrer"
                className="w-full py-2.5 bg-gray-50 hover:bg-[#FFF5F5] text-[#C12223] font-black text-xs rounded-xl border border-gray-200 hover:border-[#C12223]/30 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>{m.actionText}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. MAIN FORM & QUICK INFO SECTION */}
      <section className="py-16 max-w-[1320px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left: Interactive Request Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-3xl border border-red-100 shadow-xl space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <span className="text-[#C12223] font-black text-xs uppercase tracking-widest block">
                DIRECT ACADEMIC INQUIRY FORM
              </span>
              <h2 className="font-heading text-2xl font-black text-[#1F1A1C] mt-1">
                Request a Callback or Demo Session
              </h2>
              <p className="text-xs text-gray-500 font-medium mt-1">
                Fill in your details below and our senior mentor will call you within 15 minutes.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-gray-700 block">
                    Full Name <span className="text-[#C12223]">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 text-xs font-bold border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C12223] focus:bg-white"
                    />
                  </div>
                </div>

                {/* Mobile Number */}
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-gray-700 block">
                    10-Digit Mobile Number <span className="text-[#C12223]">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="e.g. 9876543210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 text-xs font-bold border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C12223] focus:bg-white"
                    />
                  </div>
                </div>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-gray-700 block">
                    Email Address (Optional)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      placeholder="e.g. rahul@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 text-xs font-bold border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C12223] focus:bg-white"
                    />
                  </div>
                </div>

                {/* Target Exam */}
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-gray-700 block">
                    Target Exam Preparation
                  </label>
                  <select
                    value={formData.targetExam}
                    onChange={(e) => setFormData({ ...formData, targetExam: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 text-xs font-bold border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C12223] focus:bg-white"
                  >
                    <option value="SSC CGL / CHSL">SSC CGL / CHSL / CPO</option>
                    <option value="Bank PO / Clerk">IBPS / SBI / RBI Bank Exams</option>
                    <option value="Assam ADRE / APSC">Assam ADRE & State Exams</option>
                    <option value="Punjab State Exams">Punjab PSSSB / Patwari / Police</option>
                    <option value="Defense & CDS">Defense (CDS / NDA / AFCAT)</option>
                    <option value="Books & Test Series">Printed Books & Test Series Query</option>
                  </select>
                </div>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Preferred Learning Mode */}
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-gray-700 block">
                    Preferred Learning Mode
                  </label>
                  <select
                    value={formData.preferredMode}
                    onChange={(e) => setFormData({ ...formData, preferredMode: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 text-xs font-bold border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C12223] focus:bg-white"
                  >
                    <option value="Offline Academy Batch">Offline Classroom Coaching</option>
                    <option value="Live App Online Class">Live Interactive Online App</option>
                    <option value="Self Study Books & Mocks">Self-Study Books & Test Series</option>
                    <option value="1-on-1 Mentorship">1-on-1 Personal Mentorship</option>
                  </select>
                </div>

                {/* Preferred Center */}
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-gray-700 block">
                    Nearest Academy Hub
                  </label>
                  <select
                    value={formData.nearestCenter}
                    onChange={(e) => setFormData({ ...formData, nearestCenter: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 text-xs font-bold border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C12223] focus:bg-white"
                  >
                    <option value="Chandigarh (Sector 34)">Chandigarh HQ (Sector 34-A)</option>
                    <option value="Guwahati (GS Road)">Guwahati Hub (Assam)</option>
                    <option value="Delhi (GTB Nagar)">New Delhi (GTB Nagar)</option>
                    <option value="Patiala (Leela Bhawan)">Patiala Academy (Punjab)</option>
                    <option value="Bathinda (100 Ft Road)">Bathinda Branch (Punjab)</option>
                    <option value="Online / Distance Learning">Online / Anywhere in India</option>
                  </select>
                </div>

              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-gray-700 block">
                  Specific Query or Request
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell us about your preparation goals, doubts, or desired batch timing..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full p-4 bg-gray-50 text-xs font-bold border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C12223] focus:bg-white"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#C12223] hover:bg-[#A6181B] text-white font-black text-sm rounded-2xl shadow-xl transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Submitting Inquiry...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-amber-300" />
                    <span>Submit Request for Callback</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-gray-400 font-medium text-center">
                🔒 Your contact details are kept strictly confidential under GYANAM Privacy Guarantee.
              </p>
            </form>
          </div>

          {/* Right: Quick Direct Info & Trust Cards */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Direct WhatsApp Callout Banner */}
            <div className="bg-gradient-to-br from-emerald-800 via-emerald-900 to-emerald-950 p-6 rounded-3xl text-white shadow-xl space-y-4 border border-emerald-500/30">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0">
                  <MessageSquare className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <span className="px-2 py-0.5 bg-emerald-400 text-emerald-950 font-black text-[10px] uppercase rounded">
                    FASTEST RESPONSE
                  </span>
                  <h3 className="font-heading font-black text-lg text-white mt-0.5">
                    Need Instant PDF Notes on WhatsApp?
                  </h3>
                </div>
              </div>

              <p className="text-xs text-emerald-100/90 leading-relaxed font-medium">
                Connect directly with our WhatsApp assistant to get daily current affairs PDFs, exam syllabus blueprints, and batch discount vouchers immediately.
              </p>

              <a
                href="https://wa.me/919117353535?text=Hi%20Gyanam%20Team,%20I%20want%20information%20about%20upcoming%20batches."
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat Now on WhatsApp (+91 9117 35 35 35)</span>
              </a>
            </div>

            {/* HQ Office Quick Card */}
            <div className="bg-white p-6 rounded-3xl border border-red-100 shadow-md space-y-4">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                <Building2 className="w-6 h-6 text-[#C12223]" />
                <div>
                  <h3 className="font-heading font-extrabold text-sm text-[#1F1A1C]">GYANAM National Head Office</h3>
                  <p className="text-[11px] text-gray-500 font-medium">Chandigarh Educational Hub</p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-gray-700 font-medium">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#C12223] shrink-0 mt-0.5" />
                  <span>SCO 13-14-15, Sector 34-A, Near Sub City Centre, Chandigarh - 160022</span>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#C12223] shrink-0" />
                  <a href="tel:919117343434" className="hover:text-[#C12223] font-bold">+91 9117 34 34 34</a>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#C12223] shrink-0" />
                  <span>support@gyanam.co.in</span>
                </div>
              </div>
            </div>

            {/* Guarantees Box */}
            <div className="bg-[#FFF5F5] p-5 rounded-3xl border border-red-200/60 space-y-3">
              <h4 className="font-heading font-extrabold text-xs text-[#1F1A1C] uppercase tracking-wider">
                Why Students Trust Our Helpline:
              </h4>
              <ul className="space-y-2 text-xs text-gray-700 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#27AE60] shrink-0" />
                  <span>100% Experienced Academic Counselors (No Hard Sales)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#27AE60] shrink-0" />
                  <span>Free 2-Day Trial Access to Online Live Batches</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#27AE60] shrink-0" />
                  <span>Transparent Fee Structure & Easy Installment Guidance</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* 4. MULTI-BRANCH CENTERS DIRECTORY */}
      <section id="centers" className="py-16 bg-white border-t border-red-100">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6">
          
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <span className="text-[#C12223] font-black text-xs uppercase tracking-widest bg-[#FFF5F5] px-3 py-1 rounded-full border border-[#C12223]/20">
              ACADEMY BRANCH DIRECTORY
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-black text-[#1F1A1C]">
              Find a GYANAM Center Near You
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm font-medium">
              Walk into any of our centers to speak with senior faculty members and inspect our CBT computer labs.
            </p>
          </div>

          {/* Branch Tabs */}
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-8">
            {centersData.map((center) => (
              <button
                key={center.id}
                onClick={() => setSelectedBranchTab(center.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 border ${
                  selectedBranchTab === center.id
                    ? 'bg-[#8C1316] text-white border-[#8C1316] shadow-md'
                    : 'bg-[#FFF5F5] text-gray-700 border-red-100 hover:border-[#C12223]'
                }`}
              >
                {center.city}
              </button>
            ))}
          </div>

          {/* Selected Branch Detail */}
          <div className="bg-[#FFF5F5] p-6 sm:p-10 rounded-3xl border border-red-200 shadow-xl max-w-4xl mx-auto">
            {(() => {
              const b = centersData.find(c => c.id === selectedBranchTab) || centersData[0];
              return (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                  <div className="md:col-span-7 space-y-5">
                    <div className="space-y-1">
                      <span className="px-2.5 py-0.5 bg-[#C12223] text-white text-[10px] font-black uppercase rounded">
                        OFFLINE CENTER
                      </span>
                      <h3 className="font-heading font-black text-2xl text-[#1F1A1C]">
                        {b.city}
                      </h3>
                    </div>

                    <div className="space-y-3 text-xs text-gray-700 font-medium">
                      <div className="flex items-start gap-3 bg-white p-3.5 rounded-2xl border border-red-100">
                        <MapPin className="w-5 h-5 text-[#C12223] shrink-0 mt-0.5" />
                        <div>
                          <strong className="block text-[#1F1A1C] text-xs">Address:</strong>
                          <span>{b.address}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex items-center gap-2.5 bg-white p-3.5 rounded-2xl border border-red-100">
                          <Phone className="w-4 h-4 text-[#C12223] shrink-0" />
                          <a href={`tel:${b.phone.replace(/\s+/g, '')}`} className="font-bold hover:text-[#C12223]">{b.phone}</a>
                        </div>
                        <div className="flex items-center gap-2.5 bg-white p-3.5 rounded-2xl border border-red-100">
                          <Clock className="w-4 h-4 text-[#C12223] shrink-0" />
                          <span>{b.timing}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-heading font-extrabold text-xs text-[#1F1A1C] uppercase tracking-wider">
                        Branch Highlights:
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {b.facilities.map((fac, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                            <CheckCircle2 className="w-4 h-4 text-[#27AE60]" />
                            <span>{fac}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 flex flex-wrap gap-3">
                      <a
                        href={b.mapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-5 py-3 bg-[#C12223] hover:bg-[#A6181B] text-white font-black text-xs rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
                      >
                        <MapPin className="w-4 h-4 text-amber-300" />
                        <span>Open Location on Google Maps</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  {/* Branch Graphic Box */}
                  <div className="md:col-span-5 bg-white p-6 rounded-2xl border border-red-200 text-center space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#FFF5F5] border border-red-200 flex items-center justify-center mx-auto text-[#C12223]">
                      <Building2 className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="font-heading font-black text-base text-[#1F1A1C]">Visit Without Appointment</h4>
                      <p className="text-xs text-gray-500 font-medium mt-1">
                        Counseling desks are open Monday to Saturday. Free trial materials provided on arrival.
                      </p>
                    </div>
                    <a
                      href={`tel:${b.phone.replace(/\s+/g, '')}`}
                      className="w-full py-3 bg-gray-900 hover:bg-black text-white font-black text-xs rounded-xl transition block"
                    >
                      Call Center Directly ({b.phone})
                    </a>
                  </div>
                </div>
              );
            })()}
          </div>

        </div>
      </section>

      {/* 5. FREQUENTLY ASKED QUESTIONS */}
      <section className="py-16 max-w-[1320px] mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-[#C12223] font-black text-xs uppercase tracking-widest bg-[#FFF5F5] px-3 py-1 rounded-full border border-[#C12223]/20">
            COMMON INQUIRIES
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-black text-[#1F1A1C]">
            Frequently Asked Support Questions
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {contactFaqs.map((faq, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-red-100 shadow-2xs space-y-2">
              <h3 className="font-heading font-extrabold text-sm sm:text-base text-[#1F1A1C] flex items-start gap-2.5">
                <HelpCircle className="w-5 h-5 text-[#C12223] shrink-0 mt-0.5" />
                <span>{faq.q}</span>
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium pl-7">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SUBMISSION CONFIRMATION MODAL */}
      <AnimatePresence>
        {submittedRef && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-emerald-100 text-center space-y-5 relative"
            >
              <button
                onClick={() => setSubmittedRef(null)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-extrabold text-xs rounded-full border border-emerald-200">
                  REF NO: {submittedRef}
                </span>
                <h3 className="font-heading font-black text-xl text-[#1F1A1C]">
                  Callback Request Registered!
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                  Thank you! Our senior academic counselor will call you back within 15 minutes with batch details and demo class access.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setSubmittedRef(null)}
                  className="w-full py-3 bg-[#C12223] text-white font-black text-xs rounded-xl hover:bg-[#A6181B] transition cursor-pointer"
                >
                  Done & Back to Home
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
