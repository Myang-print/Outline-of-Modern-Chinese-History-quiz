import { readFile } from "node:fs/promises";
import { ANSWER_RE, CHAPTER_RE, OPTION_RE, SECTION_RE, TYPE_LABELS } from "./constants.mjs";
import { compactText, isNoise, normalizeLine, slugify } from "./text.mjs";

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

  return {
    id: `${slugify(context.chapter)}-${context.type}-${String(indexInChapter).padStart(3, "0")}`,
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
}

export async function parseRawQuestionBank(rawFile) {
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

  return questions;
}

