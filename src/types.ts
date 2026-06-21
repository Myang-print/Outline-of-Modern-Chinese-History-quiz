export type QuestionType = "single" | "multiple" | "judge";

export type Subject = {
  id: string;
  name: string;
  description: string;
  questionCount: number;
  chapterCount: number;
  dataPath: string;
};

export type Option = {
  label: string;
  text: string;
};

export type Question = {
  id: string;
  subjectId: string;
  chapter: string;
  type: QuestionType;
  number: number;
  stem: string;
  options: Option[];
  answer: string[];
  source: {
    file: string;
    lines: number[];
  };
  explanation: string;
  examPoints: string[];
};

export type AnswerStatus = "unanswered" | "correct" | "incorrect";

export type ProgressRecord = {
  selected: string[];
  status: Exclude<AnswerStatus, "unanswered">;
  answeredAt: string;
};

export type ProgressState = Record<string, ProgressRecord>;

export type SubjectProgressSummary = {
  answeredCount: number;
  correctCount: number;
  lastAnsweredAt?: string;
};
