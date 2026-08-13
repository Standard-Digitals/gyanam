'use client';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { NAV_GROUPS } from './navConfig';

const ALL_ITEMS = NAV_GROUPS.flatMap((g) => g.items.map((item) => ({ ...item, group: g.label })));

export default function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ALL_ITEMS;
    return ALL_ITEMS.filter((item) => item.label.toLowerCase().includes(q) || item.group.toLowerCase().includes(q));
  }, [query]);

  const go = (href: string) => {
    setOpen(false);
    setQuery('');
    router.push(href);
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (open) setActiveIndex(0);
  }, [open, query]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter' && results[activeIndex]) {
        go(results[activeIndex].href);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, results, activeIndex]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hidden sm:flex items-center gap-2 bg-[#FBF6F4] border border-[#F0E1E0] rounded-xl px-3 py-2 w-full max-w-xs text-left"
      >
        <Search size={15} className="text-[#B0989A] shrink-0" />
        <span className="text-xs text-[#B0989A] flex-1">Search admin pages…</span>
        <kbd className="text-[10px] font-plexmono bg-white border border-[#F0E1E0] px-1.5 py-0.5 rounded text-[#8A7A7B]">⌘K</kbd>
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-[#1F1A1C]/45 backdrop-blur-[2px] z-[150] flex items-start justify-center pt-[12vh]"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-[92%] max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#F0E1E0]">
              <Search size={16} className="text-[#8A7A7B] shrink-0" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Go to a page…"
                className="flex-1 outline-none text-sm text-[#1F1A1C] placeholder:text-[#B0989A]"
              />
            </div>
            <div className="max-h-80 overflow-y-auto p-2">
              {results.map((item, i) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.href}
                    onClick={() => go(item.href)}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left ${i === activeIndex ? 'bg-[#FBF6F4]' : ''}`}
                  >
                    <span className="w-8 h-8 rounded-lg bg-[#FDEAE9] text-[#C12223] flex items-center justify-center shrink-0">
                      <Icon size={14} strokeWidth={2.25} />
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-bold text-[#1F1A1C]">{item.label}</span>
                      <span className="block text-[11px] text-[#8A7A7B]">{item.group}</span>
                    </span>
                  </button>
                );
              })}
              {results.length === 0 && (
                <p className="text-center text-sm text-[#8A7A7B] py-8">No matching page.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
