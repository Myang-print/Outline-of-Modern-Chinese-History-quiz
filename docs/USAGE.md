# Usage Guide

This document explains how to run, preview, and verify the quiz app.

## 🚀 Start the App

Install dependencies once:

```bash
npm install
```

Start the local dev server:

```bash
npm run dev
```

Open the URL printed by Vite:

```text
http://127.0.0.1:4173/
```

The dev server keeps running until you stop it with `Ctrl + C`.

## ⌨️ Study Controls

- `←` / `→`: Previous or next question.
- `A` to `D`: Select the matching answer option.
- `1` to `9`: Select the matching option by position.
- `Enter`: Submit a multiple-choice question.
- `Alt + 1`: Open the sidebar.
- `Shift + Esc`: Collapse the sidebar.

The app stores the current study position per subject. Re-entering a subject opens the last unfinished question, or the next unanswered question after it.

On narrow screens, the sidebar starts collapsed while question numbers remain readable. Click the chapter title badge in the top-right area to open or collapse the sidebar.

## 🧯 If Dev Server Fails

Some Windows environments reject Vite's default `localhost` / IPv6 binding. This project binds dev mode to `127.0.0.1:4173`.

If `npm run dev` still fails, use the production preview path:

```bash
npm run build
npm run preview:local
```

Then open:

```text
http://127.0.0.1:4174/
```

## 🧩 Command Reference

### `npm install`

Installs project dependencies into `node_modules/`.

Run this after cloning the repository or when `package.json` / `package-lock.json` changes.

### `npm run dev`

Starts the Vite development server at:

```text
http://127.0.0.1:4173/
```

Use this for normal development and manual app testing.

### `npm run build`

Runs TypeScript checks and builds the production files into `dist/`.

This does not start a server. It only proves the app can be built for deployment or preview.

### `npm run preview:local`

Serves the already-built `dist/` output at:

```text
http://127.0.0.1:4174/
```

Run `npm run build` before this command.

### `npm run annotate:remaining`

Generates baseline explanations and exam points for questions that do not have manual annotations.

Run this when raw question data, answer data, or annotation-generation logic changes.

### `npm run parse:bank`

Parses the raw `.txt`, merges annotations, validates questions, and generates frontend/review data.

This writes files under:

- `data/processed/`
- `src/data/`
- `docs/question-bank/`

## ✅ Full Verification

Before handing off or committing a meaningful change, run:

```bash
npm run annotate:remaining
npm run parse:bank
npm run build
```

Why all three?

- `annotate:remaining` confirms explanation generation still works.
- `parse:bank` confirms structured question data and review documents can be regenerated.
- `build` confirms the frontend compiles and production assets can be created.
