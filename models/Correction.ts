import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";
import { CORRECTION_CATEGORIES } from "@/models/correction-categories";

export { CORRECTION_CATEGORIES };

/**
 * 單一糾錯或建議（一題可能有多筆）
 */
const correctionSchema = new Schema(
  {
    record: { type: Schema.Types.ObjectId, ref: "TranslationRecord", required: true, index: true },
    studentId: { type: String, required: true },

    // error = 錯誤必須修正；suggestion = 沒錯但可以更好
    kind: { type: String, enum: ["error", "suggestion"], required: true },
    category: { type: String, enum: CORRECTION_CATEGORIES, required: true },

    // 觀念的標準化代碼，用來跨題目統計，例如 "grammar.tense.past-simple"
    conceptKey: { type: String, required: true },
    conceptLabel: { type: String, required: true }, // 給學生看的中文名稱，例如「過去簡單式」

    originalText: { type: String, required: true }, // 學生寫錯的片段
    correctedText: { type: String, required: true }, // 修正後片段
    explanation: { type: String, required: true }, // 為什麼錯（中文解說）
    example: { type: String }, // 補充例句

    severity: { type: String, enum: ["minor", "major"], default: "minor" },
  },
  { timestamps: true }
);

correctionSchema.index({ studentId: 1, conceptKey: 1, createdAt: -1 });

export type Correction = InferSchemaType<typeof correctionSchema>;

export const CorrectionModel: Model<Correction> =
  (models.Correction as Model<Correction>) || model<Correction>("Correction", correctionSchema);
