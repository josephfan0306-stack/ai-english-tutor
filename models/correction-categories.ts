// 獨立成檔，讓前端與 zod schema 可以引用而不用載入 mongoose
export const CORRECTION_CATEGORIES = [
  "grammar", // 文法（時態、主詞動詞一致…）
  "vocabulary", // 用字
  "spelling", // 拼字
  "word-order", // 語序
  "preposition", // 介系詞
  "article", // 冠詞
  "collocation", // 搭配詞
  "punctuation", // 標點
  "meaning", // 語意誤譯 / 漏譯
  "style", // 語氣、自然度
] as const;

export type CorrectionCategory = (typeof CORRECTION_CATEGORIES)[number];
