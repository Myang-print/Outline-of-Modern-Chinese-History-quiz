# `src/lib/`

Frontend utility modules.

## Files

- `questions.ts`: Loads generated question data and exposes chapter/query helpers.
- `progress.ts`: Handles local progress persistence, answer comparison, and chapter-level reset logic.

## Update Rules

- Keep modules here framework-light and mostly pure.
- `progress.ts` is the only current frontend module that should directly touch `localStorage`.
- Do not put React components in this directory.
- Do not put raw question-bank parsing logic here.
