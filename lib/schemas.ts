import { z } from "zod";
import { CONCEPT_KEYS } from "@/lib/concepts";
import { CORRECTION_CATEGORIES } from "@/models/correction-categories";

/** AI 回傳的 JSON 結構（同時用在 structured outputs 與前端型別） */

const Example = z.object({
  en: z.string().describe("英文例句"),
  zh: z.string().describe("中文翻譯"),
  note: z.string().describe("補充說明，沒有就給空字串"),
});

// ── 講義
export const HandoutSchema = z.object({
  title: z.string(),
  summary: z.string().describe("本講義的學習重點，2-3 句中文"),
  sections: z.array(
    z.object({
      heading: z.string(),
      explanation: z.string().describe("中文解說，國中生看得懂"),
      pattern: z.string().describe("句型公式，例如 S + have/has + p.p.；沒有就給空字串"),
      examples: z.array(Example),
    })
  ),
  commonMistakes: z.array(
    z.object({ wrong: z.string(), right: z.string(), explanation: z.string() })
  ),
  practiceSentences: z
    .array(z.object({ zh: z.string(), en: z.string() }))
    .describe("中翻英練習句（附參考答案）"),
});
export type Handout = z.infer<typeof HandoutSchema>;

// ── 中翻英練習題
export const TranslationQuestionsSchema = z.object({
  questions: z.array(
    z.object({
      zh: z.string().describe("中文題目"),
      hint: z.string().describe("提示（關鍵字或句型），中文"),
      targetConcepts: z.array(z.enum(CONCEPT_KEYS)).describe("這題考的觀念代碼"),
    })
  ),
});
export type TranslationQuestions = z.infer<typeof TranslationQuestionsSchema>;

// ── 中翻英批改
export const GradingSchema = z.object({
  isCorrect: z.boolean().describe("沒有任何 error 即為 true（可以有 suggestion）"),
  score: z.number().describe("0-100"),
  correctedAnswer: z.string().describe("盡量保留學生原句、只修正錯誤後的版本"),
  referenceAnswers: z.array(z.string()).describe("1-2 個自然的參考譯法"),
  overallFeedback: z.string().describe("給學生的整體講評，中文，鼓勵為主"),
  corrections: z.array(
    z.object({
      kind: z.enum(["error", "suggestion"]),
      category: z.enum(CORRECTION_CATEGORIES),
      conceptKey: z.enum(CONCEPT_KEYS),
      originalText: z.string().describe("學生寫的片段"),
      correctedText: z.string().describe("修正後片段"),
      explanation: z.string().describe("中文解說為什麼"),
      example: z.string().describe("一個正確例句，沒有就給空字串"),
      severity: z.enum(["minor", "major"]),
    })
  ),
});
export type Grading = z.infer<typeof GradingSchema>;

// ── 中翻英：正確答案（教你怎麼寫出來）
export const ModelAnswerSchema = z.object({
  bestAnswer: z.string().describe("最推薦的標準答案"),
  alternatives: z
    .array(z.object({ en: z.string(), note: z.string().describe("這個寫法的差別或適用情境，中文") }))
    .describe("1-3 個其他也正確的寫法"),
  pattern: z.string().describe("這題用到的句型公式，例如 S + have/has + already + p.p."),
  steps: z
    .array(z.object({ step: z.string().describe("步驟標題"), explanation: z.string().describe("中文說明") }))
    .describe("從中文一步步翻成英文的思考過程，3-5 步：找主詞 → 判斷時態 → 選動詞 → 排語序…"),
  keyVocabulary: z.array(
    z.object({ word: z.string(), meaning: z.string(), usage: z.string().describe("用法或搭配，中文") })
  ),
  comparison: z.string().describe("跟學生答案比較，指出最關鍵的差異，中文 1-2 句；學生答對就給肯定"),
});
export type ModelAnswer = z.infer<typeof ModelAnswerSchema>;

// ── 中翻英：錯誤詳細解說
export const MistakeExplanationSchema = z.object({
  summary: z.string().describe("一句話總結這題主要錯在哪，中文"),
  mistakes: z.array(
    z.object({
      yourText: z.string().describe("學生寫的片段"),
      correctText: z.string().describe("正確寫法"),
      conceptKey: z.enum(CONCEPT_KEYS),
      whyWrong: z.string().describe("為什麼錯，用國中生聽得懂的話詳細說明"),
      rule: z.string().describe("背後的文法規則，可以附公式"),
      examples: z
        .array(z.object({ wrong: z.string(), right: z.string(), zh: z.string() }))
        .describe("2 組類似的錯誤 → 正確例句"),
      tip: z.string().describe("記憶小技巧或下次自我檢查的方法"),
    })
  ),
  correctedAnswer: z.string().describe("保留學生原本寫法、只修正錯誤的版本"),
  checklist: z.array(z.string()).describe("下次寫中翻英前可以自我檢查的 2-4 個重點"),
});
export type MistakeExplanation = z.infer<typeof MistakeExplanationSchema>;

// ── 拍照問答案
export const PhotoAnswerSchema = z.object({
  readable: z.boolean().describe("照片是否看得清楚、有英文題目；看不清楚就 false"),
  message: z.string().describe("readable=false 時告訴學生怎麼重拍；否則給空字串"),
  questions: z.array(
    z.object({
      number: z.string().describe("題號，照片上沒有就依序編 1、2、3"),
      question: z.string().describe("辨識出的題目原文（含選項）"),
      studentAnswer: z.string().describe("照片上學生寫的答案；沒寫就給空字串"),
      correctAnswer: z.string().describe("正確答案"),
      verdict: z.enum(["correct", "incorrect", "unanswered"]).describe("學生答案是否正確；沒作答為 unanswered"),
      explanation: z.string().describe("中文解析：為什麼是這個答案；學生答錯時說明錯在哪"),
      conceptKey: z.enum(CONCEPT_KEYS),
    })
  ),
  overallComment: z.string().describe("整體講評或學習建議，中文"),
});
export type PhotoAnswer = z.infer<typeof PhotoAnswerSchema>;

// ── 文法與句型練習題
export const GrammarQuestionsSchema = z.object({
  questions: z.array(
    z.object({
      type: z.enum(["multiple-choice", "fill-in", "rewrite"]),
      question: z.string().describe("題目；填空用 ____ 表示空格；句型改寫要寫清楚改寫指示"),
      options: z.array(z.string()).describe("選擇題的 4 個選項（不含 A/B/C/D 前綴）；非選擇題給空陣列"),
      answer: z.string().describe("正確答案；選擇題給選項原文"),
      acceptableAnswers: z.array(z.string()).describe("其他也算對的答案"),
      explanation: z.string().describe("中文解析"),
      conceptKey: z.enum(CONCEPT_KEYS),
    })
  ),
});
export type GrammarQuestions = z.infer<typeof GrammarQuestionsSchema>;

// ── 考卷
export const ExamSchema = z.object({
  title: z.string(),
  instructions: z.string(),
  sections: z.array(
    z.object({
      name: z.string().describe("例如：一、字彙選擇"),
      type: z.enum(["multiple-choice", "fill-in", "rewrite", "translation", "reading"]),
      instructions: z.string(),
      passage: z.string().describe("閱讀測驗的文章；其他題型給空字串"),
      pointsEach: z.number(),
      questions: z.array(
        z.object({
          question: z.string(),
          options: z.array(z.string()).describe("選擇題 4 個選項（不含 A/B/C/D 前綴）；非選擇題給空陣列"),
          answer: z.string(),
          explanation: z.string().describe("中文解析"),
        })
      ),
    })
  ),
});
export type Exam = z.infer<typeof ExamSchema>;
