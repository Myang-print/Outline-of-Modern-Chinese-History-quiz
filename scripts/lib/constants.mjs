export const TYPE_LABELS = [
  { pattern: /^一、\s*单项选择题/, type: "single", title: "单项选择题" },
  { pattern: /^二、\s*多项选择题/, type: "multiple", title: "多项选择题" },
  { pattern: /^三、\s*判断正误题/, type: "judge", title: "判断正误题" },
];

export const OPTION_RE = /([A-D])\.\s*/g;
export const ANSWER_RE = /正确答案\s*[：:]\s*([A-D]{1,4})/;
export const CHAPTER_RE = /^(综述\s+.+|第[一二三四五六七八九十]+章\s+.+)$/;
export const VOLUME_RE = /^[上中下]编\s+.+$/;
export const SECTION_RE = /^[一二三四五六七八九十]+、\s*.+$/;

export const EXCLUDED_QUESTIONS = [
  {
    reason: "课程属性说明题，不属于中国近现代史知识点练习",
    chapter: "综述 风云变幻的八十年",
    type: "single",
    number: 1,
    stemIncludes: "《中国近现代史纲要》课程",
  },
];

