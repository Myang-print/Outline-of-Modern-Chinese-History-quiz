# Roadmap

This project is moving from a single-subject local quiz app toward a multi-subject study platform.

## Current Foundation

- A `Subject` model exists in the frontend.
- The current question bank is registered as the first subject: `modern-history`.
- Question data is normalized with `subjectId` at runtime for backward compatibility.
- Progress storage is scoped by subject through `quiz-progress:${subjectId}:v1`.
- The previous single-subject progress key is migrated for the current subject.

## Next Milestones

1. Add a second subject using the same subject registration shape.
2. Move generated question data toward per-subject or per-chapter async loading.
3. Add wrong-question and favorite-question records under subject-scoped progress.
4. Add search, filters, and practice modes.
5. Add import/export for local progress data.
6. Add parser configuration so each subject can define its own chapter and question rules.
7. Add CI checks and a public deployment.

## Implementation Rules

- New user progress must always be scoped by subject id.
- New question data should include `subjectId`; old data may be normalized when loaded.
- Do not introduce a backend until local data and import/export workflows are insufficient.
- Prefer adding one capability at a time with build verification after each step.
