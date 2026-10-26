'use client';
import { useEffect, useRef, useState } from 'react';
import { Sparkles, X, Send } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

const SUGGESTIONS = ['Give me a practice test', 'Talk to a counsellor', 'I have a doubt'];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || loaded) return;
    fetch('/api/dashboard/ai-mentor/messages')
      .then((res) => res.json())
      .then((data) => {
        setMessages(data.messages ?? []);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, [open, loaded]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, sending]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    setError(null);
    setInput('');
    setMessages((prev) => [...prev, { id: `tmp-${Date.now()}`, role: 'user', content: trimmed, createdAt: new Date().toISOString() }]);
    setSending(true);
    try {
      const res = await fetch('/api/dashboard/ai-mentor/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      setMessages((prev) => [...prev, { id: `reply-${Date.now()}`, role: 'assistant', content: data.reply, createdAt: new Date().toISOString() }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send that — try again');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-40 flex items-center gap-2 bg-[#C12223] text-white font-bold text-xs px-4 py-3 rounded-full shadow-lg shadow-[#C12223]/30 hover:bg-[#A01B1C] transition cursor-pointer"
      >
        <Sparkles className="w-4 h-4" />
        <span className="hidden sm:inline">Ask Gyanmitra</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/30" />
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full sm:w-[380px] sm:mr-6 h-[85vh] sm:h-[600px] sm:max-h-[85vh] bg-white rounded-t-3xl sm:rounded-3xl shadow-xl flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between gap-2 px-4 py-3.5 bg-gradient-to-r from-[#7A1516] to-[#C12223] text-white shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-heading font-black text-sm leading-tight">Gyanmitra</p>
                  <p className="text-[10px] text-white/70 leading-tight">Your AI mentor</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/15 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-[#FFF5F5]">
              {messages.length === 0 && loaded && (
                <div className="text-center py-6">
                  <Sparkles className="w-7 h-7 text-[#D9B4B5] mx-auto mb-2" />
                  <p className="text-xs text-[#888888] max-w-[240px] mx-auto">
                    Ask a doubt, request a practice test, or ask to talk to a counsellor.
                  </p>
                </div>
              )}
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                      m.role === 'user' ? 'bg-[#C12223] text-white rounded-br-sm' : 'bg-white border border-[#F3DCDD] text-[#1F1A1C] rounded-bl-sm'
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {sending && (
                <div className="flex justify-start">
                  <div className="bg-white border border-[#F3DCDD] px-3.5 py-2.5 rounded-2xl rounded-bl-sm text-xs text-[#888888]">Typing...</div>
                </div>
              )}
            </div>

            {messages.length === 0 && loaded && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5 shrink-0">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="px-3 py-1.5 bg-white border border-[#F3DCDD] rounded-full text-[11px] font-bold text-[#C12223] hover:bg-[#FFF5F5] cursor-pointer"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {error && <p className="px-4 pb-1 text-[11px] font-semibold text-red-600 shrink-0">{error}</p>}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2 p-3 border-t border-[#F3DCDD] shrink-0"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a doubt, request a test..."
                className="flex-1 px-3.5 py-2.5 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-xs font-semibold outline-none focus:border-[#C12223]"
              />
              <button
                type="submit"
                disabled={sending || !input.trim()}
                className="w-9 h-9 shrink-0 flex items-center justify-center bg-[#C12223] text-white rounded-xl disabled:opacity-40 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
