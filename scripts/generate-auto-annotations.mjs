import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const questionBankFile = path.join(root, "data/processed/question-bank.json");
const annotationsDir = path.join(root, "data/annotations");
const outFile = path.join(annotationsDir, "auto-generated-remaining.json");

const MANUAL_ANNOTATED_PREFIXES = ["综述-风云变幻的八十年-"];

function cleanText(text) {
  return text
    .replace(/[（）()]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function getCorrectOptions(question) {
  const answerSet = new Set(question.answer);
  return question.options.filter((option) => answerSet.has(option.label));
}

function extractKeyTerms(question) {
  const source = `${question.stem} ${getCorrectOptions(question)
    .map((option) => option.text)
    .join(" ")}`;
  const terms = [];

  const years = source.match(/\d{3,4}\s*年/g) || [];
  for (const year of years) terms.push(year.replace(/\s+/g, ""));

  const quoted = source.match(/《[^》]+》|“[^”]+”/g) || [];
  for (const item of quoted) terms.push(item);

  for (const option of getCorrectOptions(question)) {
    const text = cleanText(option.text);
    if (text.length >= 2 && text.length <= 18) terms.push(text);
  }

  const compactStem = cleanText(question.stem);
  const namedPatterns = [
    /鸦片战争/g,
    /甲午中日战争/g,
    /八国联军/g,
    /辛亥革命/g,
    /洋务运动/g,
    /戊戌维新/g,
    /义和团/g,
    /太平天国/g,
    /新文化运动/g,
    /五四运动/g,
    /中国共产党/g,
    /抗日战争/g,
    /解放战争/g,
    /土地改革/g,
    /改革开放/g,
    /社会主义/g,
    /半殖民地半封建社会/g,
  ];
  for (const pattern of namedPatterns) {
    const matches = compactStem.match(pattern) || [];
    for (const match of matches) terms.push(match);
  }

  return [...new Set(terms)].slice(0, 5);
}

function classifyFocus(stem) {
  const cleaned = cleanText(stem);
  if (cleaned.includes("标志")) return "标志性事件";
  if (cleaned.includes("原因")) return "历史原因";
  if (cleaned.includes("目的")) return "历史目的";
  if (cleaned.includes("性质")) return "历史性质";
  if (cleaned.includes("意义")) return "历史意义";
  if (cleaned.includes("影响")) return "历史影响";
  if (cleaned.includes("内容")) return "基本内容";
  if (cleaned.includes("任务")) return "历史任务";
  if (cleaned.includes("矛盾")) return "社会矛盾";
  if (cleaned.includes("时间") || /\d{3,4}\s*年/.test(cleaned)) return "时间线索";
  if (cleaned.includes("人物") || cleaned.includes("领导")) return "人物与组织";
  return "基础史实";
}

function buildExplanation(question) {
  const focus = classifyFocus(question.stem);
  const correctOptions = getCorrectOptions(question);
  const answer = question.answer.join("");
  const correctText = correctOptions.map((option) => `${option.label}.${option.text}`).join("；");

  if (question.type === "judge") {
    const verdict = answer === "A" ? "正确" : "错误";
    return `本题考查${focus}。该判断为${verdict}，复习时要抓住题干中的主体、时间和结论，避免把相近概念或前后阶段混同。`;
  }

  if (question.type === "multiple") {
    return `本题考查${focus}。正确选项为${answer}（${correctText}）。多选题要逐项核对选项是否同时符合题干限定，尤其注意时间、主体、性质和范围。`;
  }

  return `本题考查${focus}。正确选项为${answer}（${correctText}）。单选题通常只取最符合题干限定的一项，注意区分相近事件、概念和时间节点。`;
}

function buildExamPoints(question) {
  const focus = classifyFocus(question.stem);
  const answer = question.answer.join("");
  const correctOptions = getCorrectOptions(question).map((option) => option.text);
  const terms = extractKeyTerms(question);
  const points = [
    `考查方向：${focus}`,
    `正确答案：${answer}${correctOptions.length ? `（${correctOptions.join("；")}）` : ""}`,
  ];

  if (terms.length > 0) {
    points.push(`关键词：${terms.join("、")}`);
  }

  if (question.type === "multiple") {
    points.push("多选题复习要点：逐项判断，不能只凭单个关键词选择。");
  } else if (question.type === "judge") {
    points.push("判断题复习要点：重点检查题干是否存在绝对化、主体错置或时间错置。");
  } else {
    points.push("单选题复习要点：优先锁定题干限定词，再排除相近干扰项。");
  }

  return points;
}

async function main() {
  await mkdir(annotationsDir, { recursive: true });
  const questions = JSON.parse(await readFile(questionBankFile, "utf8"));
  const generated = questions
    .filter((question) => !MANUAL_ANNOTATED_PREFIXES.some((prefix) => question.id.startsWith(prefix)))
    .map((question) => ({
      id: question.id,
      explanation: buildExplanation(question),
      examPoints: buildExamPoints(question),
    }));

  await writeFile(outFile, `${JSON.stringify(generated, null, 2)}\n`, "utf8");
  console.log(`Generated ${generated.length} automatic annotations.`);
  console.log(`Wrote ${path.relative(root, outFile)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
