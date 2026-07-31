'use client';
import React from 'react';
import { Phone, Mail, MapPin, Youtube, Instagram, Facebook, Send, ShieldCheck, Heart } from 'lucide-react';
import { GyanamLogo } from '@/components/GyanamLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-[#8C1316] via-[#A6181B] to-[#7F1315] text-red-100/90 pt-16 pb-8 border-t border-red-500/30">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6">
        
        {/* Top Footer Row: Brand Info & Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-red-400/20">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <GyanamLogo className="w-16 h-16" />
            </div>

            <p className="text-xs text-red-100/80 leading-relaxed max-w-sm">
              India's premier EdTech platform for SSC, Banking, Railway, UPSC, Assam ADRE & State Government Competitive Exam preparation.
            </p>

            <div className="space-y-2 text-xs text-red-100 pt-2">
              <a href="tel:9117343434" className="flex items-center gap-2 hover:text-white transition font-bold">
                <Phone className="w-4 h-4 text-red-300" /> Student Helpline: 9117 34 34 34
              </a>
              <a href="mailto:support@Gyanam.in" className="flex items-center gap-2 hover:text-white transition">
                <Mail className="w-4 h-4 text-red-300" /> Support Email: support@Gyanam.in
              </a>
              <div className="flex items-center gap-2 text-red-100/80">
                <MapPin className="w-4 h-4 text-red-300" /> HQ: Chandigarh | Guwahati | New Delhi | Assam
              </div>
            </div>
          </div>

          {/* Quick Links 1: Courses */}
          <div>
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider mb-4">
              Exam Batches
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#courses" className="hover:text-white transition">SSC CGL 2026 Batch</a></li>
              <li><a href="#courses" className="hover:text-white transition">IBPS & SBI PO Masterclass</a></li>
              <li><a href="#courses" className="hover:text-white transition">Assam ADRE 3.0 Batch</a></li>
              <li><a href="#courses" className="hover:text-white transition">RRB NTPC & ALP Express</a></li>
              <li><a href="#courses" className="hover:text-white transition">UPSC CSE GS Foundation</a></li>
              <li><a href="#courses" className="hover:text-white transition">Defence CDS & NDA</a></li>
            </ul>
          </div>

          {/* Quick Links 2: Resources */}
          <div>
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider mb-4">
              Free Resources
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#current-affairs" className="hover:text-white transition">Daily Current Affairs</a></li>
              <li><a href="#free-resources" className="hover:text-white transition">Monthly CA Magazine PDF</a></li>
              <li><a href="#mock-tests" className="hover:text-white transition">TCS Pattern Free Mock Test</a></li>
              <li><a href="#free-resources" className="hover:text-white transition">SSC CGL Solved PYQs</a></li>
              <li><a href="#free-resources" className="hover:text-white transition">Assam GK Cheat Sheet</a></li>
              <li><a href="#free-resources" className="hover:text-white transition">Quant Formula Booklet</a></li>
            </ul>
          </div>

          {/* Quick Links 3: Company */}
          <div>
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#why-Gyanam" className="hover:text-white transition">Why Gyanam Tech</a></li>
              <li><a href="#mentors" className="hover:text-white transition">Our Faculty Experts</a></li>
              <li><a href="#success-stories" className="hover:text-white transition">Selection Stories</a></li>
              <li><a href="#blog" className="hover:text-white transition">Exam Notifications</a></li>
              <li><a href="#faq" className="hover:text-white transition">FAQs & Helpdesk</a></li>
              <li><a href="#" className="hover:text-white transition">Privacy Policy & Terms</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-red-200/70">
          <p>© 2026 Gyanam (Government Jobs Made Easy). All Rights Reserved.</p>

          {/* Social Links */}
          <div className="flex items-center gap-4 text-red-100">
            <a href="#" className="p-2 bg-[#B91C1C] rounded-lg hover:bg-[#EF4444] text-white transition" title="YouTube"><Youtube className="w-4 h-4" /></a>
            <a href="#" className="p-2 bg-[#B91C1C] rounded-lg hover:bg-[#EF4444] text-white transition" title="Telegram"><Send className="w-4 h-4" /></a>
            <a href="#" className="p-2 bg-[#B91C1C] rounded-lg hover:bg-[#EF4444] text-white transition" title="Instagram"><Instagram className="w-4 h-4" /></a>
            <a href="#" className="p-2 bg-[#B91C1C] rounded-lg hover:bg-[#EF4444] text-white transition" title="Facebook"><Facebook className="w-4 h-4" /></a>
          </div>
        </div>

      </div>
    </footer>
  );
};
