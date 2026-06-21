import { RotateCcw } from "lucide-react";

type TopbarProps = {
  answeredCount: number;
  chapter: string;
  correctCount: number;
  questionCount: number;
  onResetChapter: () => void;
};

export function Topbar({ answeredCount, chapter, correctCount, questionCount, onResetChapter }: TopbarProps) {
  return (
    <header className="topbar">
      <div>
        <p className="chapter-name">{chapter}</p>
        <h2>
          已完成 {answeredCount}/{questionCount}，正确 {correctCount}
        </h2>
      </div>
      <button className="ghost-button" onClick={onResetChapter} type="button">
        <RotateCcw size={16} />
        清空本专题记录
      </button>
    </header>
  );
}
