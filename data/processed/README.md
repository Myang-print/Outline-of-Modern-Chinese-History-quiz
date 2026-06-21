# `data/processed/`

Generated structured outputs from the raw question bank and annotations.

## Files

- `question-bank.json`: Full structured question list.
- `summary.json`: Question counts, excluded count, annotation coverage, and validation issue count.
- `excluded-questions.json`: Known non-practice questions excluded from the app.
- `chapters/`: Per-chapter JSON splits for review and batch work.

## Update Rules

- Do not edit files here manually.
- Regenerate with:

```bash
npm run parse:bank
```

- If output shape changes, update `src/types.ts`, `src/lib/questions.ts`, and relevant README files together.
