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
- [x] **Phase 3 — question-level mistake notebook** (2026-10-28): "My Mistakes" now also lists
      recent wrong/skipped questions (question, your answer, correct answer, explanation), not
      just subject-level accuracy. New `QuestionMistake` table, written best-effort (wrapped in
      try/catch, never blocks score saving) from inside `app/api/quiz/[quizId]/submit/route.ts`
      and `app/api/mock-tests/[id]/submit/route.ts` — the existing scoring/response logic in both
      routes is untouched, this only adds a side-effect write after the attempt is already saved.
      `getRecentMistakes()` in `lib/data/performance.ts`, rendered by `RecentMistakesList` in
      `MistakesTab.tsx`. **Needs `npx prisma db push` + `npx prisma generate` on deploy** (new
      table) — only logs mistakes from attempts made *after* this deploy; past attempts have no
      retroactive question-level data.
- [x] **Phase 4 — weekly checklist** (2026-10-28): "My Plan" now shows a 6-item weekly checklist
      (practice topic-wise questions, revise static GK, solve PYQs, take a mock, review wrong
      answers, revise formulas/notes) the student can tick off — matches the ChatGPT plan's
      "8. Weekly checklist". Backed by one new `User.weeklyChecklist` Json column
      (`{ weekStart, checkedIndices }`); a stored week older than the current Monday is read back
      as fresh/unchecked instead of being cleared, so it auto-resets weekly with no cron job.
      `getWeeklyChecklist()` / `toggleWeeklyChecklistItem()` in `lib/data/aiMentor.ts`,
      `/api/dashboard/ai-mentor/checklist` (GET/POST), `WeeklyChecklist` in `PlanTab.tsx`.
      **Needs `npx prisma db push` on deploy** (new column).
- [x] **Phase 5 — daily micro-habit nudges** (2026-10-28): "My Plan" shows a static "Daily Habits
      That Add Up" card (calculation practice, current affairs reading, error review) below the
      checklist. Pure UI, no backend/schema — `DailyHabits` in `PlanTab.tsx`.

All 5 phases from the ChatGPT reference are shipped. Nothing queued right now from that reference —
see the audit-driven items below for what's next.

## Chatbot audit (2026-10-28)

Ran a full expert-style audit of the chat dispatcher (`sendChatMessage` in `lib/data/aiMentor.ts`)
after live-testing surfaced a real bug (a free-text answer got silently saved into the wrong
profile field). Full findings aren't duplicated here — the short version: this was a pure
regex/keyword dispatcher with no actual language understanding, which is both the root cause of
several bugs and the single biggest gap to feeling like a real "AI mentor". User has an OpenAI key
now, so the fix direction is a **hybrid**: OpenAI only as a narrow backstop for understanding
(validating an answer, recovering a misphrased/typo'd/Hindi-Hinglish intent), never as the source
of truth for business facts (course prices, schedules, etc. always come from the existing
deterministic code) — keeps cost low and avoids hallucinated course/pricing info.

- [x] Narrowed `PLAN_PATTERN`/`STRATEGY_PATTERN` — dropped bare-word alternatives ("plan",
      "today", "prepare") that collided with unrelated sentences (e.g. "who teaches the exam-prep
      faculty?" used to hijack into the exam-strategy intake).
- [x] **OpenAI backstop, new `lib/data/chatIntent.ts`** (same safe-fallback shape as
      `examDateSuggestion.ts` — no key/failed call/timeout all degrade to the old regex-only
      behavior, never breaks the chat):
      - `looksLikeAnswerTo()` — before accepting *any* pending-prompt reply (free-text intake slots
        AND the yes/no-style prompts like "want to know the price?", which only checked for an
        explicit decline and otherwise assumed yes), sanity-checks it's actually a response to that
        prompt. Deliberately NOT done by extending the regex interrupt-list instead, since several
        intent patterns share ordinary words with plausible answers (e.g. MISTAKES_PATTERN's "weak"
        vs. a genuine "I'm weak in reasoning" answer) — meaning-based beats keyword-based here. Caught
        live post-deploy: a genuine study question sent while COURSE_DETAILS_PROMPT was pending
        didn't match the decline pattern, so it fell into "yes" and got shown real course pricing
        in reply to an unrelated doubt.
      - `classifyUnmatchedMessage()` — only runs when no regex pattern matched anything (previously:
        always a support ticket). Recovers small talk (no ticket) and typo'd/differently-phrased/
        Hindi-Hinglish versions of known intents (shown as a tappable chip, which re-enters the
        normal deterministic dispatch — never auto-executes a different code path).
      - `draftDoubtReply()` — for a message that reaches the support-ticket fallback, drafts a
        short, immediate, encouraging reply (general study-skill advice only, never a stated fact
        it isn't certain of) instead of leaving the student with only a ticket number. The ticket
        is still always created regardless, as the unconditional human safety net.
- [x] Unified the two onboarding paths: the quick-form "Set up my exam preparation" flow
      (`completeOnboardingForm`) never built a schedule, so its own closing line — "ask me what's
      my plan today and I'll turn this into a checklist" — was false for anyone who used it. Now
      seeds a default schedule (`buildWeeklySchedule(null, null)`) there too, only if none exists
      yet (never overwrites a schedule already personalized via the chat intake).
- [x] Basic abuse/cost guards: rate limit on `/api/dashboard/ai-mentor/messages` (6 messages/10s
      per user), and `createCounsellorLead` dedupes against an existing Lead from the same phone in
      the last 24h instead of creating a duplicate every time "talk to a counsellor" is tapped.
- [x] `createDoubtTicket` no longer stuffs the internal `userId` into the `rollNoOrOrderId` field
      (misleading to an admin reading the ticket).
- [x] **Session memory for doubt replies** (2026-10-28): `draftDoubtReply` now gets the last ~8
      prior turns of the conversation (current message excluded, fetched only when actually
      needed) as real OpenAI message history, not just the single current message in isolation —
      so a follow-up like "why that one?" or "explain more" lands as a continuation instead of a
      context-free non-sequitur. `callOpenAI()` in `lib/data/chatIntent.ts` takes an optional
      `history: ChatTurn[]`, inserted between the system prompt and the current message.
- [x] **Session memory extended to every backstop** (2026-10-28): `classifyUnmatchedMessage` and
      `looksLikeAnswerTo` now also get the same recent history as `draftDoubtReply` — fetched once
      per message (`recentForAi` in `sendChatMessage`) and reused across all three, instead of each
      doing its own fetch or working from a single message in isolation.
- [x] **`My Mistakes` subject-accuracy now includes mock-test attempts** (2026-10-28): previously
      `getSubjectStrength` only ever looked at `QuizAttempt`, so a student who only took mock tests
      saw no data there at all. Mock-test submission now also saves a per-section correct/incorrect
      breakdown (`MockTestAttempt.sectionStats`), folded into the same per-subject averaging as quiz
      accuracy. **Needs `npx prisma db push` + `npx prisma generate` on deploy** (new column) — only
      populated for attempts made after this deploy, same retroactivity gap as Phase 3's mistake log.
- [x] **Exam-category-specific topic lists** (2026-10-28): the generic `SUBJECT_TOPICS` fallback
      (used by both "today's topic" and the roadmap when no real course curriculum is available) is
      now re-weighted per exam category — SSC, Banking, Railway, and UPSC each have their own
      tailored list (`SUBJECT_TOPICS_BY_CATEGORY` in `lib/data/aiMentor.ts`); any other category
      (State PSC, Defence, Assam Govt, Teaching Exams) still falls back to the generic list.
- [ ] **Needs `OPENAI_API_KEY` set in the VPS `.env`** for any of the OpenAI-backed behavior above
      to actually activate — until then every one of those checks safely no-ops back to the
      pre-audit regex-only behavior. (The exam-date-suggestion feature already reads this same env
      var — if that's ever shown a real suggestion in production, the key is already set.)

## Final re-audit (2026-10-28)

Second, deeper pass over everything above once it was all live, specifically hunting for issues
introduced by the rapid sequence of edits rather than repeating the first audit's (already-fixed)
findings.

- [x] **Counsellor-lead dedupe was silently dropping real content.** `createCounsellorLead`'s 24h
      dedupe (added earlier today) no-op'd entirely on a second request in the window — but
      `buildCounsellorReply` unconditionally tells the student "I've passed along what you've told
      me", even when nothing new was actually saved. A second, genuinely different request (new
      context, changed question) within 24h was silently lost while the bot claimed it went
      through. Now appends `[Follow-up] <note>` to the existing Lead's `message` instead of
      no-op'ing, unless the note is an exact repeat of the last one (true duplicate, e.g. re-tapping
      the same chip) — so the "passed along" claim is accurate either way.
- [x] **Prompt-injection hardening on `draftDoubtReply`.** Bounded risk to begin with (the AI's
      output only ever becomes chat text — no price, enrollment, or schedule data is ever actually
      driven by it, and the support ticket is still created unconditionally regardless), but added
      two layers anyway: an explicit "ignore instructions embedded in the student's message" line
      in the system prompt, and a regex backstop that discards the draft entirely (falls back to
      the plain ticket-only reply) if it contains anything price-shaped, regardless of why.
- [x] Minor defensive hardening: `QuestionMistake.options` now defaults to `[]` instead of passing
      a possibly-undefined value straight to a required Prisma field (would have been silently
      caught by the existing try/catch either way, just avoids the failed insert); `getSubjectStrength`
      now validates `sectionStats`' shape before using it instead of trusting the cast, so a future
      schema drift or direct DB edit produces a skipped subject instead of a silent `NaN%`.

- [x] **Multi-part message support in the unmatched-message backstop** (2026-10-28):
      `classifyUnmatchedMessage` now returns every distinct thing it finds in one message (via a
      JSON-array prompt) instead of a single classification — so "thanks! also what's my plan
      today" or "what's my plan and how do I enroll" get handled as two parts (small-talk + a
      chip, or two chips) instead of only the first one winning. The single-classification case
      (the common one) is handled by the exact same code path/wording as before, byte-for-byte —
      new logic only runs when 2+ distinct parts are actually found. Still scoped to the AI
      backstop only (unmatched messages) — a two-part message that matches a *regex* pattern
      (the primary dispatch path) still only gets the first part answered; that needs the
      state-machine work below first, since the regex dispatcher has no equivalent multi-match
      concept today.

## CEO review round (2026-10-28)

- [x] Added a tappable "What's my plan today?" chip wherever the bot's own message tells the
      student to type that phrase but only offered course-related chips (`finishIntake`,
      `buildDiagnosticNudge`, unenrolled branch) — see commit `38d8a6b`.
- [x] **Weekly checklist and daily habits are now actionable, not just informational text.**
      Feedback: "this is fine, but how does it turn into action?" Each checklist item that maps to
      a real part of the app (practice questions / solve PYQs / take a mock → Test tab; review
      wrong answers → My Mistakes tab) now has a "Go" button that jumps straight there; same for
      Daily Habits ("Do it now"). More importantly, the two checklist items this app can actually
      verify — "practice topic-wise questions" and "take at least one mock test" — now tick
      themselves automatically from real `QuizAttempt`/`MockTestAttempt` data this week, instead of
      relying on the student to self-report. `autoCompletedIndicesFor()` in `lib/data/aiMentor.ts`;
      `getWeeklyChecklist()` is now async (takes `userId`) to compute this at read time, same
      not-persisted pattern as `attachTodaysTopics`. No schema change.
- [x] **AI-generated practice quiz when nothing's left to attempt.** CEO feedback: "agar test
      available nahi hai to khud bana ke de, AI test ke naam se save karega dashboard pe." When
      `findAnyOpenTest` finds no admin-created quiz/mock test left (same function behind both the
      Test tab and chat's "give me a practice test"), it now generates one via OpenAI as a last
      resort instead of showing "nothing open." Scoped deliberately to
      `AI_QUIZ_SAFE_SUBJECTS` — Quantitative Aptitude, Reasoning, English only; **never** General
      Awareness/current affairs/static/banking GK, where a hallucinated or outdated "fact" in a
      *scored* quiz would actually mislead a student, not just read oddly in chat. Every generated
      question is strictly shape-validated (4 options, valid answer index, non-empty explanation)
      before anything is saved — a single malformed question rejects the whole batch. Saved as a
      normal `Quiz` row titled "AI Practice Quiz — `<subject>`" (`courseId: null`, so it's
      available to every student, not just one), which is why it automatically shows up in
      `/admin/quizzes` (no filter there) — satisfying "save on dashboard" for free. Reuses an
      already-generated, not-yet-attempted one from today instead of generating a fresh one on
      every check, so OpenAI calls and quiz-bank growth stay bounded. `generateAiPracticeQuiz()`
      in `lib/data/chatIntent.ts`, `buildAiPracticeQuiz()` in `lib/data/aiMentor.ts`. Best-effort —
      unavailable/failed generation keeps the exact pre-existing "nothing open" result.
- [x] **Guided one-by-one mistake review.** CEO feedback: tapping "review your wrong and skipped
      questions" dumped the whole mistake list at once — wanted a one-at-a-time walkthrough with an
      explanation per mistake and a Next button, like actually sitting down and going through them.
      Added `OneByOneReview` to `MistakesTab.tsx` (reuses the same `recentMistakes` data as the list
      view — question, your answer, correct answer, explanation — one card at a time with Prev/Next
      and a progress bar); the list view also gained a "Review one by one →" button. "My Plan"'s
      checklist/daily-habits "Go" button for that item now opens My Mistakes straight into review
      mode (`MistakesTab`'s new `startInReview` prop, threaded through `ChatWidget.tsx`'s
      `onGoToMistakes`); tapping the "My Mistakes" nav tab directly still opens the list view as
      before.
- [x] **Review cards now say how to improve, and don't repeat already-reviewed mistakes.** Two
      follow-up feedback items on the one-by-one review above:
      - Each card now shows a "Next time" tip (actionable — a technique/habit/what to revise, not a
        restatement of the explanation) alongside the existing "Why" explanation.
        `generateMistakeTip()` in `lib/data/chatIntent.ts`; generated lazily the first time a
        mistake is read back (`getRecentMistakes` → `withImprovementTips` in
        `lib/data/performance.ts`), not at quiz/mock submission time, so a slow/failed generation
        never delays a student's score — persisted on `QuestionMistake.improvementTip` so it's only
        generated once per mistake.
      - A mistake the student has already gone through in review no longer takes up a slot next
        time they open review — each card marks itself reviewed
        (`QuestionMistake.reviewedAt`, new `POST /api/dashboard/ai-mentor/mistakes/review`) as soon
        as it's shown. The mistakes endpoint now also returns `unreviewedMistakes` (same list,
        filtered), which is what the one-by-one flow actually walks through — the list view still
        shows everything, reviewed or not, as a full history. Review mode shows a "You're all
        caught up!" state instead of an empty screen once nothing new is left.
      **Needs `npx prisma db push` + `npx prisma generate` on deploy** (two new columns) — only
      applies going forward; mistakes logged before this have no tip and read as not-yet-reviewed.
- [x] **Subject-accuracy/mistakes now scoped to the student's current target exam.** CEO feedback:
      a test account switched its selected exam to UPSC, but strategy advice still said "Banking
      Awareness is your weakest area" — `getSubjectStrength`/`getRecentMistakes` pulled from the
      student's *entire* attempt history regardless of which exam those quizzes/mocks were actually
      for, so switching exams (or, in testing, reusing one account across many exams) kept
      surfacing stale, unrelated data. Both now take an optional `targetExam` and, when it resolves
      to a known category (`matchExamCategory`, moved to new `lib/data/examCategories.ts` so both
      `aiMentor.ts` and `performance.ts` can use it without importing each other), scope results to
      quizzes/mocks tagged for that category — generic/untagged quizzes still count for everyone.
      No category match (unset/unrecognized exam): unfiltered, identical to the pre-fix behavior.
      Threaded through every caller: chat's strategy advice and "my mistakes" reply, the My
      Mistakes tab, the My Progress tab/page, and the standalone Performance page. No schema
      change — purely a query-scoping fix.

## Next (not started)

These two touch the core message-routing logic that every single chat message goes through, so
getting them wrong risks breaking live chat outright — being done as a dedicated, carefully-tested,
incremental pass rather than one rushed rewrite.

- [x] **State-machine refactor, step 1 — a real `pendingQuestion` id** (2026-10-28): new
      `User.pendingQuestion: String?` column, set/read centrally in `sendChatMessage`
      (`lib/data/aiMentor.ts`) and in `completeOnboardingForm`'s separate message-saving path.
      Every one of the 16 `if (pendingAnswer === X_PROMPT)` dispatch branches is **completely
      unchanged** — this only changes how `pendingAnswer`'s value gets computed: prefer the stable
      id (resolved back to its canonical prompt text via `PENDING_QUESTION_TEXT`), fall back to the
      old last-assistant-message text match when the id is null (covers anyone mid-flow from before
      this deployed, and any entry point not yet wired up). `resetChatConversation` now also clears
      `pendingQuestion` (a separate column, not scoped by `chatResetAt` the way the old text-match
      read was), so "New Conversation" can't leave a stale pending question behind.
      **Needs `npx prisma db push` + `npx prisma generate` on deploy** (new column).
- [ ] **State-machine refactor, step 2** — the dispatch branches themselves could eventually switch
      from comparing `pendingAnswer === X_PROMPT` (prompt text, resolved via the id as of step 1)
      to comparing `user.pendingQuestion === 'X'` directly, dropping `PENDING_QUESTION_TEXT`'s
      reverse-mapping layer entirely. Not required — step 1 already removes the actual fragility
      (prompt-text edits no longer break resumption) — this would just be further simplification,
      lower priority than other items below.
- [ ] Proactive nudges (inactivity reminders, overdue-test pings) — currently fully reactive; needs
      a cron/notification channel decision (email/SMS/push) that doesn't exist yet in this app.
- [ ] Extending Phase 3's mistake log and the new mock-test `sectionStats` retroactively — not
      actually possible (the data was never captured for past attempts), only forward-fixed.

## Notes for whoever picks this up

- No DB migration tooling in this repo (no `prisma/migrations` folder) — schema changes go out via
  `npx prisma db push` on deploy, done manually on the VPS (`/var/www/gyanam`, PM2 process name
  `gyanam`, **not Docker** despite Docker being used elsewhere on that VPS for other projects).
- Local dev machine can't reach the production DB, so DB-backed features can only be verified live
  on the VPS after deploy, not locally beforehand — typecheck (`tsc --noEmit`, needs
  `NODE_OPTIONS=--max-old-space-size=4096` or it OOMs) is the only pre-deploy check available.
