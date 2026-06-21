import { ArrowLeft } from "lucide-react";

type TopbarProps = {
  answeredCount: number;
  chapter: string;
  correctCount: number;
  isSidebarOpen: boolean;
  questionCount: number;
  subjectName: string;
  onBackToSubjects: () => void;
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
  onToggleSidebar,
}: TopbarProps) {
  return (
    <header className="topbar">
      <div className="topbar-heading">
        <button className="subject-home-button" onClick={onBackToSubjects} type="button">
          <ArrowLeft size={15} />
          <span className="subject-mark" aria-hidden="true">
            史
          </span>
          <span className="subject-home-title">{subjectName}</span>
        </button>
      </div>

      <div className="topbar-detail-row">
        <button
          className="chapter-badge"
          onClick={onToggleSidebar}
          title={isSidebarOpen ? `${chapter}，点击收起侧边栏` : `${chapter}，点击展开侧边栏`}
          type="button"
        >
          {chapter}
        </button>

        <div className="topbar-progress">
          <h2>
            已完成 {answeredCount}/{questionCount}，正确 {correctCount}
          </h2>
          <div className="progress-track" aria-label={`完成进度 ${answeredCount}/${questionCount}`}>
            <span style={{ width: `${questionCount > 0 ? (answeredCount / questionCount) * 100 : 0}%` }} />
          </div>
        </div>
      </div>
    </header>
  );
}
