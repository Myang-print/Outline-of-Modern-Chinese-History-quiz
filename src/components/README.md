# `src/components/`

React UI components for the quiz app.

## Structure

- `Sidebar.tsx`: Chapter list and question-number status grid.
- `Topbar.tsx`: Current chapter summary and reset action.
- `QuestionPanel.tsx`: Question stem, options, answer submission, and navigation.
- `AnalysisBox.tsx`: Explanation and exam-point display after answering.

## Update Rules

- Components should receive data and callbacks through props.
- Components should not directly read or write `localStorage`.
- Components should not import the full question bank unless they are app-level composition modules.
- Keep visual state names aligned with `src/styles.css`.
