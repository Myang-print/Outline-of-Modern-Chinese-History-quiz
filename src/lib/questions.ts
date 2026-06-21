import rawQuestions from "../data/questionBank.json";
import type { Question } from "../types";
import { MODERN_HISTORY_SUBJECT_ID } from "./subjects";

type RawQuestion = Omit<Question, "subjectId"> & Partial<Pick<Question, "subjectId">>;

export const questions = (rawQuestions as RawQuestion[]).map((question) => ({
  ...question,
  subjectId: question.subjectId ?? MODERN_HISTORY_SUBJECT_ID,
}));

export const chapters = Array.from(new Set(questions.map((question) => question.chapter)));

export function getQuestionsByChapter(chapter: string) {
  return questions.filter((question) => question.chapter === chapter);
}

export function getQuestionsBySubject(subjectId: string) {
  return questions.filter((question) => question.subjectId === subjectId);
}

export function questionTypeLabel(type: Question["type"]) {
  if (type === "single") return "单选题";
  if (type === "multiple") return "多选题";
  return "判断题";
}

export function answerText(answer: string[]) {
  return [...answer].sort().join("");
}
