import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

/**
 * 每位學生 × 每個觀念 的錯誤統計（彙總表）
 * 出新題時用 targetConcepts 查這張表，就能提醒「這個觀念你錯過 N 次」
 */
const conceptMistakeSchema = new Schema(
  {
    studentId: { type: String, required: true },
    conceptKey: { type: String, required: true },
    conceptLabel: { type: String, required: true },
    category: { type: String, required: true },

    errorCount: { type: Number, default: 0 }, // 犯錯次數（kind = error）
    suggestionCount: { type: Number, default: 0 }, // 被建議次數（kind = suggestion）

    firstSeenAt: { type: Date },
    lastSeenAt: { type: Date },
    lastRecord: { type: Schema.Types.ObjectId, ref: "TranslationRecord" },

    // 最近幾次錯誤的範例，提醒時可直接秀給學生
    recentExamples: {
      type: [
        {
          _id: false,
          originalText: String,
          correctedText: String,
          record: { type: Schema.Types.ObjectId, ref: "TranslationRecord" },
          at: Date,
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

conceptMistakeSchema.index({ studentId: 1, conceptKey: 1 }, { unique: true });
conceptMistakeSchema.index({ studentId: 1, errorCount: -1 });

export type ConceptMistake = InferSchemaType<typeof conceptMistakeSchema>;

export const ConceptMistakeModel: Model<ConceptMistake> =
  (models.ConceptMistake as Model<ConceptMistake>) ||
  model<ConceptMistake>("ConceptMistake", conceptMistakeSchema);
