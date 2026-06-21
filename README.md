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
- `data/processed/`：解析后的结构化题库 JSON 和汇总。
- `docs/question-bank/`：分章检查报告与考前注意知识点。
- `scripts/parse-question-bank.mjs`：题库解析脚本。
- `src/`：React + Vite 前端源码。
- `matrix.md`：实现记录矩阵。
- `AGENT.md`：后续开发约束与接手说明。

## 使用

```bash
npm install
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
   - `data/processed/summary.json`
   - `src/data/questionBank.json`
   - `docs/question-bank/*.md`

解析脚本只做格式与一致性检查，不自动改答案。
