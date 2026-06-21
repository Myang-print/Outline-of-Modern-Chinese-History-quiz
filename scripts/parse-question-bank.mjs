import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const rawFile = path.join(root, "data/raw/中国近代史纲要题库-1.txt");
const processedDir = path.join(root, "data/processed");
const docsDir = path.join(root, "docs/question-bank");
const srcDataDir = path.join(root, "src/data");

const TYPE_LABELS = [
  { pattern: /^一、\s*单项选择题/, type: "single", title: "单项选择题" },
  { pattern: /^二、\s*多项选择题/, type: "multiple", title: "多项选择题" },
  { pattern: /^三、\s*判断正误题/, type: "judge", title: "判断正误题" },
];

const OPTION_RE = /([A-D])\.\s*/g;
const ANSWER_RE = /正确答案\s*[：:]\s*([A-D]{1,4})/;
const CHAPTER_RE = /^(综述\s+.+|第[一二三四五六七八九十]+章\s+.+)$/;
const VOLUME_RE = /^[上中下]编\s+.+$/;
const SECTION_RE = /^[一二三四五六七八九十]+、\s*.+$/;

function normalizeLine(line) {
  return line
    .replace(/\u3000/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/[．]/g, ".")
    .trim();
}

function isNoise(line) {
  return !line || /^\d+$/.test(line) || /^《.+》试题库$/.test(line) || VOLUME_RE.test(line);
}

function splitOptions(text) {
  const matches = [...text.matchAll(OPTION_RE)];
  if (matches.length === 0) return [];

  return matches.map((match, index) => {
    const next = matches[index + 1];
    const start = match.index + match[0].length;
    const end = next ? next.index : text.length;
    return {
      label: match[1],
      text: text.slice(start, end).trim(),
    };
  });
}

function stripAnswer(text) {
  return text.replace(ANSWER_RE, "").trim();
}

function extractQuestionNumber(text) {
  const match = text.match(/^(\d+)[.、]\s*(.*)$/);
  if (!match) return null;
  return {
    number: Number(match[1]),
    rest: match[2].trim(),
  };
}

function compactText(parts) {
  return parts
    .map((part) => normalizeLine(part))
    .filter(Boolean)
    .join(" ")
    .replace(/\s+([，。；：！？、）])/g, "$1")
    .replace(/([（])\s+/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function parseQuestion(block, context, indexInChapter) {
  const first = extractQuestionNumber(block.lines[0].text);
  if (!first) return null;

  const sourceLines = block.lines.map((line) => line.number);
  const full = compactText([first.rest, ...block.lines.slice(1).map((line) => line.text)]);
  const answerMatch = full.match(ANSWER_RE);
  const answer = answerMatch ? [...answerMatch[1]] : [];
  const withoutAnswer = stripAnswer(full);
  const optionMatches = [...withoutAnswer.matchAll(OPTION_RE)];

  let stem = withoutAnswer;
  let options = [];

  if (optionMatches.length > 0) {
    stem = withoutAnswer.slice(0, optionMatches[0].index).trim();
    options = splitOptions(withoutAnswer.slice(optionMatches[0].index));
  }

  const id = `${slugify(context.chapter)}-${context.type}-${String(indexInChapter).padStart(3, "0")}`;
  const question = {
    id,
    chapter: context.chapter,
    type: context.type,
    number: first.number,
    stem,
    options,
    answer,
    source: {
      file: "data/raw/中国近代史纲要题库-1.txt",
      lines: sourceLines,
    },
  };

  return question;
}

function validateQuestion(question) {
  const issues = [];
  const optionLabels = new Set(question.options.map((option) => option.label));

  if (!question.stem) issues.push("题干为空");
  if (question.answer.length === 0) issues.push("缺少正确答案");

  if (question.type === "single") {
    if (question.options.length !== 4) issues.push(`单选题选项数量为 ${question.options.length}`);
    if (question.answer.length !== 1) issues.push(`单选题答案数量为 ${question.answer.length}`);
  }

  if (question.type === "multiple") {
    if (question.options.length !== 4) issues.push(`多选题选项数量为 ${question.options.length}`);
    if (question.answer.length < 2) issues.push(`多选题答案数量为 ${question.answer.length}`);
  }

  if (question.type === "judge") {
    if (question.options.length !== 2) issues.push(`判断题选项数量为 ${question.options.length}`);
    if (question.answer.length !== 1 || !["A", "B"].includes(question.answer[0])) {
      issues.push(`判断题答案不是 A/B：${question.answer.join("") || "空"}`);
    }
  }

  const seen = new Set();
  for (const letter of question.answer) {
    if (seen.has(letter)) issues.push(`答案字母重复：${letter}`);
    seen.add(letter);
    if (!optionLabels.has(letter)) issues.push(`答案 ${letter} 不在选项范围内`);
  }

  for (const option of question.options) {
    if (!option.text) issues.push(`选项 ${option.label} 为空`);
  }

  return issues;
}

function slugify(text) {
  return text
    .replace(/\s+/g, "-")
    .replace(/[^\p{Script=Han}A-Za-z0-9-]/gu, "")
    .slice(0, 48);
}

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

function buildChapterReport(chapter, questions, issues) {
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

function buildKnowledgeNotes(chapter, questions) {
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

function countBy(items, key) {
  return items.reduce((acc, item) => {
    acc[item[key]] = (acc[item[key]] || 0) + 1;
    return acc;
  }, {});
}

async function main() {
  await mkdir(processedDir, { recursive: true });
  await mkdir(docsDir, { recursive: true });
  await mkdir(srcDataDir, { recursive: true });

  const raw = await readFile(rawFile, "utf8");
  const lines = raw.split(/\r?\n/).map((text, index) => ({
    number: index + 1,
    text: normalizeLine(text),
  }));

  let chapter = "未分章";
  let type = null;
  let block = null;
  const questions = [];
  const chapterQuestionIndex = new Map();

  function flushBlock() {
    if (!block || !type) return;
    const currentIndex = (chapterQuestionIndex.get(chapter) || 0) + 1;
    const question = parseQuestion(block, { chapter, type }, currentIndex);
    if (question) {
      questions.push(question);
      chapterQuestionIndex.set(chapter, currentIndex);
    }
    block = null;
  }

  for (const line of lines) {
    if (isNoise(line.text)) continue;

    if (CHAPTER_RE.test(line.text)) {
      flushBlock();
      chapter = line.text;
      type = null;
      continue;
    }

    const typeMatch = TYPE_LABELS.find((item) => item.pattern.test(line.text));
    if (typeMatch) {
      flushBlock();
      type = typeMatch.type;
      continue;
    }

    if (SECTION_RE.test(line.text)) {
      flushBlock();
      type = null;
      continue;
    }

    if (!type) continue;

    if (/^\d+[.、]\s*/.test(line.text)) {
      flushBlock();
      block = { lines: [line] };
    } else if (block) {
      block.lines.push(line);
    }
  }
  flushBlock();

  const issues = [];
  for (const question of questions) {
    const questionIssues = validateQuestion(question);
    if (questionIssues.length > 0) {
      issues.push({
        chapter: question.chapter,
        questionId: question.id,
        lines: question.source.lines,
        issues: questionIssues,
      });
    }
  }

  const chapters = [...new Set(questions.map((question) => question.chapter))];
  const summary = {
    source: "data/raw/中国近代史纲要题库-1.txt",
    totalQuestions: questions.length,
    totalIssues: issues.length,
    chapters: chapters.map((chapterName) => {
      const chapterQuestions = questions.filter((question) => question.chapter === chapterName);
      const chapterIssues = issues.filter((issue) => issue.chapter === chapterName);
      return {
        chapter: chapterName,
        questionCount: chapterQuestions.length,
        issueCount: chapterIssues.length,
        typeCounts: countBy(chapterQuestions, "type"),
      };
    }),
  };

  await writeFile(path.join(processedDir, "question-bank.json"), `${JSON.stringify(questions, null, 2)}\n`, "utf8");
  await writeFile(path.join(processedDir, "summary.json"), `${JSON.stringify(summary, null, 2)}\n`, "utf8");
  await writeFile(path.join(srcDataDir, "questionBank.json"), `${JSON.stringify(questions, null, 2)}\n`, "utf8");

  for (const chapterName of chapters) {
    const chapterQuestions = questions.filter((question) => question.chapter === chapterName);
    const chapterIssues = issues.filter((issue) => issue.chapter === chapterName);
    const slug = slugify(chapterName);
    await writeFile(path.join(docsDir, `${slug}-check.md`), buildChapterReport(chapterName, chapterQuestions, chapterIssues), "utf8");
    await writeFile(path.join(docsDir, `${slug}-notes.md`), buildKnowledgeNotes(chapterName, chapterQuestions), "utf8");
  }

  console.log(`Parsed ${questions.length} questions across ${chapters.length} chapters.`);
  console.log(`Found ${issues.length} format/consistency issues.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
