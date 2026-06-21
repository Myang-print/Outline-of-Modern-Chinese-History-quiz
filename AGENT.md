# Agent Notes

## Scope

本项目是本地刷题 App，不增加登录、云同步、错题本、搜索、统计图等额外功能，除非用户后续明确要求。

## Data Rules

- 原始题库保存在 `data/raw/`。
- 前端只读取处理后的 JSON，不在运行时解析 `.txt`。
- 解析脚本可以清洗格式噪声，但不得根据知识判断自动修改答案。
- 每道题保留来源行号，方便回查原始文本。
- 知识点文档只从题库文本中提炼，不引入外部资料。
- PDF 转文本带来的页码、空行、卷标题等噪声应在解析阶段忽略。
- 明确不适合作为练习的题目放入 `data/processed/excluded-questions.json`，不要混入 App 数据。
- 分章复核文件输出到 `data/processed/chapters/` 和 `docs/question-bank/*-review.md`。
- 题目解析和考试核心知识点维护在 `data/annotations/*.json`，解析脚本负责合并到最终 JSON。
- 未完成解析的题目保留 `explanation: ""` 和 `examPoints: []`，不要写占位废话。
- `data/annotations/综述-风云变幻的八十年.json` 是第一批精写解析；`auto-generated-remaining.json` 是剩余题目的基础解析。
- 后续精修某章时，新建章节注释文件并从 `auto-generated-remaining.json` 移除对应题目，避免同一 ID 重复维护。

## UI Rules

- 侧边栏题号状态只使用三类：未做、正确、错误。
- 单选题和判断题点击即判。
- 多选题选择多个选项后提交。
- 当前专题可清空作答记录，不能影响其他专题。
- 组件保持圆角、清晰、平滑过渡，不做复杂装饰。

## Verification

实现或修改后至少运行：

```bash
npm run annotate:remaining
npm run parse:bank
npm run build
```
