import React from "react";
import type { ProgressState, Question, StudyPosition } from "../types";

export function useQuestionNavigation(
  questions: Question[],
  chapters: string[],
  progress: ProgressState,
  initialPosition: StudyPosition,
  onPositionChange: (position: StudyPosition) => void,
) {
  const [chapter, setChapter] = React.useState(() => initialPosition.chapter || chapters[0] || "");
  const chapterQuestions = React.useMemo(
    () => questions.filter((question) => question.chapter === chapter),
    [chapter, questions],
  );
  const [questionId, setQuestionId] = React.useState(() => initialPosition.questionId || chapterQuestions[0]?.id || "");
  const current = chapterQuestions.find((question) => question.id === questionId) ?? chapterQuestions[0] ?? questions[0];
  const currentIndex = chapterQuestions.findIndex((question) => question.id === current?.id);
  const [draftSelection, setDraftSelection] = React.useState<string[]>([]);

  React.useEffect(() => {
    setChapter((currentChapter) => (chapters.includes(currentChapter) ? currentChapter : (chapters[0] ?? "")));
  }, [chapters]);

  React.useEffect(() => {
    if (initialPosition.chapter && initialPosition.chapter !== chapter) {
      setChapter(initialPosition.chapter);
    }
    if (initialPosition.questionId && initialPosition.questionId !== questionId) {
      setQuestionId(initialPosition.questionId);
    }
  }, [initialPosition.chapter, initialPosition.questionId]);

  React.useEffect(() => {
    if (!chapterQuestions.some((question) => question.id === questionId)) {
      setQuestionId(chapterQuestions[0]?.id ?? "");
    }
  }, [chapterQuestions, questionId]);

  React.useEffect(() => {
    setDraftSelection(progress[current?.id ?? ""]?.selected ?? []);
  }, [current?.id, progress]);

  React.useEffect(() => {
    if (current) {
      onPositionChange({ chapter: current.chapter, questionId: current.id });
    }
  }, [current, onPositionChange]);

  function toggleDraftSelection(label: string) {
    setDraftSelection((selected) =>
      selected.includes(label) ? selected.filter((item) => item !== label) : [...selected, label].sort(),
    );
  }

  return {
    chapter,
    chapterQuestions,
    current,
    currentIndex,
    draftSelection,
    questionId,
    setChapter,
    setQuestionId,
    toggleDraftSelection,
  };
}
