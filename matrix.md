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
| Explanation fields | Done | 941 questions include explanations and exam points |
| Quiz UI | Done | Sidebar, question area, answer feedback |
| localStorage progress | Done | `src/lib/progress.ts` |
| Topic reset | Done | Current chapter records can be cleared |
| UI component split | Done | `src/App.tsx` and `src/components/` |
| State hooks | Done | `src/hooks/` separates progress and navigation state |
| Script modularization | Done | `scripts/lib/` separates parsing, validation, annotations, docs, and output |
| Style organization | Done | `src/styles/` split by style responsibility |
| Subject model | Done | `src/lib/subjects.ts` registers the first subject |
| Subject entry page | Done | `src/components/SubjectSelector.tsx` provides the multi-subject app entry |
| Subject-scoped progress | Done | `quiz-progress:${subjectId}:v1` localStorage key with legacy migration |
| Multi-subject roadmap | Done | `docs/ROADMAP.md` documents the expansion path |
| Build verification | Done | `npm run build` passed |
