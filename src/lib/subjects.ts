import type { ProgressState, Subject, SubjectProgressSummary } from "../types";

export const MODERN_HISTORY_SUBJECT_ID = "modern-history";

export const subjects: Subject[] = [
  {
    id: MODERN_HISTORY_SUBJECT_ID,
    name: "中国近现代史纲要",
    description: "按章节练习单选、多选和判断题，包含解析与考试核心知识点。",
    questionCount: 941,
    chapterCount: 13,
    dataPath: "src/data/questionBank.json",
  },
];

export function getSubjectById(subjectId: string) {
  return subjects.find((subject) => subject.id === subjectId);
}

export function summarizeSubjectProgress(progress: ProgressState): SubjectProgressSummary {
  const records = Object.values(progress);
  const answeredCount = records.length;
  const correctCount = records.filter((record) => record.status === "correct").length;
  const lastAnsweredAt = records
    .map((record) => record.answeredAt)
    .filter(Boolean)
    .sort()
    .at(-1);

  return {
    answeredCount,
    correctCount,
    lastAnsweredAt,
  };
}
