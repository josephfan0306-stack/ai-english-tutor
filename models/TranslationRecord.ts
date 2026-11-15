import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

/**
 * 一次中翻英練習的完整紀錄（一題 = 一筆）
 */
const translationRecordSchema = new Schema(
  {
    // 學生識別碼（目前尚無帳號系統，先用字串；之後可改成 ObjectId ref User）
    studentId: { type: String, required: true, index: true },

    // 題目
    grade: { type: Number }, // 7 / 8 / 9
    unitId: { type: String, index: true }, // 對應 lib/curriculum.ts 的單元 id，例如 "b5-u1"
    sourceText: { type: String, required: true }, // 中文原句
    topic: { type: String }, // 題目主題，例如「旅遊」「職場」
    difficulty: { type: String, enum: ["easy", "medium", "hard"] },
    // 這題考的觀念（與 Correction.conceptKey 同一套命名），用來找「類似題目」
    targetConcepts: { type: [String], default: [], index: true },

    // 學生作答
    studentAnswer: { type: String, required: true },

    // AI 批改結果
    correctedAnswer: { type: String }, // 依學生原句修正後的版本
    referenceAnswers: { type: [String], default: [] }, // 其他自然的參考譯法
    score: { type: Number, min: 0, max: 100 },
    isCorrect: { type: Boolean, default: false },
    overallFeedback: { type: String }, // 整體講評

    // 本題的糾錯與建議（明細存在 Correction collection）
    corrections: [{ type: Schema.Types.ObjectId, ref: "Correction" }],
    errorCount: { type: Number, default: 0 },
    suggestionCount: { type: Number, default: 0 },

    // 批改當下使用的模型，方便日後比對
    aiModel: { type: String },
  },
  { timestamps: true }
);

translationRecordSchema.index({ studentId: 1, createdAt: -1 });

export type TranslationRecord = InferSchemaType<typeof translationRecordSchema>;

export const TranslationRecordModel: Model<TranslationRecord> =
  (models.TranslationRecord as Model<TranslationRecord>) ||
  model<TranslationRecord>("TranslationRecord", translationRecordSchema);
