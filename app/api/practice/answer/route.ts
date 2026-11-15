import { z } from "zod";
import { generateJSON } from "@/lib/anthropic";
import { handle, BadRequest } from "@/lib/api";
import { getUnit, unitForPrompt } from "@/lib/curriculum";
import { ModelAnswerSchema } from "@/lib/schemas";

const Body = z.object({
  unitId: z.string(),
  zh: z.string().min(1),
  studentAnswer: z.string().default(""),
});

/** 給正確答案，並一步步說明怎麼從中文翻成英文 */
export async function POST(request: Request) {
  return handle(request, Body, async ({ unitId, zh, studentAnswer }) => {
    const unit = getUnit(unitId);
    if (!unit) throw new BadRequest("找不到這個單元");

    return generateJSON(
      ModelAnswerSchema,
      `請針對這題國中中翻英，給出正確答案，並教學生怎麼一步步寫出來。

單元：${unitForPrompt(unit)}
中文題目：${zh}
學生的答案：${studentAnswer || "（未作答）"}

要求：
- bestAnswer 要自然、符合本單元句型，用字在國中程度內。
- steps 是「看到中文 → 寫出英文」的思考過程，讓學生下次能自己寫出來。
- keyVocabulary 列 2-4 個這題的關鍵字詞。`,
      { effort: "low" }
    );
  });
}
