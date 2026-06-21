type AnalysisBoxProps = {
  examPoints: string[];
  explanation: string;
};

export function AnalysisBox({ examPoints, explanation }: AnalysisBoxProps) {
  if (!explanation && examPoints.length === 0) return null;

  return (
    <section className="analysis-box">
      {explanation ? (
        <div>
          <h4>解析</h4>
          <p>{explanation}</p>
        </div>
      ) : null}
      {examPoints.length > 0 ? (
        <div>
          <h4>核心考点</h4>
          <ul>
            {examPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
