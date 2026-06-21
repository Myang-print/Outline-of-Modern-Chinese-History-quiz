import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  annotationsDir,
  docsDir,
  processedChaptersDir,
  processedDir,
  srcDataDir,
} from "./paths.mjs";
import { buildChapterReport, buildChapterReview, buildKnowledgeNotes } from "./documents.mjs";
import { countBy, slugify } from "./text.mjs";

export async function ensureOutputDirs() {
  await mkdir(processedDir, { recursive: true });
  await mkdir(processedChaptersDir, { recursive: true });
  await mkdir(annotationsDir, { recursive: true });
  await mkdir(docsDir, { recursive: true });
  await mkdir(srcDataDir, { recursive: true });
}

export function buildSummary(questions, excluded, issues) {
  const chapters = [...new Set(questions.map((question) => question.chapter))];
  return {
    source: "data/raw/中国近代史纲要题库-1.txt",
    totalQuestions: questions.length,
    excludedQuestions: excluded.length,
    annotatedQuestions: questions.filter((question) => question.explanation || question.examPoints.length > 0).length,
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
}

export async function writeQuestionBankOutputs(questions, excluded, summary) {
  await writeFile(path.join(processedDir, "question-bank.json"), `${JSON.stringify(questions, null, 2)}\n`, "utf8");
  await writeFile(path.join(processedDir, "summary.json"), `${JSON.stringify(summary, null, 2)}\n`, "utf8");
  await writeFile(path.join(processedDir, "excluded-questions.json"), `${JSON.stringify(excluded, null, 2)}\n`, "utf8");
  await writeFile(path.join(srcDataDir, "questionBank.json"), `${JSON.stringify(questions, null, 2)}\n`, "utf8");
}

export async function writeChapterOutputs(questions, issues) {
  const chapters = [...new Set(questions.map((question) => question.chapter))];
  for (const chapterName of chapters) {
    const chapterQuestions = questions.filter((question) => question.chapter === chapterName);
    const chapterIssues = issues.filter((issue) => issue.chapter === chapterName);
    const slug = slugify(chapterName);
    await writeFile(path.join(processedChaptersDir, `${slug}.json`), `${JSON.stringify(chapterQuestions, null, 2)}\n`, "utf8");
    await writeFile(path.join(docsDir, `${slug}-check.md`), buildChapterReport(chapterName, chapterQuestions, chapterIssues), "utf8");
    await writeFile(path.join(docsDir, `${slug}-review.md`), buildChapterReview(chapterName, chapterQuestions), "utf8");
    await writeFile(path.join(docsDir, `${slug}-notes.md`), buildKnowledgeNotes(chapterName, chapterQuestions), "utf8");
  }
  return chapters;
}

