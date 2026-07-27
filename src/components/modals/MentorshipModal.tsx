import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Clock, User, Phone, BookOpen, CheckCircle, Sparkles } from 'lucide-react';

interface MentorshipModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MentorshipModal: React.FC<MentorshipModalProps> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    exam: 'SSC CGL',
    preferredTime: 'Morning (10 AM - 1 PM)',
    city: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#F3DCDD] overflow-hidden z-10"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-[#888888] hover:text-[#1F1A1C] rounded-full transition z-20 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="p-6 bg-gradient-to-br from-[#1A0506] to-[#3B0A0C] text-white relative">
            <span className="px-3 py-1 bg-[#C12223] text-white text-[10px] font-extrabold uppercase rounded-full inline-block mb-2">
              1-on-1 Free Mentorship
            </span>
            <h3 className="font-heading font-extrabold text-2xl text-white">
              Book Your Free Govt Exam Counseling Call
            </h3>
            <p className="text-white/70 text-xs mt-1">
              Talk directly with an ex-officer or top ranker to design your 2026 preparation roadmap.
            </p>
          </div>

          <div className="p-6">
            {submitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-16 h-16 bg-[#27AE60]/10 rounded-full flex items-center justify-center mx-auto text-[#27AE60]">
                  <CheckCircle className="w-10 h-10 animate-bounce" />
                </div>
                <h4 className="font-heading font-bold text-xl text-[#1F1A1C]">
                  Mentorship Slot Reserved!
                </h4>
                <p className="text-xs text-[#555555] max-w-xs mx-auto">
                  Our Senior Mentor will call you on <strong className="text-[#1F1A1C]">{formData.phone}</strong> during your requested slot.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#555555] uppercase tracking-wider mb-1">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold focus:outline-none focus:border-[#C12223]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#555555] uppercase tracking-wider mb-1">
                    Phone Number (WhatsApp)
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Enter 10 digit phone number"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold focus:outline-none focus:border-[#C12223]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#555555] uppercase tracking-wider mb-1">
                      Target Exam
                    </label>
                    <select
                      value={formData.exam}
                      onChange={e => setFormData({ ...formData, exam: e.target.value })}
                      className="w-full px-3 py-2.5 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-xs font-semibold"
                    >
                      <option>SSC CGL / CHSL</option>
                      <option>IBPS / SBI PO</option>
                      <option>Assam ADRE 3.0</option>
                      <option>RRB NTPC</option>
                      <option>UPSC CSE</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#555555] uppercase tracking-wider mb-1">
                      Call Slot
                    </label>
                    <select
                      value={formData.preferredTime}
                      onChange={e => setFormData({ ...formData, preferredTime: e.target.value })}
                      className="w-full px-3 py-2.5 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-xs font-semibold"
                    >
                      <option>Morning (10 AM - 1 PM)</option>
                      <option>Afternoon (2 PM - 5 PM)</option>
                      <option>Evening (6 PM - 9 PM)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#555555] uppercase tracking-wider mb-1">
                    State / City
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Guwahati / Chandigarh / Delhi"
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold focus:outline-none focus:border-[#C12223]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-[#C12223] to-[#8C1316] text-white font-bold rounded-xl text-sm shadow-lg shadow-[#C12223]/25 hover:scale-[1.02] active:scale-[0.98] transition mt-2 cursor-pointer"
                >
                  Confirm Free Session
                </button>

                <p className="text-[11px] text-[#888888] text-center">
                  🔒 100% Free & Confidential. Zero Spam Guarantee.
                </p>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
