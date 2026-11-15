import "server-only";
import { Types } from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { TranslationRecordModel, type TranslationRecord } from "@/models/TranslationRecord";
import { CorrectionModel, type Correction } from "@/models/Correction";
import { ConceptMistakeModel } from "@/models/ConceptMistake";

const RECENT_EXAMPLES_LIMIT = 5;

export type CorrectionInput = Omit<Correction, "record" | "studentId" | "createdAt" | "updatedAt">;

export type LearningRecordInput = Omit<
  TranslationRecord,
  "corrections" | "errorCount" | "suggestionCount" | "createdAt" | "updatedAt"
> & {
  corrections: CorrectionInput[];
};

/**
 * 存下一次完整的學習紀錄：題目＋作答＋批改＋每筆糾錯，並更新觀念錯誤統計
 */
export async function saveLearningRecord(input: LearningRecordInput) {
  await connectDB();
  const { corrections, ...recordData } = input;
  const now = new Date();
  const recordId = new Types.ObjectId();

  const correctionDocs = await CorrectionModel.insertMany(
    corrections.map((c) => ({ ...c, record: recordId, studentId: input.studentId }))
  );

  const record = await TranslationRecordModel.create({
    ...recordData,
    _id: recordId,
    corrections: correctionDocs.map((c) => c._id),
    errorCount: corrections.filter((c) => c.kind === "error").length,
    suggestionCount: corrections.filter((c) => c.kind === "suggestion").length,
  });

  if (correctionDocs.length > 0) {
    await ConceptMistakeModel.bulkWrite(
      correctionDocs.map((c) => ({
        updateOne: {
          filter: { studentId: input.studentId, conceptKey: c.conceptKey },
          update: {
            $set: {
              conceptLabel: c.conceptLabel,
              category: c.category,
              lastSeenAt: now,
              lastRecord: recordId,
            },
            $setOnInsert: { firstSeenAt: now },
            $inc: c.kind === "error" ? { errorCount: 1 } : { suggestionCount: 1 },
            ...(c.kind === "error" && {
              $push: {
                recentExamples: {
                  $each: [
                    {
                      originalText: c.originalText,
                      correctedText: c.correctedText,
                      record: recordId,
                      at: now,
                    },
                  ],
                  $slice: -RECENT_EXAMPLES_LIMIT,
                },
              },
            }),
          },
          upsert: true,
        },
      }))
    );
  }

  return record;
}

/**
 * 出題前查詢：這些觀念學生以前錯過幾次（只回傳有錯過的，依次數多到少）
 */
export async function getConceptWarnings(studentId: string, conceptKeys: string[]) {
  await connectDB();
  return ConceptMistakeModel.find({
    studentId,
    conceptKey: { $in: conceptKeys },
    errorCount: { $gt: 0 },
  })
    .sort({ errorCount: -1 })
    .lean();
}

/**
 * 學生最常錯的觀念排行
 */
export async function getTopMistakes(studentId: string, limit = 10) {
  await connectDB();
  return ConceptMistakeModel.find({ studentId, errorCount: { $gt: 0 } })
    .sort({ errorCount: -1 })
    .limit(limit)
    .lean();
}

/**
 * 學習歷史（含糾錯明細）
 */
export async function getLearningHistory(studentId: string, limit = 20) {
  await connectDB();
  return TranslationRecordModel.find({ studentId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("corrections")
    .lean();
}
