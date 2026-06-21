import React from "react";
import { createRoot } from "react-dom/client";
import { Check, RotateCcw, X } from "lucide-react";
import { chapters, getQuestionsByChapter, questions, questionTypeLabel, answerText } from "./lib/questions";
import { clearChapterProgress, createProgressRecord, loadProgress, saveProgress } from "./lib/progress";
import type { AnswerStatus, ProgressState, Question } from "./types";
import "./styles.css";

function statusFor(question: Question, progress: ProgressState): AnswerStatus {
  return progress[question.id]?.status ?? "unanswered";
}

function App() {
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
      <aside className="sidebar" aria-label="专题与题号">
        <div className="brand">
          <span className="brand-mark">史</span>
          <div>
            <h1>近代史纲要刷题</h1>
            <p>{questions.length} 道题</p>
          </div>
        </div>

        <nav className="chapter-list">
          {chapters.map((item) => {
            const chapterItems = getQuestionsByChapter(item);
            const done = chapterItems.filter((question) => statusFor(question, progress) !== "unanswered").length;
            return (
              <section className="chapter-group" key={item}>
                <button
                  className={`chapter-button ${item === chapter ? "is-active" : ""}`}
                  onClick={() => setChapter(item)}
                  type="button"
                >
                  <span>{item}</span>
                  <strong>
                    {done}/{chapterItems.length}
                  </strong>
                </button>
                {item === chapter ? (
                  <div className="question-grid">
                    {chapterItems.map((question, index) => (
                      <button
                        className={`question-dot status-${statusFor(question, progress)} ${
                          question.id === current?.id ? "is-current" : ""
                        }`}
                        key={question.id}
                        onClick={() => setQuestionId(question.id)}
                        type="button"
                        title={`第 ${question.number} 题`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                ) : null}
              </section>
            );
          })}
        </nav>
      </aside>

      <section className="content">
        <header className="topbar">
          <div>
            <p className="chapter-name">{chapter}</p>
            <h2>
              已完成 {answeredCount}/{chapterQuestions.length}，正确 {correctCount}
            </h2>
          </div>
          <button className="ghost-button" onClick={resetChapter} type="button">
            <RotateCcw size={16} />
            清空本专题记录
          </button>
        </header>

        {current ? (
          <article className="question-panel">
            <div className="question-meta">
              <span>{questionTypeLabel(current.type)}</span>
              <span>
                第 {currentIndex + 1} / {chapterQuestions.length} 题
              </span>
            </div>

            <h3>{current.stem}</h3>

            <div className="options">
              {current.options.map((option) => {
                const isSelected = selected.includes(option.label);
                const isAnswer = current.answer.includes(option.label);
                const showResult = Boolean(currentRecord);
                return (
                  <button
                    className={[
                      "option-button",
                      isSelected ? "is-selected" : "",
                      showResult && isAnswer ? "is-answer" : "",
                      showResult && isSelected && !isAnswer ? "is-wrong-choice" : "",
                    ].join(" ")}
                    key={option.label}
                    onClick={() => handleOptionClick(option.label)}
                    type="button"
                  >
                    <span className="option-label">{option.label}</span>
                    <span>{option.text}</span>
                  </button>
                );
              })}
            </div>

            {current.type === "multiple" ? (
              <button
                className="primary-button"
                disabled={draftSelection.length === 0}
                onClick={() => answerQuestion(draftSelection)}
                type="button"
              >
                提交答案
              </button>
            ) : null}

            <div className={`feedback ${currentRecord ? currentRecord.status : ""}`} aria-live="polite">
              {currentRecord ? (
                <>
                  {currentRecord.status === "correct" ? <Check size={18} /> : <X size={18} />}
                  <span>
                    {currentRecord.status === "correct" ? "回答正确" : `回答错误，正确答案：${answerText(current.answer)}`}
                  </span>
                </>
              ) : (
                <span>选择答案后会显示判断结果。</span>
              )}
            </div>

            <footer className="question-actions">
              <button
                className="secondary-button"
                disabled={currentIndex <= 0}
                onClick={() => setQuestionId(chapterQuestions[currentIndex - 1].id)}
                type="button"
              >
                上一题
              </button>
              <button
                className="secondary-button"
                disabled={currentIndex >= chapterQuestions.length - 1}
                onClick={() => setQuestionId(chapterQuestions[currentIndex + 1].id)}
                type="button"
              >
                下一题
              </button>
            </footer>
          </article>
        ) : (
          <article className="empty-state">暂无题目，请先运行 npm run parse:bank。</article>
        )}
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
