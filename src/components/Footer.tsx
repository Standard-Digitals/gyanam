import React from 'react';
import { Phone, Mail, MapPin, Youtube, Instagram, Facebook, Send, ShieldCheck, Heart } from 'lucide-react';
import { GyanamLogo } from './GyanamLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1A0506] text-red-100/80 pt-16 pb-8 border-t border-red-950/60">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6">
        
        {/* Top Footer Row: Brand Info & Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-red-950/60">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <GyanamLogo className="w-12 h-12" />
            </div>

            <p className="text-xs text-red-200/70 leading-relaxed max-w-sm">
              India's premier EdTech platform for SSC, Banking, Railway, UPSC, Assam ADRE & State Government Competitive Exam preparation.
            </p>

            <div className="space-y-2 text-xs text-red-100 pt-2">
              <a href="tel:9117343434" className="flex items-center gap-2 hover:text-[#DC2626] transition font-bold">
                <Phone className="w-4 h-4 text-[#DC2626]" /> Student Helpline: 9117 34 34 34
              </a>
              <a href="mailto:support@Gyanam.in" className="flex items-center gap-2 hover:text-[#DC2626] transition">
                <Mail className="w-4 h-4 text-[#DC2626]" /> Support Email: support@Gyanam.in
              </a>
              <div className="flex items-center gap-2 text-red-200/70">
                <MapPin className="w-4 h-4 text-[#DC2626]" /> HQ: Chandigarh | Guwahati | New Delhi | Assam
              </div>
            </div>
          </div>

          {/* Quick Links 1: Courses */}
          <div>
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider mb-4">
              Exam Batches
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#courses" className="hover:text-[#DC2626] transition">SSC CGL 2026 Batch</a></li>
              <li><a href="#courses" className="hover:text-[#DC2626] transition">IBPS & SBI PO Masterclass</a></li>
              <li><a href="#courses" className="hover:text-[#DC2626] transition">Assam ADRE 3.0 Batch</a></li>
              <li><a href="#courses" className="hover:text-[#DC2626] transition">RRB NTPC & ALP Express</a></li>
              <li><a href="#courses" className="hover:text-[#DC2626] transition">UPSC CSE GS Foundation</a></li>
              <li><a href="#courses" className="hover:text-[#DC2626] transition">Defence CDS & NDA</a></li>
            </ul>
          </div>

          {/* Quick Links 2: Resources */}
          <div>
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider mb-4">
              Free Resources
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#current-affairs" className="hover:text-[#DC2626] transition">Daily Current Affairs</a></li>
              <li><a href="#free-resources" className="hover:text-[#DC2626] transition">Monthly CA Magazine PDF</a></li>
              <li><a href="#mock-tests" className="hover:text-[#DC2626] transition">TCS Pattern Free Mock Test</a></li>
              <li><a href="#free-resources" className="hover:text-[#DC2626] transition">SSC CGL Solved PYQs</a></li>
              <li><a href="#free-resources" className="hover:text-[#DC2626] transition">Assam GK Cheat Sheet</a></li>
              <li><a href="#free-resources" className="hover:text-[#DC2626] transition">Quant Formula Booklet</a></li>
            </ul>
          </div>

          {/* Quick Links 3: Company */}
          <div>
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#why-Gyanam" className="hover:text-[#DC2626] transition">Why Gyanam Tech</a></li>
              <li><a href="#mentors" className="hover:text-[#DC2626] transition">Our Faculty Experts</a></li>
              <li><a href="#success-stories" className="hover:text-[#DC2626] transition">Selection Stories</a></li>
              <li><a href="#blog" className="hover:text-[#DC2626] transition">Exam Notifications</a></li>
              <li><a href="#faq" className="hover:text-[#DC2626] transition">FAQs & Helpdesk</a></li>
              <li><a href="#" className="hover:text-[#DC2626] transition">Privacy Policy & Terms</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-red-200/50">
          <p>© 2026 Gyanam (Government Jobs Made Easy). All Rights Reserved.</p>

          {/* Social Links */}
          <div className="flex items-center gap-4 text-red-200/70">
            <a href="#" className="p-2 bg-[#2D0A0B] rounded-lg hover:text-[#DC2626] transition" title="YouTube"><Youtube className="w-4 h-4" /></a>
            <a href="#" className="p-2 bg-[#2D0A0B] rounded-lg hover:text-[#DC2626] transition" title="Telegram"><Send className="w-4 h-4" /></a>
            <a href="#" className="p-2 bg-[#2D0A0B] rounded-lg hover:text-[#DC2626] transition" title="Instagram"><Instagram className="w-4 h-4" /></a>
            <a href="#" className="p-2 bg-[#2D0A0B] rounded-lg hover:text-[#DC2626] transition" title="Facebook"><Facebook className="w-4 h-4" /></a>
          </div>
        </div>

      </div>
    </footer>
  );
};
