# `src/styles/`

CSS modules imported by `src/styles.css`.

## Files

- `base.css`: Global reset, font stack, and design tokens.
- `layout.css`: App shell, subject selector, content region, and topbar layout.
- `sidebar.css`: Sidebar, chapter list, question grid, and status colors.
- `buttons.css`: Shared button styles and button variants.
- `question.css`: Question panel, options, feedback, analysis box, and navigation actions.
- `responsive.css`: Responsive overrides.

## Update Rules

- Keep `src/styles.css` as the single CSS entrypoint imported by `main.tsx`.
- Prefer moving selectors into the file that owns their visible region.
- Do not change UI behavior or visual design when only reorganizing style structure.
