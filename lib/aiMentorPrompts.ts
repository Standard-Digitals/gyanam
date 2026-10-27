// Pure string constants shared between the server-side AI Mentor reply engine
// (lib/data/aiMentor.ts) and the chat client (ChatWidget.tsx) — no server-only imports here
// (no prisma, nothing), so this file is safe to import from a 'use client' component without
// pulling server code into the browser bundle.
export const EXAM_NAME_PROMPT = "Happy to guide you! Which exam are you preparing for?";
export const EXAM_DATE_PROMPT = "Got it. Roughly when is it (month and year is fine)? I'll tailor the advice to that.";
export const QUALIFICATION_PROMPT = "What's your highest qualification right now — for example, 12th pass, graduate, or post-graduate?";
export const MARKS_PROMPT = 'Roughly what percentage or marks did you score in that?';
