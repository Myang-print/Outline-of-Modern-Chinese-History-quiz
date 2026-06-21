import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

export async function loadAnnotations(annotationsDir) {
  const annotations = new Map();
  let files = [];
  try {
    files = await readdir(annotationsDir);
  } catch {
    return annotations;
  }

  for (const file of files.filter((name) => name.endsWith(".json"))) {
    const content = await readFile(path.join(annotationsDir, file), "utf8");
    const records = JSON.parse(content);
    for (const record of records) {
      annotations.set(record.id, {
        explanation: record.explanation || "",
        examPoints: Array.isArray(record.examPoints) ? record.examPoints : [],
      });
    }
  }

  return annotations;
}

export function applyAnnotations(questions, annotations) {
  return questions.map((question, index) => {
    const annotation = annotations.get(question.id);
    return {
      ...question,
      sequence: index + 1,
      explanation: annotation?.explanation || "",
      examPoints: annotation?.examPoints || [],
    };
  });
}

