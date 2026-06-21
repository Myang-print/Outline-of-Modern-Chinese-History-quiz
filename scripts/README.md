# `scripts/`

Node.js scripts for question-bank processing.

## Files

- `parse-question-bank.mjs`: Parses the raw `.txt` question bank, filters known non-practice questions, merges annotations, validates output, and writes generated data/docs.
- `generate-auto-annotations.mjs`: Generates baseline explanations and exam points for questions that do not have manual annotations.

## Commands

```bash
npm run annotate:remaining
npm run parse:bank
```

## Update Rules

- Scripts are build-time tooling, not browser code.
- Keep output paths stable unless the frontend and docs are updated together.
- `parse-question-bank.mjs` is the source of truth for generated data shape.
- Do not automatically change correct answers based on historical reasoning; only validate format and consistency.
