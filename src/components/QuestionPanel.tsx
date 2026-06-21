import { Check, X } from "lucide-react";
import { answerText, questionTypeLabel } from "../lib/questions";
import type { ProgressRecord, Question } from "../types";
import { AnalysisBox } from "./AnalysisBox";

type QuestionPanelProps = {
  currentRecord?: ProgressRecord;
  draftSelection: string[];
  onAnswer: (selected: string[]) => void;
  onNextQuestion: () => void;
  onOptionClick: (label: string) => void;
  onPreviousQuestion: () => void;
  question: Question;
  questionCount: number;
  questionIndex: number;
  questions: Question[];
  selected: string[];
};

export function QuestionPanel({
  currentRecord,
  draftSelection,
  onAnswer,
  onNextQuestion,
  onOptionClick,
  onPreviousQuestion,
  question,
  questionCount,
  questionIndex,
  questions,
  selected,
}: QuestionPanelProps) {
  return (
    <article className="question-panel">
      <div className="question-meta">
        <span>{questionTypeLabel(question.type)}</span>
        <span>
          第 {questionIndex + 1} / {questionCount} 题
        </span>
      </div>

      <h3>{question.stem}</h3>

      <div className="options">
        {question.options.map((option) => {
          const isSelected = selected.includes(option.label);
          const isAnswer = question.answer.includes(option.label);
          const showResult = Boolean(currentRecord);
          return (
            <button
              className={[
                "option-button",
                isSelected ? "is-selected" : "",
                showResult && isAnswer ? "is-answer" : "",
                showResult && isSelected && !isAnswer ? "is-wrong-choice" : "",
              ].join(" ")}
              key={option.label}
              onClick={() => onOptionClick(option.label)}
              type="button"
            >
              <span className="option-label">{option.label}</span>
              <span>{option.text}</span>
            </button>
          );
        })}
      </div>

      {question.type === "multiple" ? (
        <button
          className="primary-button"
          disabled={draftSelection.length === 0}
          onClick={() => onAnswer(draftSelection)}
          type="button"
        >
          提交答案
        </button>
      ) : null}

      <div className={`feedback ${currentRecord ? currentRecord.status : ""}`} aria-live="polite">
        {currentRecord ? (
          <>
            {currentRecord.status === "correct" ? <Check size={18} /> : <X size={18} />}
            <span>
              {currentRecord.status === "correct" ? "回答正确" : `回答错误，正确答案：${answerText(question.answer)}`}
            </span>
          </>
        ) : (
          <span>选择答案后会显示判断结果。</span>
        )}
      </div>

      {currentRecord ? <AnalysisBox examPoints={question.examPoints} explanation={question.explanation} /> : null}

      <footer className="question-actions">
        <button
          className="secondary-button"
          disabled={questionIndex <= 0}
          onClick={onPreviousQuestion}
          type="button"
          title="上一题 (←)"
        >
          上一题
        </button>
        <button
          className="secondary-button"
          disabled={questionIndex >= questions.length - 1}
          onClick={onNextQuestion}
          type="button"
          title="下一题 (→)"
        >
          下一题
        </button>
      </footer>
    </article>
  );
}
