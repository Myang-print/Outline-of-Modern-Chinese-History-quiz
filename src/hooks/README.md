# `src/hooks/`

React hooks for app-level quiz state.

## Files

- `useQuestionNavigation.ts`: Current chapter, current question, current subject question list, and draft multiple-choice selection.
- `useQuizProgress.ts`: Subject-scoped persisted answer progress, answer submission, chapter reset, and progress summaries.

## Update Rules

- Hooks may compose `src/lib/` helpers and React state.
- Hooks may own browser state side effects when that is their explicit responsibility.
- UI components should receive hook output through props instead of importing these hooks directly.
- Keep raw question-bank parsing out of hooks.
