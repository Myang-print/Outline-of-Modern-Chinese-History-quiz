# `docs/question-bank/`

Generated question-bank review and study documents.

## File Types

- `*-check.md`: Per-chapter format and consistency reports.
- `*-review.md`: Per-chapter review drafts with stem, options, answer, explanation, and exam points.
- `*-notes.md`: Per-chapter study notes extracted from the question bank.

## Update Rules

- Do not manually edit generated chapter documents.
- Regenerate with:

```bash
npm run parse:bank
```

- Improve explanations in `data/annotations/`, then regenerate.
- Fix parsing problems in `scripts/parse-question-bank.mjs`, then regenerate.
