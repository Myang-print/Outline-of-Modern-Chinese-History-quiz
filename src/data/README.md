# `src/data/`

Generated frontend-ready data.

## Files

- `questionBank.json`: Generated question list imported by `src/lib/questions.ts`.

## Update Rules

- Do not edit `questionBank.json` by hand.
- Regenerate it with:

```bash
npm run parse:bank
```

- Source data lives under `data/raw/`, `data/annotations/`, and `data/processed/`.
- This directory exists so the browser app can import static JSON without parsing source documents at runtime.
