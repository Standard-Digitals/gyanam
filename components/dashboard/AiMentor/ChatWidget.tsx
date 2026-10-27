'use client';
import { useEffect, useRef, useState } from 'react';
import { Sparkles, X, Send, Target, RotateCcw } from 'lucide-react';
import { PlanTab } from './PlanTab';
import { MistakesTab } from './MistakesTab';
import { ProgressTab } from './ProgressTab';
import { CoursesTab } from './CoursesTab';
import { OnboardingFlow } from './OnboardingFlow';
import {
  EXAM_NAME_PROMPT,
  EXAM_DATE_PROMPT,
  QUALIFICATION_PROMPT,
  MARKS_PROMPT,
  CONFIRM_EXAM_PROMPT,
  EXAM_DATE_CONFIRM_PROMPT,
  OFFER_COURSE_PROMPT,
} from '@/lib/aiMentorPrompts';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

const PREP_SUGGESTIONS = ["What's my plan today?", 'How is my progress?', 'What is the right approach to crack my exam?', 'Give me a practice test'];
const GENERAL_SUGGESTIONS = ['When does a new batch start?', 'Who are the faculty?', 'Where are your centers?', 'When do new test series start?'];
const QUALIFICATION_SUGGESTIONS = ['12th Pass', 'Graduate', 'Post-graduate', 'Diploma'];
const MARKS_SUGGESTIONS = ['Below 50%', '50-70%', '70-90%', 'Above 90%'];
const CONFIRM_EXAM_SUGGESTIONS = ['Yes, same exam', "No, it's changed"];
const EXAM_DATE_CONFIRM_SUGGESTIONS = ["Yes, that's about right", 'I have the exact date'];
const OFFER_COURSE_SUGGESTIONS = ['Yes, show me', 'Not now'];
// Prompts that expect a specific free-text answer (an exam name, a month/year) — no quick-reply
// chips make sense there, so they're excluded from the generic "assistant just spoke" fallback.
const FREE_TEXT_PROMPTS = new Set([EXAM_NAME_PROMPT, EXAM_DATE_PROMPT]);
const TABS = [
  { key: 'chat', label: 'Chat' },
  { key: 'plan', label: 'My Plan' },
  { key: 'mistakes', label: 'My Mistakes' },
  { key: 'progress', label: 'My Progress' },
  { key: 'courses', label: 'Courses' },
] as const;
type TabKey = (typeof TABS)[number]['key'];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<TabKey>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [onboardingResolved, setOnboardingResolved] = useState(false);
  const [isGeneralVisitor, setIsGeneralVisitor] = useState(false);
  const [showPrepForm, setShowPrepForm] = useState(false);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || loaded) return;
    fetch('/api/dashboard/ai-mentor/messages')
      .then((res) => res.json())
      .then((data) => {
        const msgs: ChatMessage[] = data.messages ?? [];
        setMessages(msgs);
        if (msgs.length > 0) {
          setOnboardingResolved(true); // returning student — skip the first-time choice
          // Server truth: no exam set up yet, regardless of what happened in a previous session.
          if (data.needsExamSetup) setIsGeneralVisitor(true);
        }
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, [open, loaded]);

  // Shows each reply chunk one at a time with a short "typing" pause in between, instead of
  // dumping the whole answer in one bubble — reads like a person replying, not a report.
  const appendRepliesSequentially = async (replies: string[]) => {
    for (const content of replies) {
      setSending(true);
      await new Promise((r) => setTimeout(r, 450 + Math.random() * 400));
      setMessages((prev) => [...prev, { id: `reply-${Date.now()}-${Math.random().toString(36).slice(2)}`, role: 'assistant', content, createdAt: new Date().toISOString() }]);
    }
    setSending(false);
  };

  const handleOnboardingDone = async (replies: string[]) => {
    setMessages((prev) => [...prev, { id: `onb-u-${Date.now()}`, role: 'user', content: 'Set up my exam preparation', createdAt: new Date().toISOString() }]);
    setOnboardingResolved(true);
    setIsGeneralVisitor(false);
    setShowPrepForm(false);
    await appendRepliesSequentially(replies);
  };

  useEffect(() => {
    if (tab === 'chat') scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, sending, tab]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    setError(null);
    setInput('');
    setTab('chat');
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
      await appendRepliesSequentially(data.replies ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send that — try again');
      setSending(false);
    }
  };

  const handleTalkToCounsellor = () => {
    setTab('chat');
    send('talk to a counsellor');
  };

  const handleBrowseCourses = () => setTab('courses');

  // Clears the visible thread without losing it — the server stamps chatResetAt and every reply
  // after that only looks at messages newer than it, so old answers never get picked back up.
  const handleNewConversation = async () => {
    if (!confirm('Start a new conversation? Your previous chat stays saved, but this screen will start fresh.')) return;
    try {
      await fetch('/api/dashboard/ai-mentor/reset', { method: 'POST' });
    } catch {
      // Best-effort — worst case the old thread is still visible next time, not a data loss risk.
    }
    setMessages([]);
    setError(null);
    setShowPrepForm(false);
    setTab('chat');
  };

  // Quick-reply chips so the student can tap instead of typing wherever the answer is really a
  // pick from a short list — which prompt the assistant just asked decides which set (if any).
  const PROMPT_SUGGESTIONS: Record<string, string[]> = {
    [QUALIFICATION_PROMPT]: QUALIFICATION_SUGGESTIONS,
    [MARKS_PROMPT]: MARKS_SUGGESTIONS,
    [CONFIRM_EXAM_PROMPT]: CONFIRM_EXAM_SUGGESTIONS,
    [EXAM_DATE_CONFIRM_PROMPT]: EXAM_DATE_CONFIRM_SUGGESTIONS,
    [OFFER_COURSE_PROMPT]: OFFER_COURSE_SUGGESTIONS,
  };
  const lastMessage = messages[messages.length - 1];
  const lastBotContent = lastMessage?.role === 'assistant' ? lastMessage.content : undefined;
  const genericSuggestions = isGeneralVisitor ? GENERAL_SUGGESTIONS : PREP_SUGGESTIONS;
  let quickReplies: string[] | null;
  if (messages.length === 0) {
    quickReplies = genericSuggestions;
  } else if (lastBotContent && PROMPT_SUGGESTIONS[lastBotContent]) {
    quickReplies = PROMPT_SUGGESTIONS[lastBotContent];
  } else if (lastBotContent && FREE_TEXT_PROMPTS.has(lastBotContent)) {
    quickReplies = null;
  } else if (lastMessage?.role === 'assistant') {
    quickReplies = genericSuggestions;
  } else {
    quickReplies = null;
  }

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
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
          <div className="flex items-center justify-between gap-2 px-4 sm:px-6 py-3.5 bg-gradient-to-r from-[#7A1516] to-[#C12223] text-white shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <p className="font-heading font-black text-sm leading-tight">Gyanmitra</p>
                <p className="text-[10px] text-white/70 leading-tight">Your AI mentor</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button
                  onClick={handleNewConversation}
                  title="Start a new conversation"
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/15 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
              <button onClick={() => setOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/15 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1 px-4 sm:px-6 border-b border-[#F3DCDD] shrink-0 overflow-x-auto no-scrollbar">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-3.5 py-3 text-xs font-bold whitespace-nowrap border-b-2 cursor-pointer transition ${
                  tab === t.key ? 'border-[#C12223] text-[#C12223]' : 'border-transparent text-[#888888] hover:text-[#1F1A1C]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex-1 min-h-0 w-full max-w-2xl mx-auto flex flex-col overflow-hidden">
            {tab === 'chat' && loaded && messages.length === 0 && !onboardingResolved ? (
              <OnboardingFlow
                onSkip={() => {
                  setIsGeneralVisitor(true);
                  setOnboardingResolved(true);
                }}
                onDone={handleOnboardingDone}
              />
            ) : tab === 'chat' && showPrepForm ? (
              <OnboardingFlow initialStage="group" onClose={() => setShowPrepForm(false)} onDone={handleOnboardingDone} />
            ) : tab === 'chat' ? (
              <>
                <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-3 bg-[#FFF5F5]">
                  {messages.length === 0 && loaded && (
                    <div className="text-center py-10">
                      <Sparkles className="w-8 h-8 text-[#D9B4B5] mx-auto mb-2" />
                      <p className="text-xs text-[#888888] max-w-[260px] mx-auto">
                        Ask a doubt, request a practice test, check your plan or progress, or ask to talk to a counsellor.
                      </p>
                    </div>
                  )}
                  {messages.map((m) => (
                    <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
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

                {loaded && !sending && quickReplies && quickReplies.length > 0 && (
                  <div className="px-4 sm:px-6 pb-2 flex flex-wrap gap-1.5 shrink-0">
                    {quickReplies.map((s) => (
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

                {isGeneralVisitor && (
                  <div className="px-4 sm:px-6 pb-2 shrink-0">
                    <button
                      onClick={() => setShowPrepForm(true)}
                      className="flex items-center gap-2 w-full justify-center px-3.5 py-2 bg-[#FDEAE9] text-[#C12223] font-bold text-xs rounded-xl hover:bg-[#F3DCDD] transition cursor-pointer"
                    >
                      <Target className="w-3.5 h-3.5" />
                      Set up my exam preparation
                    </button>
                  </div>
                )}

                {error && <p className="px-4 sm:px-6 pb-1 text-[11px] font-semibold text-red-600 shrink-0">{error}</p>}

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    send(input);
                  }}
                  className="flex items-center gap-2 p-3 sm:p-4 border-t border-[#F3DCDD] shrink-0"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask a doubt, request a test, or tell me what's blocking you..."
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
              </>
            ) : (
              <div className="flex-1 overflow-y-auto bg-[#FFF5F5]">
                {tab === 'plan' && <PlanTab onTalkToCounsellor={handleTalkToCounsellor} onBrowseCourses={handleBrowseCourses} />}
                {tab === 'mistakes' && <MistakesTab />}
                {tab === 'progress' && <ProgressTab onBrowseCourses={handleBrowseCourses} />}
                {tab === 'courses' && <CoursesTab />}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
