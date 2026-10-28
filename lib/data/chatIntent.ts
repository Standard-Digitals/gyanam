/**
 * Lightweight OpenAI backstop for the regex-based chat dispatcher in aiMentor.ts — never the
 * primary path. Two narrow jobs, both best-effort: if OPENAI_API_KEY isn't set, the call fails,
 * times out, or comes back malformed, every function here returns the same safe default the
 * caller used before this file existed, so the chat degrades to pure-regex behavior instead of
 * breaking. Same fetch/timeout shape as examDateSuggestion.ts.
 */

export interface ChatTurn {
  role: 'user' | 'assistant';
  content: string;
}

/** `history`, when given, is inserted between the system prompt and the final user turn — real
 * prior turns, not summarized into text, so the model can follow an actual back-and-forth (e.g. a
 * "why that subject?" follow-up) instead of judging each message in total isolation. */
async function callOpenAI(systemPrompt: string, userContent: string, maxTokens: number, temperature = 0, history: ChatTurn[] = []): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      signal: controller.signal,
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature,
        max_tokens: maxTokens,
        messages: [
          { role: 'system', content: systemPrompt },
          ...history.map((turn) => ({ role: turn.role, content: turn.content.slice(0, 500) })),
          { role: 'user', content: userContent.slice(0, 500) },
        ],
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const text: string | undefined = data?.choices?.[0]?.message?.content;
    return text?.trim() || null;
  } catch {
    return null; // network error, timeout, malformed response — all "unavailable"
  } finally {
    clearTimeout(timeout);
  }
}

export const KNOWN_INTENTS = [
  { id: 'PLAN', label: "today's study plan" },
  { id: 'TEST', label: 'a practice test' },
  { id: 'PROGRESS', label: 'their progress/score report' },
  { id: 'MISTAKES', label: 'their weak subjects/mistakes' },
  { id: 'COUNSELLOR', label: 'talking to a human counsellor' },
  { id: 'FACULTY', label: 'who the faculty/teachers are' },
  { id: 'NEW_BATCH', label: 'when a new batch starts' },
  { id: 'CENTER', label: 'where the centers/locations are' },
  { id: 'ENROLL', label: 'how to enroll/pay for a course' },
  { id: 'BROWSE_COURSES', label: 'seeing all available courses' },
] as const;

export type KnownIntentId = (typeof KNOWN_INTENTS)[number]['id'];

export interface UnmatchedClassification {
  kind: 'small_talk' | 'known_intent' | 'genuine_doubt';
  intent?: KnownIntentId;
}

/** Only called once a message matched none of the regex intent patterns — tries to recover a
 * typo'd / Hindi-Hinglish-phrased / differently-worded version of something we already handle,
 * or at least avoid ticketing pure small talk ("ok", "thanks", "👍"). Anything else (or the LLM
 * being unavailable) keeps today's behavior: a genuine doubt, forwarded as a support ticket.
 * `history` (recent prior turns, current message excluded) helps disambiguate a short/ambiguous
 * message using what was just discussed — e.g. "which one" right after the bot named a subject. */
export async function classifyUnmatchedMessage(message: string, history: ChatTurn[] = []): Promise<UnmatchedClassification> {
  const intentList = KNOWN_INTENTS.map((i) => `${i.id} = ${i.label}`).join('\n');
  const system =
    'You classify one message from a student in an Indian government-exam-prep chatbot (English, Hindi, or Hinglish, possibly with typos). ' +
    'Prior turns of the conversation, if any, are given before the message to classify — use them only to resolve ' +
    'ambiguity in that message (e.g. what "it" or "that one" refers to), not to classify an earlier turn instead. ' +
    'Reply with ONLY one of:\n' +
    '- SMALL_TALK if it is a greeting, thanks, acknowledgement, or chit-chat that needs no real answer\n' +
    `- one of these exact IDs if the message clearly means this, even if phrased very differently:\n${intentList}\n` +
    '- DOUBT for a genuine study question or anything unclear\n' +
    'Reply with ONLY that single word, nothing else, no punctuation.';
  const result = await callOpenAI(system, message, 10, 0, history);
  if (!result) return { kind: 'genuine_doubt' };
  const cleaned = result.toUpperCase().replace(/[^A-Z_]/g, '');
  if (cleaned === 'SMALL_TALK') return { kind: 'small_talk' };
  const match = KNOWN_INTENTS.find((i) => i.id === cleaned);
  return match ? { kind: 'known_intent', intent: match.id } : { kind: 'genuine_doubt' };
}

/** Only called when a free-text intake question (e.g. "what's your qualification?") is still
 * pending and no regex "interrupt" pattern matched the reply — sanity-checks that the reply is
 * actually attempting to answer that question before it gets saved as-is, so an unrelated message
 * ("what is the right approach to crack my exam?") can't silently overwrite a profile field.
 * `history` is mostly belt-and-suspenders here (the question itself is usually enough context),
 * but costs nothing extra to pass since the caller already has it for the other two functions. */
export async function looksLikeAnswerTo(question: string, reply: string, history: ChatTurn[] = []): Promise<boolean> {
  const system =
    `A chatbot just asked a student: "${question}". ` +
    'You will be given the student\'s next message. Reply with ONLY "YES" if it is a plausible attempt to answer ' +
    'that specific question (short, vague, or off-hand answers still count as YES), or "NO" if it looks like the ' +
    'student is asking something else entirely or ignoring the question. Reply with ONLY YES or NO.';
  const result = await callOpenAI(system, reply, 5, 0, history);
  if (!result) return true; // unavailable — don't block, keep pre-existing behavior
  return /^\s*yes/i.test(result);
}

/** Only called for a genuine doubt that reaches the support-ticket fallback (classifyUnmatchedMessage
 * returned "genuine_doubt", or no regex pattern + no AI classification matched anything else) — a
 * short, immediate, encouraging reply instead of leaving the student with nothing until faculty
 * follows up. Deliberately NEVER a source of facts: the prompt forbids stating anything specific
 * (current affairs, dates, pricing, syllabus/policy details) it isn't certain of, and the caller
 * always still creates the support ticket regardless of this — a human safety net stays in place
 * whether or not this draft comes back. `history` (recent prior turns, oldest first, current
 * message NOT included) lets a follow-up like "why that one?" or "explain more" actually land as a
 * continuation of the conversation instead of a standalone, context-free message. Returns null
 * (caller falls back to the old ticket-only reply) if OPENAI_API_KEY isn't set, the call fails, or
 * the response is empty. */
export async function draftDoubtReply(message: string, targetExam: string | null, history: ChatTurn[] = []): Promise<string | null> {
  const system =
    'You are a warm, encouraging study mentor for Indian government-exam aspirants (SSC/Banking/Railway/UPSC/etc.), ' +
    `replying inside a chat app${targetExam ? ` to a student preparing for ${targetExam}` : ''}. ` +
    "The recent conversation (if any) is given as prior turns before the student's latest message — use it to " +
    "understand follow-ups (\"why that one?\", \"explain more\") the same way a human mentor would, but reply to " +
    "the LATEST message only, in 1-3 short sentences, in the same language/mix the student used " +
    '(English, Hindi, or Hinglish). You may give general study-skill advice, encouragement, or exam-strategy tips. ' +
    'You must NEVER state specific facts you are not certain are correct — no current affairs, exact dates, ' +
    'syllabus specifics, prices, policies, or anything about this institute\'s courses/schedule (those come from ' +
    "elsewhere in the app). If the question needs any such fact, say only that you're not 100% sure and a faculty " +
    "member will confirm it — never guess. Do not mention that you're an AI or that this is a draft.";
  return callOpenAI(system, message, 120, 0.4, history);
}
