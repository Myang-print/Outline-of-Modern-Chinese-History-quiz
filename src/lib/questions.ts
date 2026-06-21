import rawQuestions from "../data/questionBank.json";
import type { Question } from "../types";

export const questions = rawQuestions as Question[];

export const chapters = Array.from(new Set(questions.map((question) => question.chapter)));

export function getQuestionsByChapter(chapter: string) {
  return questions.filter((question) => question.chapter === chapter);
}

export function questionTypeLabel(type: Question["type"]) {
  if (type === "single") return "单选题";
  if (type === "multiple") return "多选题";
  return "判断题";
}

export function answerText(answer: string[]) {
  return [...answer].sort().join("");
}
