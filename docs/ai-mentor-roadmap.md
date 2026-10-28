# AI Mentor (Gyanmitra) — Roadmap

Reference: https://chatgpt.com/share/6ae0dec9-d2a4-83ec-bd7b-d475be5a89f1 (ChatGPT's SSC CGL
3-month prep plan — the bar we're aiming our in-app AI Mentor at, for how structured and
trackable it feels for a student).

This file is the source of truth for what's done and what's next. Context gets compacted across
long chat sessions, so **check this file first in a new conversation** instead of relying on the
chat history remembering it. Tick a box and commit whenever a phase ships.

## Done

- [x] Subject-by-subject weekly schedule chart (Mon–Sat vs. Sunday), built from the student's
      self-reported study hours and weak subject — `lib/data/aiMentor.ts` (`buildWeeklySchedule`),
      "My Plan" tab.
- [x] Chat intake flow collects exam, exam date, qualification, marks, stage, study hours, weak
      subject, syllabus progress — equivalent of the ChatGPT plan's "customize this plan" quiz,
      but conversational instead of a form.
- [x] "My Progress" tab — real quiz/mock-test attempts auto-rolled into an overall score, course
      median comparison, percentile, weakest/strongest subject. Covers the same ground as
      ChatGPT's manual weekly score-tracking table, but computed automatically instead of typed in.
- [x] "My Mistakes" tab — subject-level accuracy bars from real attempts (not yet question-level,
      see Phase 3 below).
- [x] Bug fixes (2026-10-27/28): practice-test tab now matches the student's target exam instead
      of any open quiz; chat no longer ignores "what's my plan" / "give me a test" / "talk to a
      counsellor" while an intake question is pending; "My Plan" tab no longer crashes on an
      old-format saved schedule.
- [x] **Phase 1 — today's specific topic per subject** (2026-10-28): each schedule block now shows
      "Today: `<topic>`" — pulled from the student's actual enrolled course's chapters/topics when
      those are subject-tagged (advances with their real `TopicProgress`), a matching course's
      syllabus as a preview when they aren't enrolled, or a generic rotating fallback otherwise.
      No schema change — computed at read time. `attachTodaysTopics()` in `lib/data/aiMentor.ts`.
- [x] **Phase 2 — multi-phase roadmap** (2026-10-28): "My Plan" now also shows a collapsible
      3-phase roadmap (Foundation → Complete the syllabus → Mocks & final revision), scaled to
      however long the student actually has until `examDate` (best-effort parse, 90-day generic
      fallback if it isn't a real date — `resolveExamWindow()`). Each phase lists the topics it
      covers per subject, split from the same real-course-or-fallback topic sequence Phase 1 uses
      (`fullTopicSequence()`), so by the end of Phase 2 every topic in the sequence has appeared
      once. Not a literal day-by-day table like the ChatGPT reference — scoped down to phase-level
      topic lists to fit the chat widget instead of a full calendar grid. `buildRoadmap()` in
      `lib/data/aiMentor.ts`, rendered by `RoadmapView` in `PlanTab.tsx`.

## Next
- [ ] **Phase 3 — question-level mistake notebook.** "My Mistakes" tab already says out loud that
      it's subject-accuracy only, not question-by-question. Needs: storing which specific
      questions were gotten wrong (quiz/mock submission already knows this per-question — check
      whether it's persisted anywhere beyond the aggregate score), then a view of "this question,
      your answer, the correct answer, why" grouped by subject/topic, matching ChatGPT's "error
      notebook" daily habit.
- [x] **Phase 4 — weekly checklist** (2026-10-28): "My Plan" now shows a 6-item weekly checklist
      (practice topic-wise questions, revise static GK, solve PYQs, take a mock, review wrong
      answers, revise formulas/notes) the student can tick off — matches the ChatGPT plan's
      "8. Weekly checklist". Backed by one new `User.weeklyChecklist` Json column
      (`{ weekStart, checkedIndices }`); a stored week older than the current Monday is read back
      as fresh/unchecked instead of being cleared, so it auto-resets weekly with no cron job.
      `getWeeklyChecklist()` / `toggleWeeklyChecklistItem()` in `lib/data/aiMentor.ts`,
      `/api/dashboard/ai-mentor/checklist` (GET/POST), `WeeklyChecklist` in `PlanTab.tsx`.
      **Needs `npx prisma db push` on deploy** (new column).
- [ ] **Phase 5 — daily micro-habit nudges.** Short standing reminders (e.g. "15 min calculation
      practice", "30–45 min GA reading") surfaced somewhere low-friction — chat suggestion chip or
      a line in "My Plan" — not a huge build, mostly copy + placement once Phase 2/4 land.

## Notes for whoever picks this up

- No DB migration tooling in this repo (no `prisma/migrations` folder) — schema changes go out via
  `npx prisma db push` on deploy, done manually on the VPS (`/var/www/gyanam`, PM2 process name
  `gyanam`, **not Docker** despite Docker being used elsewhere on that VPS for other projects).
- Local dev machine can't reach the production DB, so DB-backed features can only be verified live
  on the VPS after deploy, not locally beforehand — typecheck (`tsc --noEmit`, needs
  `NODE_OPTIONS=--max-old-space-size=4096` or it OOMs) is the only pre-deploy check available.
