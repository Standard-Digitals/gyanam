/**
 * Narrow, best-effort OpenAI lookup: given an exam name, suggest the typical conduct period
 * (e.g. "June-July" or "varies by state") so the AI Mentor chat can offer it as a starting point
 * instead of making the student type a date from scratch — never presented as authoritative,
 * since exam schedules shift year to year and the model can be wrong or out of date. Always
 * optional: if OPENAI_API_KEY isn't set, or the call fails or times out, this returns null and
 * the chat falls back to asking the student directly, exactly as it did before this existed.
 */
export async function suggestExamPeriod(examName: string): Promise<string | null> {
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
        max_tokens: 20,
        messages: [
          {
            role: 'system',
            content:
              'You help identify the typical conduct period for Indian competitive/government exams. ' +
              'Given an exam name, reply with ONLY a short period (e.g. "June-July", "December 2026", "varies by state") ' +
              'if you have reasonably confident general knowledge of it. If you are not confident, reply with exactly ' +
              'UNKNOWN. Never add any other words, punctuation beyond the period itself, or explanation.',
          },
          { role: 'user', content: examName.slice(0, 120) },
        ],
      }),
    });
    if (!res.ok) return null;

    const data = await res.json();
    const text: string | undefined = data?.choices?.[0]?.message?.content;
    if (!text) return null;

    const cleaned = text.trim().replace(/^["'.]+|["'.]+$/g, '');
    if (!cleaned || cleaned.length > 40 || /unknown/i.test(cleaned)) return null;
    return cleaned;
  } catch {
    return null; // network error, timeout, malformed response — all treated as "no suggestion"
  } finally {
    clearTimeout(timeout);
  }
}
