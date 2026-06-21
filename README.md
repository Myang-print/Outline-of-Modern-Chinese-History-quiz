# 📚 中国近现代史纲要刷题 App

一个本地运行的《中国近现代史纲要》刷题 Web App。项目把 PDF 转出的 `.txt` 题库处理为结构化 JSON，并提供按章节刷题、即时判题、解析展示和本地作答记录保存。

## ✨ Features

- 🧭 按章节/专题浏览题目。
- 📚 支持多科目入口，当前已注册《中国近现代史纲要》。
- ✅ 支持单选题、多选题、判断题。
- ⚡ 作答后即时判断正误，答错时显示正确答案。
- 🎯 答题后展示简明解析和考试核心考点。
- 🎨 左侧题号用三种颜色标记状态：未做、正确、错误。
- 💾 作答记录保存在浏览器 `localStorage`，刷新或关闭后仍保留。
- ⌨️ 支持方向键、数字键、选项字母和侧边栏快捷键。
- ♻️ 支持清空当前专题作答记录。

## 🧱 Requirements

- Node.js 18+。
- npm，通常会随 Node.js 一起安装。
- Chrome、Edge、Firefox 等现代浏览器。

## 🚀 Quick Start

第一次使用：

```bash
npm install
npm run dev
```

终端出现下面的地址后，用浏览器打开：

```text
http://127.0.0.1:4173/
```

`npm run dev` 会持续运行本地开发服务器。停止服务时，在终端按 `Ctrl + C`。

日常使用只需要 `npm install` 和 `npm run dev`。下面的其他命令用于构建检查、题库再生成或故障备用。

## ⌨️ Study Controls

- `←` / `→`：上一题 / 下一题。
- `A`、`B`、`C`、`D` 或 `1`、`2`、`3`、`4`：选择对应选项；最多支持数字 `1` 到 `9`。
- `Enter`：提交多选题。
- `Alt + 1`：展开侧边栏。
- `Shift + Esc`：收起侧边栏。

页面会记录每个科目的学习位置。再次进入科目时，优先打开上一次未完成的题目；如果该题已经作答，会继续定位到后面的第一道未做题。

窄屏下侧边栏默认收起，题号区会保持可读数字；点击右上角专题标题可以收起或展开侧边栏。

## 🧩 Common Commands


| Command                      | What it does                                | When to use                    |
| ---------------------------- | ------------------------------------------- | ------------------------------ |
| `npm install`                | 安装项目依赖                                | 第一次拉取项目后运行一次       |
| `npm run dev`                | 启动本地开发服务器                          | 平时打开 App、开发和手动体验   |
| `npm run build`              | 生成生产构建并做 TypeScript 检查            | 提交前确认项目能正式构建       |
| `npm run preview:local`      | 预览`npm run build` 生成的生产版本          | `dev` 不可用或想检查构建产物时 |
| `npm run annotate:remaining` | 为未精写题目生成基础解析                    | 原始题库或注释规则变化后       |
| `npm run parse:bank`         | 从题库源数据生成 App 使用的 JSON 和复核文档 | 修改题库、注释或解析脚本后     |

### 🧯 Backup Preview

如果 `npm run dev` 在你的 Windows 环境中遇到端口或权限问题，使用备用预览流程：

```bash
npm run build
npm run preview:local
```

然后打开：

```text
http://127.0.0.1:4174/
```

## 🧪 Verification

提交代码前建议运行：

```bash
npm run annotate:remaining
npm run parse:bank
npm run build
```

完整验证会重复跑一遍题库生成和前端构建，是为了确认“从源数据到可运行 App”的整条链路没有断。它和日常启动不同，不是每次打开 App 都必须执行。

这三步分别确认：

- 解析/考点注释可以生成。
- 题库 JSON、分章数据和复核文档可以生成。
- 前端 TypeScript 和生产构建通过。

## 🗂️ Project Structure

```text
.
├─ src/                 # React + Vite frontend
├─ scripts/             # Question-bank processing scripts
├─ data/                # Raw, annotation, and generated data
├─ docs/                # Usage docs and generated question-bank documents
├─ AGENT.md             # Development rules for future agents
└─ matrix.md            # Implementation status matrix
```

Detailed folder guides:

- [`src/`](src/README.md): frontend source structure and update rules.
- [`src/components/`](src/components/README.md): focused quiz UI components.
- [`src/data/`](src/data/README.md): generated frontend data.
- [`src/lib/`](src/lib/README.md): frontend helper modules.
- [`src/styles/`](src/styles/README.md): split CSS structure and update rules.
- [`scripts/`](scripts/README.md): question-bank processing scripts.
- [`data/`](data/README.md): raw, annotation, and processed data workflow.
- [`docs/`](docs/README.md): documentation structure.

## 📖 More Documentation

- [Usage Guide](docs/USAGE.md): local startup, build, preview, and command explanations.
- [Question Bank Pipeline](docs/QUESTION_BANK_PIPELINE.md): raw text, annotations, generated JSON, reports, and review files.
- [Roadmap](docs/ROADMAP.md): multi-subject expansion and long-term optimization plan.
- [Implementation Matrix](matrix.md): current implementation status.

## 📌 Current Data Status

- 941 practice questions.
- 13 chapters/topics.
- 1 registered subject: 中国近现代史纲要.
- 941 questions include explanations and exam points.
- 1 non-practice course-description question is excluded.
- 0 format/consistency issues in the latest generated summary.

## 📝 Notes

- The app reads generated JSON; it does not parse raw `.txt` in the browser.
- Progress is stored per subject with `quiz-progress:${subjectId}:v1`.
- Generated files under `data/processed/`, `src/data/`, and `docs/question-bank/` should be regenerated through scripts instead of edited by hand.
- `npm run dev` binds to `127.0.0.1:4173` to avoid Windows environments where `localhost` resolves to IPv6 `::1` and fails with `EACCES`.
