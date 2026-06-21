import { EXCLUDED_QUESTIONS } from "./constants.mjs";

export function validateQuestion(question) {
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

export function shouldExcludeQuestion(question) {
  return EXCLUDED_QUESTIONS.find((rule) => {
    return (
      question.chapter === rule.chapter &&
      question.type === rule.type &&
      question.number === rule.number &&
      question.stem.includes(rule.stemIncludes)
    );
  });
}

export function splitExcludedQuestions(questions) {
  const excluded = [];
  const includedQuestions = [];

  for (const question of questions) {
    const exclusion = shouldExcludeQuestion(question);
    if (exclusion) {
      excluded.push({
        id: question.id,
        chapter: question.chapter,
        type: question.type,
        number: question.number,
        stem: question.stem,
        reason: exclusion.reason,
        source: question.source,
      });
    } else {
      includedQuestions.push(question);
    }
  }

  return { excluded, includedQuestions };
}

export function collectValidationIssues(questions) {
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
  return issues;
}

