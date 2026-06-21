import React from "react";
import { chapters, getQuestionsByChapter, questions } from "../lib/questions";
import type { ProgressState } from "../types";

export function useQuestionNavigation(progress: ProgressState) {
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
