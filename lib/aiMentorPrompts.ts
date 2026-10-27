// Pure string constants shared between the server-side AI Mentor reply engine
// (lib/data/aiMentor.ts) and the chat client (ChatWidget.tsx) — no server-only imports here
// (no prisma, nothing), so this file is safe to import from a 'use client' component without
// pulling server code into the browser bundle.
export const EXAM_NAME_PROMPT = "Happy to guide you! Which exam are you preparing for?";
export const EXAM_DATE_PROMPT = "Got it. Roughly when is it (month and year is fine)? I'll tailor the advice to that.";
export const QUALIFICATION_PROMPT = "What's your highest qualification right now — for example, 12th pass, graduate, or post-graduate?";
export const MARKS_PROMPT = 'Roughly what percentage or marks did you score in that?';
export const CONFIRM_EXAM_PROMPT = 'Is that still the plan, or has it changed?';
export const EXAM_DATE_CONFIRM_PROMPT = 'Is that roughly right, or do you already have the official date?';
export const OFFER_COURSE_PROMPT = 'Want me to suggest a course that fits this plan?';

// Shown before any message exists yet (truly empty chat) — the only suggestion set the client
// still needs directly, since every other reply now carries its own `suggestions` from the server.
export const PREP_SUGGESTIONS = ["What's my plan today?", 'How is my progress?', 'What is the right approach to crack my exam?', 'Give me a practice test'];
export const GENERAL_SUGGESTIONS = ['When does a new batch start?', 'Who are the faculty?', 'Where are your centers?', 'When do new test series start?'];
