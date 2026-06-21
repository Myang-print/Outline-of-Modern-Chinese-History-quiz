# `data/raw/`

Raw source files for the question bank.

## Files

- `中国近代史纲要题库-1.txt`: Original PDF-to-text conversion used as the current source.

## Update Rules

- Keep raw source files as close to the original conversion as possible.
- Do not manually clean page numbers, blank lines, or broken wrapping here.
- Noise from PDF conversion should be handled by parser scripts.
- If a new raw source file is added, update `scripts/parse-question-bank.mjs` or add a new parser path deliberately.
