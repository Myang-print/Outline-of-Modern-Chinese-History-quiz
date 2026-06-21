# `scripts/lib/`

Internal modules for question-bank processing scripts.

## Files

- `paths.mjs`: Centralized project output/input paths.
- `constants.mjs`: Regexes, type labels, and known excluded-question rules.
- `text.mjs`: Text normalization, slug generation, and small collection helpers.
- `parse.mjs`: Raw `.txt` parsing into structured question records.
- `validation.mjs`: Question validation and non-practice exclusion handling.
- `annotations.mjs`: Loading and merging explanation/exam-point annotation files.
- `documents.mjs`: Markdown report, review, and study-note builders.
- `output.mjs`: Directory creation and generated file writing.

## Update Rules

- Keep CLI entrypoints in `scripts/`; keep reusable implementation here.
- Preserve generated output paths unless frontend imports and documentation are updated together.
- Do not put browser code in this directory.
