'use client';
import { useEffect, useRef, useState } from 'react';
import { Sparkles, X, Send, Target, RotateCcw } from 'lucide-react';
import { PlanTab } from './PlanTab';
import { MistakesTab } from './MistakesTab';
import { ProgressTab } from './ProgressTab';
import { CoursesTab } from './CoursesTab';
import { QuizTab } from './QuizTab';
import { OnboardingFlow } from './OnboardingFlow';
import { PREP_SUGGESTIONS, GENERAL_SUGGESTIONS } from '@/lib/aiMentorPrompts';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  suggestions?: string[];
  createdAt: string;
}

const TABS = [
  { key: 'chat', label: 'Chat' },
  { key: 'plan', label: 'My Plan' },
  { key: 'test', label: 'Test' },
  { key: 'mistakes', label: 'My Mistakes' },
  { key: 'progress', label: 'My Progress' },
  { key: 'courses', label: 'Courses' },
] as const;
type TabKey = (typeof TABS)[number]['key'];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<TabKey>('chat');
  // Set when "My Plan" sends the student to My Mistakes specifically to review wrong answers
  // (as opposed to tapping the "My Mistakes" nav tab directly) — jumps straight into the guided
  // one-by-one walkthrough instead of the list view.
  const [mistakesStartInReview, setMistakesStartInReview] = useState(false);
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
  // dumping the whole answer in one bubble — reads like a person replying, not a report. CEO
  // feedback was actually about something else (a long reply auto-showing every piece of info at
  // once) — see buildStrategyIntro/finishIntake in aiMentor.ts, which now sends far fewer messages
  // per reply and leaves the rest to suggestion chips the student taps on their own — so this
  // pause is deliberately kept short, not stretched out; it was never the actual problem. Only the
  // last chunk carries the quick-reply chips, matching how the server attaches them.
  const appendRepliesSequentially = async (replies: string[], suggestions: string[] = []) => {
    for (let i = 0; i < replies.length; i++) {
      setSending(true);
      await new Promise((r) => setTimeout(r, 450 + Math.random() * 400));
      setMessages((prev) => [
        ...prev,
        {
          id: `reply-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          role: 'assistant',
          content: replies[i],
          suggestions: i === replies.length - 1 ? suggestions : [],
          createdAt: new Date().toISOString(),
        },
      ]);
    }
    setSending(false);
  };

  const handleOnboardingDone = async (replies: string[], suggestions: string[]) => {
    setMessages((prev) => [...prev, { id: `onb-u-${Date.now()}`, role: 'user', content: 'Set up my exam preparation', createdAt: new Date().toISOString() }]);
    setOnboardingResolved(true);
    setIsGeneralVisitor(false);
    setShowPrepForm(false);
    await appendRepliesSequentially(replies, suggestions);
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
      await appendRepliesSequentially(data.replies ?? [], data.suggestions ?? []);
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

  // Quick-reply chips so the student can tap instead of typing — each reply now carries its own
  // context-specific chip labels from the server, computed by whichever branch produced it, so
  // they actually reflect what was just discussed instead of always showing the same 4 buttons.
  const lastMessage = messages[messages.length - 1];
  const quickReplies: string[] | null =
    messages.length === 0
      ? isGeneralVisitor
        ? GENERAL_SUGGESTIONS
        : PREP_SUGGESTIONS
      : lastMessage?.role === 'assistant' && lastMessage.suggestions && lastMessage.suggestions.length > 0
        ? lastMessage.suggestions
        : null;

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
                onClick={() => {
                  if (t.key === 'mistakes') setMistakesStartInReview(false);
                  setTab(t.key);
                }}
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
                {tab === 'plan' && (
                  <PlanTab
                    onTalkToCounsellor={handleTalkToCounsellor}
                    onBrowseCourses={handleBrowseCourses}
                    onGoToTest={() => setTab('test')}
                    onGoToMistakes={() => {
                      setMistakesStartInReview(true);
                      setTab('mistakes');
                    }}
                  />
                )}
                {tab === 'test' && <QuizTab />}
                {tab === 'mistakes' && <MistakesTab startInReview={mistakesStartInReview} />}
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
