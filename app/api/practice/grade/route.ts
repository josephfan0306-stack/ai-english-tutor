import { z } from "zod";
import { generateJSON } from "@/lib/anthropic";
import { handle, BadRequest } from "@/lib/api";
import { CONCEPT_KEYS, conceptLabel, conceptListForPrompt } from "@/lib/concepts";
import { getUnit, unitForPrompt } from "@/lib/curriculum";
import { saveLearningRecord } from "@/lib/learning-records";
import { GradingSchema } from "@/lib/schemas";
import { safeWarnings } from "@/lib/warnings";

const Body = z.object({
  studentId: z.string().min(1),
  unitId: z.string(),
  zh: z.string().min(1),
  targetConcepts: z.array(z.enum(CONCEPT_KEYS)).default([]),
  studentAnswer: z.string().trim().min(1),
});

/** 批改中翻英，存進 MongoDB，回傳批改結果與最新的觀念錯誤次數 */
export async function POST(request: Request) {
  return handle(request, Body, async ({ studentId, unitId, zh, targetConcepts, studentAnswer }) => {
    const unit = getUnit(unitId);
    if (!unit) throw new BadRequest("找不到這個單元");

    const grading = await generateJSON(
      GradingSchema,
      `請批改這題國中中翻英。

單元：${unitForPrompt(unit)}
中文題目：${zh}
學生答案：${studentAnswer}

批改原則：
- 只要文法正確、意思對就算對，不要求跟參考答案一字不差。
- corrections 每一筆只針對一個問題；kind=error 是一定要改的錯誤，kind=suggestion 是沒錯但可以更好。
- 大小寫、標點也要指出（通常是 minor）。
- 完全正確就給空陣列。
- conceptKey 只能從下列清單挑最貼切的一個：
${conceptListForPrompt()}`
    );

    const corrections = grading.corrections.map((c) => ({ ...c, conceptLabel: conceptLabel(c.conceptKey) }));

    let recordId: string | null = null;
    try {
      const record = await saveLearningRecord({
        studentId,
        grade: Math.ceil(unit.book / 2) + 6,
        unitId,
        sourceText: zh,
        topic: unit.theme,
        targetConcepts,
        studentAnswer,
        correctedAnswer: grading.correctedAnswer,
        referenceAnswers: grading.referenceAnswers,
        score: grading.score,
        isCorrect: grading.isCorrect,
        overallFeedback: grading.overallFeedback,
        aiModel: "claude-opus-5-5",
        corrections,
      } as Parameters<typeof saveLearningRecord>[0]);
      recordId = String(record._id);
    } catch (err) {
      console.error("儲存學習紀錄失敗", err);
    }

    const errorConcepts = corrections.filter((c) => c.kind === "error").map((c) => c.conceptKey);
    const warnings = await safeWarnings(studentId, errorConcepts);

    return { ...grading, corrections, recordId, saved: recordId !== null, warnings };
  });
}
