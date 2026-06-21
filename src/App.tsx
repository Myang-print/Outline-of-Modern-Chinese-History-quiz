import React from "react";
import { Sidebar } from "./components/Sidebar";
import { SubjectSelector } from "./components/SubjectSelector";
import { Topbar } from "./components/Topbar";
import { QuestionPanel } from "./components/QuestionPanel";
import { questions } from "./lib/questions";
import { loadProgress, loadStudyPosition, resolveInitialStudyPosition, saveStudyPosition } from "./lib/progress";
import { getSubjectById, subjects, summarizeSubjectProgress } from "./lib/subjects";
import { useQuestionNavigation } from "./hooks/useQuestionNavigation";
import { useQuizProgress } from "./hooks/useQuizProgress";
import type { Subject } from "./types";

export function App() {
  const [selectedSubjectId, setSelectedSubjectId] = React.useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const selectedSubject = selectedSubjectId ? getSubjectById(selectedSubjectId) : undefined;

  React.useEffect(() => {
    const media = window.matchMedia("(max-width: 980px)");
    const syncSidebar = () => setIsSidebarOpen(!media.matches);
    syncSidebar();
    media.addEventListener("change", syncSidebar);
    return () => media.removeEventListener("change", syncSidebar);
  }, []);

  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.altKey && event.key === "1") {
        event.preventDefault();
        setIsSidebarOpen(true);
      }
      if (event.shiftKey && event.key === "Escape") {
        event.preventDefault();
        setIsSidebarOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!selectedSubject) {
    return (
      <SubjectSelector
        getProgressSummary={(subjectId) => summarizeSubjectProgress(loadProgress(subjectId))}
        onSelectSubject={(subjectId) => {
          setSelectedSubjectId(subjectId);
          if (window.matchMedia("(max-width: 980px)").matches) {
            setIsSidebarOpen(false);
          }
        }}
        subjects={subjects}
      />
    );
  }

  return (
    <SubjectQuiz
      isSidebarOpen={isSidebarOpen}
      onBackToSubjects={() => setSelectedSubjectId(null)}
      onToggleSidebar={() => setIsSidebarOpen((isOpen) => !isOpen)}
      subject={selectedSubject}
    />
  );
}

type SubjectQuizProps = {
  isSidebarOpen: boolean;
  subject: Subject;
  onBackToSubjects: () => void;
  onToggleSidebar: () => void;
};

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) || target.isContentEditable;
}

function SubjectQuiz({ isSidebarOpen, subject, onBackToSubjects, onToggleSidebar }: SubjectQuizProps) {
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
  const [initialPosition] = React.useState(() =>
    resolveInitialStudyPosition(subjectQuestions, subjectChapters, progress, loadStudyPosition(subject.id)),
  );
  const handlePositionChange = React.useCallback(
    (position: { chapter: string; questionId: string }) => saveStudyPosition(subject.id, position),
    [subject.id],
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
  } = useQuestionNavigation(subjectQuestions, subjectChapters, progress, initialPosition, handlePositionChange);

  function handleOptionClick(label: string) {
    if (!current) return;
    if (current.type === "multiple") {
      toggleDraftSelection(label);
      return;
    }
    answerQuestion(current, [label]);
  }

  function goToPreviousQuestion() {
    if (currentIndex > 0) {
      setQuestionId(chapterQuestions[currentIndex - 1].id);
    }
  }

  function goToNextQuestion() {
    if (currentIndex < chapterQuestions.length - 1) {
      setQuestionId(chapterQuestions[currentIndex + 1].id);
    }
  }

  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (isTypingTarget(event.target) || !current) return;

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goToPreviousQuestion();
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        goToNextQuestion();
        return;
      }

      if (event.key === "Enter" && current.type === "multiple") {
        event.preventDefault();
        if (draftSelection.length > 0) {
          answerQuestion(current, draftSelection);
        }
        return;
      }

      const number = Number(event.key);
      if (Number.isInteger(number) && number >= 1 && number <= 9) {
        const option = current.options[number - 1];
        if (option) {
          event.preventDefault();
          handleOptionClick(option.label);
        }
        return;
      }

      const key = event.key.toUpperCase();
      const option = current.options.find((item) => item.label === key);
      if (/^[A-Z]$/.test(key) && option) {
        event.preventDefault();
        handleOptionClick(option.label);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [answerQuestion, chapterQuestions, current, currentIndex, draftSelection, toggleDraftSelection]);

  const { answeredCount, correctCount } = getChapterSummary(chapterQuestions);
  const currentRecord = current ? progress[current.id] : undefined;
  const selected = current?.type === "multiple" ? draftSelection : currentRecord?.selected ?? [];

  return (
    <main className={`app-shell ${isSidebarOpen ? "" : "is-sidebar-collapsed"}`}>
      {isSidebarOpen ? (
        <Sidebar
          chapters={subjectChapters}
          currentChapter={chapter}
          currentQuestionId={current?.id}
          getChapterQuestions={getSubjectChapterQuestions}
          onSelectChapter={setChapter}
          onSelectQuestion={setQuestionId}
          statusForQuestion={statusForQuestion}
        />
      ) : null}

      <section className="content">
        <Topbar
          answeredCount={answeredCount}
          chapter={chapter}
          correctCount={correctCount}
          isSidebarOpen={isSidebarOpen}
          onBackToSubjects={onBackToSubjects}
          onToggleSidebar={onToggleSidebar}
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
            onPreviousQuestion={goToPreviousQuestion}
            onNextQuestion={goToNextQuestion}
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
