# Implementation Matrix

| Item | Status | Evidence |
| --- | --- | --- |
| Project scaffold | Done | React + Vite + TypeScript files created |
| README.md | Done | Includes usage, directory layout, data flow |
| AGENT.md | Done | Includes data/UI/verification rules |
| Raw question bank copy | Done | `data/raw/中国近代史纲要题库-1.txt` |
| Parser script | Done | `scripts/parse-question-bank.mjs` |
| Processed JSON | Done | 941 questions, 13 chapters, 0 issues |
| Chapter reports | Done | Generated under `docs/question-bank/` |
| Knowledge notes | Done | Generated under `docs/question-bank/` |
| Chapter split files | Done | Generated under `data/processed/chapters/` |
| Excluded questions | Done | 1 non-practice question excluded |
| Explanation fields | In progress | First chapter manually annotated; remaining questions covered by generated base annotations |
| Quiz UI | Done | Sidebar, question area, answer feedback |
| localStorage progress | Done | `src/lib/progress.ts` |
| Topic reset | Done | Current chapter records can be cleared |
| Build verification | Done | `npm run build` passed |
