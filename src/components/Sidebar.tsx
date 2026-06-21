import React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { AnswerStatus, Question } from "../types";

type SidebarProps = {
  chapters: string[];
  currentChapter: string;
  currentQuestionId?: string;
  getChapterQuestions: (chapter: string) => Question[];
  onSelectChapter: (chapter: string) => void;
  onSelectQuestion: (questionId: string) => void;
  statusForQuestion: (question: Question) => AnswerStatus;
};

export function Sidebar({
  chapters,
  currentChapter,
  currentQuestionId,
  getChapterQuestions,
  onSelectChapter,
  onSelectQuestion,
  statusForQuestion,
}: SidebarProps) {
  const [expandedChapters, setExpandedChapters] = React.useState<Set<string>>(() => new Set([currentChapter]));

  React.useEffect(() => {
    setExpandedChapters((expanded) => new Set(expanded).add(currentChapter));
  }, [currentChapter]);

  function toggleChapter(chapter: string) {
    setExpandedChapters((expanded) => {
      const next = new Set(expanded);
      if (next.has(chapter)) {
        next.delete(chapter);
      } else {
        next.add(chapter);
      }
      return next;
    });
  }

  return (
    <aside className="sidebar" aria-label="专题与题号">
      <nav className="chapter-list">
        {chapters.map((chapter) => {
          const chapterItems = getChapterQuestions(chapter);
          const done = chapterItems.filter((question) => statusForQuestion(question) !== "unanswered").length;
          const isExpanded = expandedChapters.has(chapter);
          return (
            <section className="chapter-group" key={chapter}>
              <div className={`chapter-row ${chapter === currentChapter ? "is-active" : ""}`}>
                <button className="chapter-button" onClick={() => onSelectChapter(chapter)} type="button">
                  <span>{chapter}</span>
                  <strong>
                    {done}/{chapterItems.length}
                  </strong>
                </button>
                <button
                  aria-label={isExpanded ? `收起 ${chapter}` : `展开 ${chapter}`}
                  className="chapter-collapse-button"
                  onClick={() => toggleChapter(chapter)}
                  type="button"
                >
                  {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
              </div>
              {isExpanded ? (
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
                      aria-label={`${chapter} 第 ${question.number} 题，${statusForQuestion(question)}`}
                    >
                      <span>{index + 1}</span>
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
