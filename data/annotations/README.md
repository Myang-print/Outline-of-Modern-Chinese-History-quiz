# `data/annotations/`

Explanation and exam-point annotations merged into generated question data.

## Files

- `综述-风云变幻的八十年.json`: Manual, higher-quality annotations for the first overview chapter.
- `auto-generated-remaining.json`: Baseline generated annotations for the remaining questions.

## Data Shape

Each record uses:

```json
{
  "id": "question-id",
  "explanation": "Short explanation shown after answering.",
  "examPoints": ["Exam point 1", "Exam point 2"]
}
```

## Update Rules

- Prefer manual chapter files when improving quality.
- Avoid duplicate IDs across annotation files. If a question is manually refined, remove or override the matching generated entry intentionally.
- Do not put answer corrections here; answers belong to parsed question data and must be checked separately.
