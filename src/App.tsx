import { Sidebar } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";
import { QuestionPanel } from "./components/QuestionPanel";
import { chapters, getQuestionsByChapter, questions } from "./lib/questions";
import { useQuestionNavigation } from "./hooks/useQuestionNavigation";
import { useQuizProgress } from "./hooks/useQuizProgress";

export function App() {
  const { answerQuestion, getChapterSummary, progress, resetChapter, statusForQuestion } = useQuizProgress(questions);
  const {
    chapter,
    chapterQuestions,
    current,
    currentIndex,
    draftSelection,
    setChapter,
    setQuestionId,
    toggleDraftSelection,
  } = useQuestionNavigation(progress);

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
        chapters={chapters}
        currentChapter={chapter}
        currentQuestionId={current?.id}
        getChapterQuestions={getQuestionsByChapter}
        onSelectChapter={setChapter}
        onSelectQuestion={setQuestionId}
        statusForQuestion={statusForQuestion}
        totalQuestions={questions.length}
      />

      <section className="content">
        <Topbar
          answeredCount={answeredCount}
          chapter={chapter}
          correctCount={correctCount}
          questionCount={chapterQuestions.length}
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
