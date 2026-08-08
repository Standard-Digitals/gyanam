'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Phone, Lock, ArrowRight, ShieldCheck, CheckCircle2, Sparkles } from 'lucide-react';
import { GyanamLogo } from '../GyanamLogo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [step, setStep] = useState<'phone' | 'otp' | 'success'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [targetExam, setTargetExam] = useState('SSC CGL');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [devOtp, setDevOtp] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10) return;
    setError(null);
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, purpose: mode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send OTP');
      setDevOtp(data.devOtp ?? null);
      setStep('otp');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          otp: otp.join(''),
          purpose: mode,
          ...(mode === 'signup' ? { targetExam } : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid OTP');
      setStep('success');
      setTimeout(() => {
        onClose();
        setStep('phone');
        setOtp(['', '', '', '']);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
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
          className="fixed inset-0 bg-[#450A0A]/70 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#F3DCDD] overflow-hidden z-10"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-[#888888] hover:text-[#1F1A1C] hover:bg-[#FFF5F5] rounded-full transition z-20 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Banner */}
          <div className="bg-gradient-to-r from-[#EF4444] to-[#B91C1C] p-6 text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-3xl" />
            <div className="relative z-10">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-3 border border-white/30 p-1">
                <GyanamLogo className="w-full h-full" />
              </div>
              <h3 className="font-heading font-extrabold text-2xl text-white">
                {mode === 'login' ? 'Welcome Back to Gyanam' : 'Start Your Prep Journey'}
              </h3>
              <p className="text-white/80 text-xs mt-1">
                Access Live Classes, TCS Mock Tests & Personalized Analytics
              </p>
            </div>
          </div>

          <div className="p-6">
            {step === 'phone' && (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#555555] uppercase tracking-wider mb-2">
                    Mobile Number
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-sm font-semibold text-[#555555] border-r border-[#F3DCDD] pr-2">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="Enter 10 digit phone number"
                      maxLength={10}
                      className="w-full pl-16 pr-4 py-3 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold text-[#1F1A1C] focus:outline-none focus:border-[#C12223] focus:ring-2 focus:ring-[#C12223]/20 transition"
                    />
                  </div>
                </div>

                {mode === 'signup' && (
                  <div>
                    <label className="block text-xs font-bold text-[#555555] uppercase tracking-wider mb-2">
                      Target Exam Category
                    </label>
                    <select
                      value={targetExam}
                      onChange={e => setTargetExam(e.target.value)}
                      className="w-full px-4 py-3 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold text-[#1F1A1C] focus:outline-none focus:border-[#C12223] focus:ring-2 focus:ring-[#C12223]/20"
                    >
                      <option>SSC CGL / CHSL / MTS</option>
                      <option>IBPS / SBI Bank PO & Clerk</option>
                      <option>Assam ADRE 3.0 / APDCL</option>
                      <option>RRB Railway NTPC / Group D</option>
                      <option>UPSC CSE / State PSC</option>
                      <option>Defence CDS / AFCAT</option>
                    </select>
                  </div>
                )}

                {error && (
                  <p className="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={phone.length !== 10 || isSubmitting}
                  className="w-full py-3.5 bg-gradient-to-r from-[#EF4444] to-[#B91C1C] text-white font-bold rounded-xl text-sm shadow-lg shadow-[#C12223]/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? 'Sending OTP...' : (<>Send OTP <ArrowRight className="w-4 h-4" /></>)}
                </button>

                <div className="text-center pt-2">
                  {mode === 'login' ? (
                    <p className="text-xs text-[#555555]">
                      Don't have an account?{' '}
                      <button
                        type="button"
                        onClick={() => setMode('signup')}
                        className="font-bold text-[#C12223] hover:underline cursor-pointer"
                      >
                        Create Account
                      </button>
                    </p>
                  ) : (
                    <p className="text-xs text-[#555555]">
                      Already registered?{' '}
                      <button
                        type="button"
                        onClick={() => setMode('login')}
                        className="font-bold text-[#C12223] hover:underline cursor-pointer"
                      >
                        Log In
                      </button>
                    </p>
                  )}
                </div>
              </form>
            )}

            {step === 'otp' && (
              <form onSubmit={handleVerifyOtp} className="space-y-5 text-center">
                <div>
                  <h4 className="font-bold text-base text-[#1F1A1C]">Verify Security OTP</h4>
                  <p className="text-xs text-[#555555] mt-1">
                    Sent 4-digit OTP to <span className="font-bold text-[#1F1A1C]">+91 {phone}</span>
                  </p>
                  {devOtp && (
                    <p className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 mt-2 inline-block">
                      DEV MODE — OTP: {devOtp}
                    </p>
                  )}
                </div>

                <div className="flex justify-center gap-3 my-4">
                  {[0, 1, 2, 3].map(idx => (
                    <input
                      key={idx}
                      type="text"
                      maxLength={1}
                      value={otp[idx]}
                      onChange={e => {
                        const val = e.target.value;
                        const newOtp = [...otp];
                        newOtp[idx] = val;
                        setOtp(newOtp);
                      }}
                      className="w-12 h-14 text-center font-bold text-xl bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl focus:outline-none focus:border-[#C12223] focus:ring-2 focus:ring-[#C12223]/20"
                    />
                  ))}
                </div>

                {error && (
                  <p className="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || otp.some(d => !d)}
                  className="w-full py-3.5 bg-gradient-to-r from-[#EF4444] to-[#B91C1C] text-white font-bold rounded-xl text-sm shadow-lg shadow-[#C12223]/25 hover:scale-[1.02] transition cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Verifying...' : 'Verify & Continue'}
                </button>

                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="text-xs text-[#555555] hover:text-[#1F1A1C] underline cursor-pointer"
                >
                  Change Mobile Number
                </button>
              </form>
            )}

            {step === 'success' && (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-16 h-16 text-[#27AE60] mx-auto animate-bounce" />
                <h4 className="font-heading font-extrabold text-xl text-[#1F1A1C]">
                  Authentication Successful!
                </h4>
                <p className="text-xs text-[#555555]">
                  Redirecting to your Gyanam Student Learning Dashboard...
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
