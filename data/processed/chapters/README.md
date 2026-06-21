# `data/processed/chapters/`

Generated per-chapter question-bank JSON files.

## Purpose

These files make it easier to review, inspect, or batch-process one chapter at a time without opening the full `question-bank.json`.

## Update Rules

- Do not edit these files manually.
- Regenerate them with:

```bash
npm run parse:bank
```

- Use these files for review and diagnostics; the frontend currently imports `src/data/questionBank.json`.
