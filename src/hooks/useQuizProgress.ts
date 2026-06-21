import React from "react";
import { clearChapterProgress, createProgressRecord, loadProgress, saveProgress } from "../lib/progress";
import type { AnswerStatus, ProgressState, Question } from "../types";

export function statusFor(question: Question, progress: ProgressState): AnswerStatus {
  return progress[question.id]?.status ?? "unanswered";
}

export function useQuizProgress(allQuestions: Question[]) {
  const [progress, setProgress] = React.useState<ProgressState>(() => loadProgress());

  function updateProgress(next: ProgressState) {
    setProgress(next);
    saveProgress(next);
  }

  function answerQuestion(question: Question | undefined, selected: string[]) {
    if (!question) return;
    updateProgress({
      ...progress,
      [question.id]: createProgressRecord(selected, question.answer),
    });
  }

  function resetChapter(chapter: string) {
    updateProgress(clearChapterProgress(progress, allQuestions, chapter));
  }

  function getChapterSummary(questions: Question[]) {
    return {
      answeredCount: questions.filter((question) => statusFor(question, progress) !== "unanswered").length,
      correctCount: questions.filter((question) => statusFor(question, progress) === "correct").length,
    };
  }

  return {
    answerQuestion,
    getChapterSummary,
    progress,
    resetChapter,
    statusForQuestion: (question: Question) => statusFor(question, progress),
  };
}
