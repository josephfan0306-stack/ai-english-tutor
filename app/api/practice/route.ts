import { z } from "zod";
import { generateJSON } from "@/lib/anthropic";
import { handle, BadRequest } from "@/lib/api";
import { conceptListForPrompt } from "@/lib/concepts";
import { getUnit, unitForPrompt } from "@/lib/curriculum";
import { GrammarQuestionsSchema, TranslationQuestionsSchema } from "@/lib/schemas";
import { safeWarnings } from "@/lib/warnings";

const Body = z.object({
  unitId: z.string(),
  type: z.enum(["translation", "grammar"]),
  count: z.number().int().min(3).max(15).default(5),
  studentId: z.string().optional(),
});

/** 產生練習題，並附上「這些觀念你以前錯過幾次」的提醒 */
export async function POST(request: Request) {
  return handle(request, Body, async ({ unitId, type, count, studentId }) => {
    const unit = getUnit(unitId);
    if (!unit) throw new BadRequest("找不到這個單元");

    // 先查學生在本單元觀念上的錯誤紀錄，讓 AI 針對弱點多出題
    const pastWarnings = await safeWarnings(studentId, unit.concepts);
    const weakness = pastWarnings.length
      ? `\n這位學生以前常錯的觀念（請多安排相關題目）：${pastWarnings
          .map((w) => `${w.conceptLabel}（錯 ${w.errorCount} 次）`)
          .join("、")}`
      : "";

    if (type === "translation") {
      const result = await generateJSON(
        TranslationQuestionsSchema,
        `單元：${unitForPrompt(unit)}${weakness}

請出 ${count} 題中翻英練習題，由易到難，每題一句，要用到本課的文法句型。
hint 給一點提示（例如關鍵字或要用的句型），但不要直接給答案。
targetConcepts 從下列觀念代碼中挑 1-3 個這題主要考的觀念：
${conceptListForPrompt()}`,
        { effort: "low" }
      );
      const warnings = await safeWarnings(studentId, result.questions.flatMap((q) => q.targetConcepts));
      return { type, unitId, ...result, warnings };
    }

    const result = await generateJSON(
      GrammarQuestionsSchema,
      `單元：${unitForPrompt(unit)}${weakness}

請出 ${count} 題文法與句型練習題，混合選擇題（multiple-choice）、填空題（fill-in）、句型改寫（rewrite），以選擇題為主。
選擇題的選項要有鑑別度，干擾選項要是學生真的會選錯的。
conceptKey 從下列觀念代碼中挑這題主要考的觀念：
${conceptListForPrompt()}`,
      { effort: "low" }
    );
    const warnings = await safeWarnings(studentId, result.questions.map((q) => q.conceptKey));
    return { type, unitId, ...result, warnings };
  });
}
