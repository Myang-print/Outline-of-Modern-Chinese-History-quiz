import { annotationsDir, rawFile } from "./lib/paths.mjs";
import { loadAnnotations, applyAnnotations } from "./lib/annotations.mjs";
import { parseRawQuestionBank } from "./lib/parse.mjs";
import { collectValidationIssues, splitExcludedQuestions } from "./lib/validation.mjs";
import {
  buildSummary,
  ensureOutputDirs,
  writeChapterOutputs,
  writeQuestionBankOutputs,
} from "./lib/output.mjs";

async function main() {
  await ensureOutputDirs();

  const annotations = await loadAnnotations(annotationsDir);
  const parsedQuestions = await parseRawQuestionBank(rawFile);
  const { excluded, includedQuestions } = splitExcludedQuestions(parsedQuestions);
  const questions = applyAnnotations(includedQuestions, annotations);
  const issues = collectValidationIssues(questions);
  const summary = buildSummary(questions, excluded, issues);
  const chapters = await writeChapterOutputs(questions, issues);

  await writeQuestionBankOutputs(questions, excluded, summary);

  console.log(`Parsed ${questions.length} questions across ${chapters.length} chapters.`);
  console.log(`Excluded ${excluded.length} non-practice questions.`);
  console.log(`Found ${issues.length} format/consistency issues.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
