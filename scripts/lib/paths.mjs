import path from "node:path";

export const root = process.cwd();
export const rawFile = path.join(root, "data/raw/中国近代史纲要题库-1.txt");
export const processedDir = path.join(root, "data/processed");
export const processedChaptersDir = path.join(processedDir, "chapters");
export const annotationsDir = path.join(root, "data/annotations");
export const docsDir = path.join(root, "docs/question-bank");
export const srcDataDir = path.join(root, "src/data");

