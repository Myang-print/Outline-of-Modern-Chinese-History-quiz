# `src/`

Frontend application source for the quiz app.

## Structure

- `main.tsx`: React entrypoint. It currently mounts the app and contains the main quiz UI composition.
- `styles.css`: Global app styles for layout, quiz controls, status colors, feedback, and responsive behavior.
- `types.ts`: Shared TypeScript types for questions, options, answer status, and persisted progress.
- `data/`: Static generated question-bank data consumed by the frontend.
- `lib/`: Pure data and local persistence helpers.
- `components/`: Reserved for focused React components as the UI is split out of `main.tsx`.

## Update Rules

- Keep browser-facing app behavior in `src/`.
- Do not parse raw `.txt` files here. The frontend must consume generated JSON only.
- Prefer small component modules under `components/` when adding UI.
- Prefer pure helpers under `lib/` for reusable state/data logic.
