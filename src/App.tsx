import React from "react";
import { Sidebar } from "./components/Sidebar";
import { SubjectSelector } from "./components/SubjectSelector";
import { Topbar } from "./components/Topbar";
import { QuestionPanel } from "./components/QuestionPanel";
import { questions } from "./lib/questions";
import { loadProgress } from "./lib/progress";
import { getSubjectById, subjects, summarizeSubjectProgress } from "./lib/subjects";
import { useQuestionNavigation } from "./hooks/useQuestionNavigation";
import { useQuizProgress } from "./hooks/useQuizProgress";
import type { Subject } from "./types";

export function App() {
  const [selectedSubjectId, setSelectedSubjectId] = React.useState<string | null>(null);
  const selectedSubject = selectedSubjectId ? getSubjectById(selectedSubjectId) : undefined;

  if (!selectedSubject) {
    return (
      <SubjectSelector
        getProgressSummary={(subjectId) => summarizeSubjectProgress(loadProgress(subjectId))}
        onSelectSubject={setSelectedSubjectId}
        subjects={subjects}
      />
    );
  }

  return <SubjectQuiz onBackToSubjects={() => setSelectedSubjectId(null)} subject={selectedSubject} />;
}

type SubjectQuizProps = {
  subject: Subject;
  onBackToSubjects: () => void;
};

function SubjectQuiz({ subject, onBackToSubjects }: SubjectQuizProps) {
  const subjectQuestions = React.useMemo(
    () => questions.filter((question) => question.subjectId === subject.id),
    [subject.id],
  );
  const subjectChapters = React.useMemo(
    () => Array.from(new Set(subjectQuestions.map((question) => question.chapter))),
    [subjectQuestions],
  );
  const getSubjectChapterQuestions = React.useCallback(
    (chapter: string) => subjectQuestions.filter((question) => question.chapter === chapter),
    [subjectQuestions],
  );
  const { answerQuestion, getChapterSummary, progress, resetChapter, statusForQuestion } = useQuizProgress(
    subject.id,
    subjectQuestions,
  );
  const {
    chapter,
    chapterQuestions,
    current,
    currentIndex,
    draftSelection,
    setChapter,
    setQuestionId,
    toggleDraftSelection,
  } = useQuestionNavigation(subjectQuestions, subjectChapters, progress);

  function handleOptionClick(label: string) {
    if (!current) return;
    if (current.type === "multiple") {
      toggleDraftSelection(label);
      return;
    }
    answerQuestion(current, [label]);
  }

  const { answeredCount, correctCount } = getChapterSummary(chapterQuestions);
  const currentRecord = current ? progress[current.id] : undefined;
  const selected = current?.type === "multiple" ? draftSelection : currentRecord?.selected ?? [];

  return (
    <main className="app-shell">
      <Sidebar
        chapters={subjectChapters}
        currentChapter={chapter}
        currentQuestionId={current?.id}
        getChapterQuestions={getSubjectChapterQuestions}
        onSelectChapter={setChapter}
        onSelectQuestion={setQuestionId}
        statusForQuestion={statusForQuestion}
        totalQuestions={subjectQuestions.length}
      />

      <section className="content">
        <Topbar
          answeredCount={answeredCount}
          chapter={chapter}
          correctCount={correctCount}
          onBackToSubjects={onBackToSubjects}
          questionCount={chapterQuestions.length}
          subjectName={subject.name}
          onResetChapter={() => resetChapter(chapter)}
        />

        {current ? (
          <QuestionPanel
            currentRecord={currentRecord}
            draftSelection={draftSelection}
            onAnswer={(selectedAnswer) => answerQuestion(current, selectedAnswer)}
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
