'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const TARGET_EXAMS = [
  'SSC CGL / CHSL / MTS',
  'IBPS / SBI Bank PO & Clerk',
  'Assam ADRE 3.0 / APDCL',
  'RRB Railway NTPC / Group D',
  'UPSC CSE / State PSC',
  'Defence CDS / AFCAT',
];

export default function ProfileForm({ name, phone, targetExam }: { name: string | null; phone: string; targetExam: string | null }) {
  const router = useRouter();
  const [formName, setFormName] = useState(name ?? '');
  const [formTargetExam, setFormTargetExam] = useState(targetExam ?? TARGET_EXAMS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSave = async () => {
    setIsSubmitting(true);
    setMessage(null);
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formName, targetExam: formTargetExam }),
      });
      if (!res.ok) throw new Error('Failed to update profile');
      setMessage('Profile updated!');
      router.refresh();
    } catch {
      setMessage('Something went wrong. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F3DCDD] shadow-sm space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-[#555555] uppercase tracking-wider mb-1.5">Full Name</label>
          <input
            type="text"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-3.5 py-2.5 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold outline-none focus:border-[#C12223] transition"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#555555] uppercase tracking-wider mb-1.5">Mobile Number</label>
          <input type="text" value={`+91 ${phone}`} disabled className="w-full px-3.5 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm font-semibold text-gray-500" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-bold text-[#555555] uppercase tracking-wider mb-1.5">Target Exam</label>
        <select
          value={formTargetExam}
          onChange={(e) => setFormTargetExam(e.target.value)}
          className="w-full px-3.5 py-2.5 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold outline-none focus:border-[#C12223] transition"
        >
          {TARGET_EXAMS.map((exam) => (
            <option key={exam} value={exam}>{exam}</option>
          ))}
        </select>
      </div>
      {message && <p className="text-xs font-semibold text-[#27AE60]">{message}</p>}
      <button
        onClick={handleSave}
        disabled={isSubmitting}
        className="px-5 py-2.5 bg-[#C12223] text-white font-bold text-xs rounded-xl disabled:opacity-50 cursor-pointer hover:bg-[#A81C1D] transition"
      >
        {isSubmitting ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
}
