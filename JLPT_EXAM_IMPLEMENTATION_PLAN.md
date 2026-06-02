# JLPT Exam Web App — Step-by-Step Execution Plan
Tech Stack: Next.js 14+ (App Router) + TypeScript + Tailwind CSS + Zustand

---


## Task 0.1 — Install Dependencies

Install:

- zustand (state management)
- clsx
- lucide-react (icons)
- @radix-ui/react-icons (optional)
- shadcn/ui (initialize)

Verify:
- App compiles successfully

---

# PHASE 1 — Architecture & Types

## Task 1.1 — Define Types

Create: `app/types/exam.ts`

Define:

- SectionType (vocabulary | grammar | reading | listening)
- Question interface
- ExamState interface
- AnswerMap type

All types must be strict.

---

## Task 1.2 — Create Mock Data

Create: `app/data/questions.ts`

Add:
- Minimum 12 questions
  - 3 vocabulary
  - 3 grammar
  - 3 reading
  - 3 listening
- Include:
  - passage for reading
  - audioUrl placeholder for listening
  - correctIndex
  - explanation

Export grouped by section.

---

# PHASE 2 — Global Exam Store

## Task 2.1 — Create Zustand Store

Create: `app/store/exam-store.ts`

State must include:

- selectedLevel
- currentSection
- currentQuestionIndex
- answers: Record<string, number>
- flagged: Set<string>
- timeRemaining
- isSubmitted
- score

Actions:

- selectLevel(level)
- selectAnswer(questionId, index)
- toggleFlag(questionId)
- nextQuestion()
- prevQuestion()
- jumpToQuestion(index)
- calculateScore()
- submitExam()
- startTimer()
- tick()
- resetExam()

Timer logic must:
- Auto-submit at 0
- Use safe cleanup

---

# PHASE 3 — Routing Structure (App Router)

Create:

app/
  page.tsx (Landing)
  /exam
    page.tsx
  /review
    page.tsx
  /results
    page.tsx
  /results/[questionId]
    page.tsx

Each route must render minimal placeholder UI first.

Verify navigation works before proceeding.

---

# PHASE 4 — Core UI Components

All components must be reusable and isolated.

---

## Task 4.1 — ExamHeader

Create: `components/exam/ExamHeader.tsx`

Include:
- Section label
- Question progress (Q x / total)
- Timer (MM:SS)
- Progress bar

Must re-render efficiently.

---

## Task 4.2 — Timer Component

Create: `components/exam/Timer.tsx`

Requirements:
- Controlled by Zustand
- useEffect interval
- Cleanup on unmount
- Format MM:SS

---

## Task 4.3 — OptionCard

Create: `components/exam/OptionCard.tsx`

Props:
- text
- selected
- onClick
- disabled

States:
- default
- hover
- selected
- correct (results mode)
- incorrect

---

## Task 4.4 — QuestionCard

Create: `components/exam/QuestionCard.tsx`

Handle:
- Question text
- Passage (if exists)
- Audio player (if listening)
- 4 OptionCards
- Mark for review toggle

---

## Task 4.5 — AudioPlayer

Create: `components/exam/AudioPlayer.tsx`

Features:
- Play/Pause
- Seek bar
- Playback speed selector
- Accessible labels
- No external library

---

## Task 4.6 — NavigatorGrid

Create: `components/exam/NavigatorGrid.tsx`

Grid of numbered buttons.

States:
- current
- answered
- flagged
- unanswered

Click jumps to question.

---

# PHASE 5 — Build Exam Page

## Task 5.1 — Assemble Exam Page

File: `/app/exam/page.tsx`

Must include:

- ExamHeader
- QuestionCard
- NavigatorGrid
- Next / Previous buttons

Keyboard shortcuts:
- 1–4 select answer
- ArrowLeft/ArrowRight navigation

---

# PHASE 6 — Review Page

## Task 6.1 — Review Implementation

File: `/app/review/page.tsx`

Features:
- NavigatorGrid
- Filters (All / Answered / Flagged / Unanswered)
- Submit button
- Confirmation modal

On submit:
- Call calculateScore()
- Navigate to results

---

# PHASE 7 — Results Page

## Task 7.1 — Results Summary

File: `/app/results/page.tsx`

Display:
- Total score
- Percentage
- Section breakdown
- Pass / Fail badge

Button:
- Review explanations

---

## Task 7.2 — Explanation Page

File: `/app/results/[questionId]/page.tsx`

Display:
- Question
- User answer
- Correct answer
- Explanation
- Back button

---

# PHASE 8 — UX Enhancements

## Task 8.1 — Autosave

- Persist exam state in localStorage
- Restore on refresh

---

## Task 8.2 — Auto Submit on Timeout

- If timeRemaining === 0
- Trigger submitExam()
- Redirect to results

---

## Task 8.3 — Accessibility

- aria-label on buttons
- Focus ring styles
- Min tap size 44px
- Proper semantic HTML

---

# PHASE 9 — Optimization & Cleanup

- Remove unused renders
- Memoize heavy components
- Ensure no memory leaks
- Ensure store resets correctly

---

# FINAL VALIDATION CHECKLIST

- [ ] Timer works
- [ ] Navigation works
- [ ] Score calculates correctly
- [ ] Listening audio works
- [ ] Reading passage layout correct
- [ ] Responsive layout works
- [ ] No console errors
- [ ] localStorage restore works
- [ ] Auto-submit works
- [ ] Explanation routing works

---

END OF IMPLEMENTATION PLAN