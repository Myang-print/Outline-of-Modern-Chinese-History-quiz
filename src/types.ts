export type QuestionType = "single" | "multiple" | "judge";

export type Option = {
  label: string;
  text: string;
};

export type Question = {
  id: string;
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
