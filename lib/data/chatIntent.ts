/**
 * Lightweight OpenAI backstop for the regex-based chat dispatcher in aiMentor.ts — never the
 * primary path. Two narrow jobs, both best-effort: if OPENAI_API_KEY isn't set, the call fails,
 * times out, or comes back malformed, every function here returns the same safe default the
 * caller used before this file existed, so the chat degrades to pure-regex behavior instead of
 * breaking. Same fetch/timeout shape as examDateSuggestion.ts.
 */

async function callOpenAI(systemPrompt: string, userContent: string, maxTokens: number): Promise<string | null> {
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
        temperature: 0,
        max_tokens: maxTokens,
        messages: [
          { role: 'system', content: systemPrompt },
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
 * being unavailable) keeps today's behavior: a genuine doubt, forwarded as a support ticket. */
export async function classifyUnmatchedMessage(message: string): Promise<UnmatchedClassification> {
  const intentList = KNOWN_INTENTS.map((i) => `${i.id} = ${i.label}`).join('\n');
  const system =
    'You classify one message from a student in an Indian government-exam-prep chatbot (English, Hindi, or Hinglish, possibly with typos). ' +
    'Reply with ONLY one of:\n' +
    '- SMALL_TALK if it is a greeting, thanks, acknowledgement, or chit-chat that needs no real answer\n' +
    `- one of these exact IDs if the message clearly means this, even if phrased very differently:\n${intentList}\n` +
    '- DOUBT for a genuine study question or anything unclear\n' +
    'Reply with ONLY that single word, nothing else, no punctuation.';
  const result = await callOpenAI(system, message, 10);
  if (!result) return { kind: 'genuine_doubt' };
  const cleaned = result.toUpperCase().replace(/[^A-Z_]/g, '');
  if (cleaned === 'SMALL_TALK') return { kind: 'small_talk' };
  const match = KNOWN_INTENTS.find((i) => i.id === cleaned);
  return match ? { kind: 'known_intent', intent: match.id } : { kind: 'genuine_doubt' };
}

/** Only called when a free-text intake question (e.g. "what's your qualification?") is still
 * pending and no regex "interrupt" pattern matched the reply — sanity-checks that the reply is
 * actually attempting to answer that question before it gets saved as-is, so an unrelated message
 * ("what is the right approach to crack my exam?") can't silently overwrite a profile field. */
export async function looksLikeAnswerTo(question: string, reply: string): Promise<boolean> {
  const system =
    `A chatbot just asked a student: "${question}". ` +
    'You will be given the student\'s next message. Reply with ONLY "YES" if it is a plausible attempt to answer ' +
    'that specific question (short, vague, or off-hand answers still count as YES), or "NO" if it looks like the ' +
    'student is asking something else entirely or ignoring the question. Reply with ONLY YES or NO.';
  const result = await callOpenAI(system, reply, 5);
  if (!result) return true; // unavailable — don't block, keep pre-existing behavior
  return /^\s*yes/i.test(result);
}
