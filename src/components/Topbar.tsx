import { ArrowLeft, RotateCcw } from "lucide-react";

type TopbarProps = {
  answeredCount: number;
  chapter: string;
  correctCount: number;
  isSidebarOpen: boolean;
  questionCount: number;
  subjectName: string;
  onBackToSubjects: () => void;
  onResetChapter: () => void;
  onToggleSidebar: () => void;
};

export function Topbar({
  answeredCount,
  chapter,
  correctCount,
  isSidebarOpen,
  questionCount,
  subjectName,
  onBackToSubjects,
  onResetChapter,
  onToggleSidebar,
}: TopbarProps) {
  return (
    <header className="topbar">
      <button className="subject-home-button" onClick={onBackToSubjects} type="button">
        <ArrowLeft size={15} />
        <span className="subject-home-title">{subjectName}</span>
        <span className="subject-mark" aria-hidden="true">
          史
        </span>
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

      <button
        className="chapter-badge"
        onClick={onToggleSidebar}
        title={isSidebarOpen ? `${chapter}，点击收起侧边栏` : `${chapter}，点击展开侧边栏`}
        type="button"
      >
        {chapter}
      </button>
    </header>
  );
}
