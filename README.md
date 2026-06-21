# 近代史纲要刷题 App

一个本地运行的刷题 Web App，用于练习《近代史纲要》题库。App 读取处理后的题库 JSON，不在浏览器里直接解析原始 `.txt`。

## 功能

- 按章节/专题浏览题目。
- 支持单选题、多选题、判断题。
- 作答后判断正误，错误时显示正确答案。
- 左侧题号用三种颜色标记状态：未做、正确、错误。
- 作答记录保存在浏览器 `localStorage`，关闭后仍保留。
- 支持清空当前专题作答记录。

## 目录

- `data/raw/`：原始 `.txt` 题库副本。
- `data/annotations/`：按批次维护的题目解析和核心考点。
- `data/processed/`：解析后的结构化题库 JSON 和汇总。
- `docs/question-bank/`：分章检查报告与考前注意知识点。
- `scripts/parse-question-bank.mjs`：题库解析脚本。
- `src/`：React + Vite 前端源码。
- `matrix.md`：实现记录矩阵。
- `AGENT.md`：后续开发约束与接手说明。

## Folder Guides

- [`src/`](src/README.md): frontend source structure and update rules.
- [`src/components/`](src/components/README.md): planned component boundaries.
- [`src/data/`](src/data/README.md): generated frontend data.
- [`src/lib/`](src/lib/README.md): frontend helper modules.
- [`src/styles/`](src/styles/README.md): split CSS structure and update rules.
- [`scripts/`](scripts/README.md): question-bank processing scripts.
- [`data/`](data/README.md): raw, annotation, and processed data workflow.
- [`data/raw/`](data/raw/README.md): raw source file rules.
- [`data/annotations/`](data/annotations/README.md): explanation and exam-point annotation rules.
- [`data/processed/`](data/processed/README.md): generated data outputs.
- [`data/processed/chapters/`](data/processed/chapters/README.md): per-chapter generated JSON.
- [`docs/`](docs/README.md): documentation structure.
- [`docs/question-bank/`](docs/question-bank/README.md): generated review and study documents.

## 使用

```bash
npm install
npm run parse:bank
npm run annotate:remaining
npm run parse:bank
npm run dev
```

生产构建：

```bash
npm run build
```

## 题库处理流程

1. 将原始 `.txt` 放入 `data/raw/`。
2. 运行 `npm run parse:bank`。
3. 脚本会生成：
   - `data/processed/question-bank.json`
   - `data/processed/chapters/*.json`
   - `data/processed/excluded-questions.json`
   - `data/processed/summary.json`
   - `src/data/questionBank.json`
   - `docs/question-bank/*.md`

解析脚本只做格式与一致性检查，不自动改答案。
解析和核心考点从 `data/annotations/*.json` 合并进最终题库；可以按章节分批补充。
精写解析文件优先保留，`npm run annotate:remaining` 会为未精写的章节生成基础解析和核心考点。

## 分章复核

- `data/processed/chapters/`：按章节拆分后的结构化 JSON，适合程序处理或逐章人工校对。
- `docs/question-bank/*-review.md`：按章节生成的题干、选项、答案复核稿。
- `docs/question-bank/*-check.md`：格式与一致性检查报告。
- `docs/question-bank/*-notes.md`：基于题库提炼的考前注意知识点。
- `data/processed/excluded-questions.json`：被明确排除的非练习题，例如课程属性说明题。
- `data/annotations/`：人工维护的解析批次文件，字段为 `explanation` 和 `examPoints`。
- `scripts/generate-auto-annotations.mjs`：为尚未精写的题目生成基础解析；后续精修时可以用章节注释文件替换。
