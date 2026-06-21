import { ArrowLeft, RotateCcw } from "lucide-react";

type TopbarProps = {
  answeredCount: number;
  chapter: string;
  correctCount: number;
  questionCount: number;
  subjectName: string;
  onBackToSubjects: () => void;
  onResetChapter: () => void;
};

export function Topbar({
  answeredCount,
  chapter,
  correctCount,
  questionCount,
  subjectName,
  onBackToSubjects,
  onResetChapter,
}: TopbarProps) {
  return (
    <header className="topbar">
      <button className="subject-home-button" onClick={onBackToSubjects} type="button">
        <span className="subject-mark" aria-hidden="true">
          史
        </span>
        <span>
          <span className="subject-home-title">{subjectName}</span>
          <span className="subject-home-subtitle">近代史纲要刷题</span>
        </span>
        <ArrowLeft size={15} />
      </button>

      <div className="topbar-progress">
        <h2>
          已完成 {answeredCount}/{questionCount}，正确 {correctCount}
        </h2>
        <button className="ghost-button" onClick={onResetChapter} type="button">
          <RotateCcw size={16} />
          清空本专题记录
        </button>
      </div>

      <div className="chapter-badge" title={chapter}>
        {chapter}
      </div>
    </header>
  );
}
