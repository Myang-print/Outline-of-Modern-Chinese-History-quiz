import type { ProgressRecord, ProgressState, Question } from "../types";

const STORAGE_KEY = "modern-history-quiz-progress:v1";

export function loadProgress(): ProgressState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function saveProgress(progress: ProgressState) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function isCorrectAnswer(selected: string[], answer: string[]) {
  const normalizedSelected = [...selected].sort().join("");
  const normalizedAnswer = [...answer].sort().join("");
  return normalizedSelected === normalizedAnswer;
}

export function createProgressRecord(selected: string[], answer: string[]): ProgressRecord {
  return {
    selected: [...selected].sort(),
    status: isCorrectAnswer(selected, answer) ? "correct" : "incorrect",
    answeredAt: new Date().toISOString(),
  };
}

export function clearChapterProgress(progress: ProgressState, questions: Question[], chapter: string) {
  const next = { ...progress };
  for (const question of questions) {
    if (question.chapter === chapter) {
      delete next[question.id];
    }
  }
  return next;
}
