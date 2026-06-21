import { countBy } from "./text.mjs";

function collectKeywords(questions) {
  const stopWords = new Set([
    "中国",
    "近代",
    "社会",
    "正确",
    "错误",
    "主要",
    "下列",
    "的是",
    "包括",
    "属于",
    "标志",
    "时期",
    "历史",
    "进行",
    "问题",
  ]);
  const text = questions.map((question) => question.stem).join(" ");
  const terms = text.match(/[\u4e00-\u9fa5]{2,8}/g) || [];
  const counts = new Map();
  for (const term of terms) {
    if (stopWords.has(term)) continue;
    counts.set(term, (counts.get(term) || 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 18)
    .map(([term, count]) => ({ term, count }));
}

function collectYears(questions) {
  const text = questions
    .flatMap((question) => [question.stem, ...question.options.map((option) => option.text)])
    .join(" ");
  const matches = text.match(/\d{3,4}\s*年/g) || [];
  const counts = new Map();
  for (const match of matches) {
    const year = match.replace(/\s+/g, "");
    counts.set(year, (counts.get(year) || 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([year, count]) => ({ year, count }));
}

export function buildChapterReport(chapter, questions, issues) {
  const typeCounts = countBy(questions, "type");
  const lines = [
    `# ${chapter} 检查报告`,
    "",
    `- 题目总数：${questions.length}`,
    `- 单选题：${typeCounts.single || 0}`,
    `- 多选题：${typeCounts.multiple || 0}`,
    `- 判断题：${typeCounts.judge || 0}`,
    `- 格式问题：${issues.length}`,
    "",
    "## 格式与一致性问题",
    "",
  ];

  if (issues.length === 0) {
    lines.push("未发现格式与一致性问题。");
  } else {
    for (const issue of issues) {
      lines.push(`- ${issue.questionId}（原始行 ${issue.lines.join(", ")}）：${issue.issues.join("；")}`);
    }
  }

  return `${lines.join("\n")}\n`;
}

export function buildChapterReview(chapter, questions) {
  const lines = [
    `# ${chapter} 题库复核稿`,
    "",
    "> 本文件按解析后的题目生成，用于分章检查题干、选项和答案。页码、空行等 PDF 转文本噪声已在解析阶段忽略。",
    "",
  ];

  for (const question of questions) {
    lines.push(`## ${question.id}`);
    lines.push("");
    lines.push(`- 类型：${question.type}`);
    lines.push(`- 原题号：${question.number}`);
    lines.push(`- 来源行：${question.source.lines.join(", ")}`);
    lines.push(`- 题干：${question.stem}`);
    lines.push("- 选项：");
    for (const option of question.options) {
      lines.push(`  - ${option.label}. ${option.text}`);
    }
    lines.push(`- 答案：${question.answer.join("")}`);
    if (question.explanation) lines.push(`- 解析：${question.explanation}`);
    if (question.examPoints?.length) lines.push(`- 核心考点：${question.examPoints.join("；")}`);
    lines.push("");
  }

  return `${lines.join("\n")}\n`;
}

export function buildKnowledgeNotes(chapter, questions) {
  const keywords = collectKeywords(questions);
  const years = collectYears(questions);
  const commonForms = [
    ...new Set(
      questions
        .map((question) => {
          if (question.stem.includes("标志")) return "关注“标志着/标志是”类题干，通常考查事件性质或历史节点。";
          if (question.stem.includes("目的")) return "关注“目的”类题干，区分直接目的、根本目的和历史结果。";
          if (question.stem.includes("性质")) return "关注“性质”类题干，优先辨析社会性质、阶级性质和运动性质。";
          if (question.stem.includes("最")) return "关注带“最”的题干，记忆表述必须精确。";
          return "";
        })
        .filter(Boolean),
    ),
  ].slice(0, 8);

  return [
    `# ${chapter} 考前注意知识点`,
    "",
    "> 本文只根据题库文本提炼，不引入外部资料。",
    "",
    "## 高频概念",
    "",
    ...keywords.map((item) => `- ${item.term}（出现 ${item.count} 次）`),
    "",
    "## 重要时间",
    "",
    ...(years.length > 0 ? years.map((item) => `- ${item.year}（出现 ${item.count} 次）`) : ["- 本章题库中未提取到高频年份。"]),
    "",
    "## 常见问法",
    "",
    ...(commonForms.length > 0 ? commonForms.map((item) => `- ${item}`) : ["- 本章题干问法较分散，复习时以题干关键词为主。"]),
    "",
  ].join("\n");
}

