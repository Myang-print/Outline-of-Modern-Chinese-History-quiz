import type { ProgressRecord, ProgressState, Question } from "../types";
import { MODERN_HISTORY_SUBJECT_ID } from "./subjects";

const LEGACY_STORAGE_KEY = "modern-history-quiz-progress:v1";

export function progressStorageKey(subjectId: string) {
  return `quiz-progress:${subjectId}:v1`;
}

function parseProgress(raw: string | null): ProgressState {
  if (!raw) return {};
  const parsed = JSON.parse(raw);
  return parsed && typeof parsed === "object" ? parsed : {};
}

export function loadProgress(subjectId: string): ProgressState {
  try {
    const storageKey = progressStorageKey(subjectId);
    const progress = parseProgress(window.localStorage.getItem(storageKey));
    if (Object.keys(progress).length > 0 || subjectId !== MODERN_HISTORY_SUBJECT_ID) {
      return progress;
    }

    const legacyProgress = parseProgress(window.localStorage.getItem(LEGACY_STORAGE_KEY));
    if (Object.keys(legacyProgress).length > 0) {
      window.localStorage.setItem(storageKey, JSON.stringify(legacyProgress));
    }
    return legacyProgress;
  } catch {
    return {};
  }
}

export function saveProgress(subjectId: string, progress: ProgressState) {
  window.localStorage.setItem(progressStorageKey(subjectId), JSON.stringify(progress));
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
