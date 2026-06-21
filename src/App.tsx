import React from "react";
import { Sidebar } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";
import { QuestionPanel } from "./components/QuestionPanel";
import { chapters, getQuestionsByChapter, questions } from "./lib/questions";
import { clearChapterProgress, createProgressRecord, loadProgress, saveProgress } from "./lib/progress";
import type { AnswerStatus, ProgressState, Question } from "./types";

function statusFor(question: Question, progress: ProgressState): AnswerStatus {
  return progress[question.id]?.status ?? "unanswered";
}

export function App() {
  const [progress, setProgress] = React.useState<ProgressState>(() => loadProgress());
  const [chapter, setChapter] = React.useState(() => chapters[0] ?? "");
  const chapterQuestions = React.useMemo(() => getQuestionsByChapter(chapter), [chapter]);
  const [questionId, setQuestionId] = React.useState(() => chapterQuestions[0]?.id ?? "");
  const current = chapterQuestions.find((question) => question.id === questionId) ?? chapterQuestions[0] ?? questions[0];
  const currentIndex = chapterQuestions.findIndex((question) => question.id === current?.id);
  const [draftSelection, setDraftSelection] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (!chapterQuestions.some((question) => question.id === questionId)) {
      setQuestionId(chapterQuestions[0]?.id ?? "");
    }
  }, [chapterQuestions, questionId]);

  React.useEffect(() => {
    setDraftSelection(progress[current?.id ?? ""]?.selected ?? []);
  }, [current?.id, progress]);

  function updateProgress(next: ProgressState) {
    setProgress(next);
    saveProgress(next);
  }

  function answerQuestion(selected: string[]) {
    if (!current) return;
    updateProgress({
      ...progress,
      [current.id]: createProgressRecord(selected, current.answer),
    });
  }

  function handleOptionClick(label: string) {
    if (!current) return;
    if (current.type === "multiple") {
      setDraftSelection((selected) =>
        selected.includes(label) ? selected.filter((item) => item !== label) : [...selected, label].sort(),
      );
      return;
    }
    answerQuestion([label]);
  }

  function resetChapter() {
    updateProgress(clearChapterProgress(progress, questions, chapter));
  }

  const answeredCount = chapterQuestions.filter((question) => statusFor(question, progress) !== "unanswered").length;
  const correctCount = chapterQuestions.filter((question) => statusFor(question, progress) === "correct").length;
  const currentRecord = current ? progress[current.id] : undefined;
  const selected = current?.type === "multiple" ? draftSelection : currentRecord?.selected ?? [];

  return (
    <main className="app-shell">
      <Sidebar
        chapters={chapters}
        currentChapter={chapter}
        currentQuestionId={current?.id}
        getChapterQuestions={getQuestionsByChapter}
        onSelectChapter={setChapter}
        onSelectQuestion={setQuestionId}
        progress={progress}
        statusFor={statusFor}
        totalQuestions={questions.length}
      />

      <section className="content">
        <Topbar
          answeredCount={answeredCount}
          chapter={chapter}
          correctCount={correctCount}
          questionCount={chapterQuestions.length}
          onResetChapter={resetChapter}
        />

        {current ? (
          <QuestionPanel
            currentRecord={currentRecord}
            draftSelection={draftSelection}
            onAnswer={answerQuestion}
            onOptionClick={handleOptionClick}
            onSelectQuestion={setQuestionId}
            question={current}
            questionCount={chapterQuestions.length}
            questionIndex={currentIndex}
            questions={chapterQuestions}
            selected={selected}
          />
        ) : (
          <article className="empty-state">暂无题目，请先运行 npm run parse:bank。</article>
        )}
      </section>
    </main>
  );
}
