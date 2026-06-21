import type { AnswerStatus, Question } from "../types";

type SidebarProps = {
  chapters: string[];
  currentChapter: string;
  currentQuestionId?: string;
  getChapterQuestions: (chapter: string) => Question[];
  onSelectChapter: (chapter: string) => void;
  onSelectQuestion: (questionId: string) => void;
  statusForQuestion: (question: Question) => AnswerStatus;
  totalQuestions: number;
};

export function Sidebar({
  chapters,
  currentChapter,
  currentQuestionId,
  getChapterQuestions,
  onSelectChapter,
  onSelectQuestion,
  statusForQuestion,
  totalQuestions,
}: SidebarProps) {
  return (
    <aside className="sidebar" aria-label="专题与题号">
      <div className="brand">
        <span className="brand-mark">史</span>
        <div>
          <h1>近代史纲要刷题</h1>
          <p>{totalQuestions} 道题</p>
        </div>
      </div>

      <nav className="chapter-list">
        {chapters.map((chapter) => {
          const chapterItems = getChapterQuestions(chapter);
          const done = chapterItems.filter((question) => statusForQuestion(question) !== "unanswered").length;
          return (
            <section className="chapter-group" key={chapter}>
              <button
                className={`chapter-button ${chapter === currentChapter ? "is-active" : ""}`}
                onClick={() => onSelectChapter(chapter)}
                type="button"
              >
                <span>{chapter}</span>
                <strong>
                  {done}/{chapterItems.length}
                </strong>
              </button>
              {chapter === currentChapter ? (
                <div className="question-grid">
                  {chapterItems.map((question, index) => (
                    <button
                      className={`question-dot status-${statusForQuestion(question)} ${
                        question.id === currentQuestionId ? "is-current" : ""
                      }`}
                      key={question.id}
                      onClick={() => onSelectQuestion(question.id)}
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
  );
}
