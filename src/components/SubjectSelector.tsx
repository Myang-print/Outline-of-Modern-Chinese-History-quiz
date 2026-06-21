import { BookOpen, Clock, Play } from "lucide-react";
import type { Subject, SubjectProgressSummary } from "../types";

type SubjectSelectorProps = {
  subjects: Subject[];
  getProgressSummary: (subjectId: string) => SubjectProgressSummary;
  onSelectSubject: (subjectId: string) => void;
};

function formatLastAnsweredAt(value: string | undefined) {
  if (!value) return "暂无记录";
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function SubjectSelector({ subjects, getProgressSummary, onSelectSubject }: SubjectSelectorProps) {
  return (
    <main className="subject-page">
      <section className="subject-hero">
        <div>
          <p className="subject-kicker">Quiz Workspace</p>
          <h1>选择科目开始练习</h1>
          <p>当前项目已支持多科目入口和独立进度存储，后续可以继续接入新的课程题库。</p>
        </div>
      </section>

      <section className="subject-grid" aria-label="科目列表">
        {subjects.map((subject) => {
          const summary = getProgressSummary(subject.id);
          const progressText = `${summary.answeredCount}/${subject.questionCount}`;

          return (
            <article className="subject-card" key={subject.id}>
              <div className="subject-card__icon" aria-hidden="true">
                <BookOpen size={22} />
              </div>
              <div className="subject-card__content">
                <h2>{subject.name}</h2>
                <p>{subject.description}</p>
                <dl className="subject-stats">
                  <div>
                    <dt>题目</dt>
                    <dd>{subject.questionCount}</dd>
                  </div>
                  <div>
                    <dt>章节</dt>
                    <dd>{subject.chapterCount}</dd>
                  </div>
                  <div>
                    <dt>进度</dt>
                    <dd>{progressText}</dd>
                  </div>
                  <div>
                    <dt>正确</dt>
                    <dd>{summary.correctCount}</dd>
                  </div>
                </dl>
                <p className="subject-last-seen">
                  <Clock size={15} />
                  最近练习：{formatLastAnsweredAt(summary.lastAnsweredAt)}
                </p>
              </div>
              <button className="primary-button subject-card__action" onClick={() => onSelectSubject(subject.id)} type="button">
                <Play size={16} />
                继续学习
              </button>
            </article>
          );
        })}
      </section>
    </main>
  );
}
