# Question Bank Pipeline

The app does not parse the raw `.txt` file in the browser. The source question bank is processed ahead of time into generated JSON.

## 🗂️ Inputs

### `data/raw/`

Stores the original PDF-to-text source file.

Current source:

- `data/raw/中国近代史纲要题库-1.txt`

Keep this file close to the original conversion. Page numbers, blank lines, and PDF wrapping noise should be handled by scripts, not manually cleaned here.

### `data/annotations/`

Stores explanation and exam-point annotations.

Current files:

- `综述-风云变幻的八十年.json`: manual high-quality annotations for the first overview chapter.
- `auto-generated-remaining.json`: generated baseline annotations for the remaining questions.

Annotation shape:

```json
{
  "id": "question-id",
  "explanation": "Short explanation shown after answering.",
  "examPoints": ["Exam point 1", "Exam point 2"]
}
```

## ⚙️ Processing Commands

Generate baseline annotations:

```bash
npm run annotate:remaining
```

Generate structured data and reports:

```bash
npm run parse:bank
```

## 📦 Outputs

### `data/processed/`

Generated structured data:

- `question-bank.json`: full structured question bank.
- `summary.json`: counts, annotation coverage, and validation issue count.
- `excluded-questions.json`: known non-practice questions excluded from the app.
- `chapters/*.json`: per-chapter JSON splits.

### `src/data/`

Frontend-ready generated data:

- `questionBank.json`: imported by the React app.

### `docs/question-bank/`

Generated review and study documents:

- `*-check.md`: format and consistency report.
- `*-review.md`: question-by-question review draft with stem, options, answer, explanation, and exam points.
- `*-notes.md`: study notes extracted from the question bank.

## ✅ Current Summary

Latest expected summary:

- 941 practice questions.
- 13 chapters/topics.
- 941 annotated questions.
- 1 excluded non-practice question.
- 0 validation issues.

## 🛠️ Maintenance Rules

- Do not edit generated files by hand.
- Improve explanations in `data/annotations/`, then run `npm run parse:bank`.
- Fix parsing problems in `scripts/lib/`, then run `npm run parse:bank`.
- Do not automatically change correct answers based on historical reasoning; only validate format and consistency unless a human explicitly confirms an answer correction.
