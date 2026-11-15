import { z } from "zod";
import { generateJSON } from "@/lib/anthropic";
import { handle, BadRequest } from "@/lib/api";
import { conceptLabel, conceptListForPrompt } from "@/lib/concepts";
import { getUnit, unitForPrompt } from "@/lib/curriculum";
import { MistakeExplanationSchema } from "@/lib/schemas";

const Body = z.object({
  unitId: z.string(),
  zh: z.string().min(1),
  studentAnswer: z.string().trim().min(1),
  // 批改時找到的錯誤，讓詳細解說跟批改結果一致
  corrections: z
    .array(z.object({ originalText: z.string(), correctedText: z.string(), conceptKey: z.string(), kind: z.string() }))
    .default([]),
});

/** 詳細解說學生寫錯的地方 */
export async function POST(request: Request) {
  return handle(request, Body, async ({ unitId, zh, studentAnswer, corrections }) => {
    const unit = getUnit(unitId);
    if (!unit) throw new BadRequest("找不到這個單元");

    const found = corrections.length
      ? corrections
          .map((c) => `- [${c.kind === "error" ? "錯誤" : "建議"}] ${c.originalText} → ${c.correctedText}（${conceptLabel(c.conceptKey)}）`)
          .join("\n")
      : "（批改沒有找到錯誤）";

    const result = await generateJSON(
      MistakeExplanationSchema,
      `請像家教老師一樣，詳細解說這位國中生的中翻英錯在哪裡。

單元：${unitForPrompt(unit)}
中文題目：${zh}
學生的答案：${studentAnswer}

批改時找到的問題：
${found}

要求：
- mistakes 以上面找到的問題為主，每個問題一筆，依重要程度排序；若學生完全正確，mistakes 給空陣列，summary 給肯定。
- whyWrong 要具體指出學生「為什麼會這樣寫」（例如受中文影響），再說明為什麼不對。
- examples 舉跟學生同類型的錯誤，幫助他舉一反三。
- conceptKey 只能從下列清單挑：
${conceptListForPrompt()}`
    );

    return {
      ...result,
      mistakes: result.mistakes.map((m) => ({ ...m, conceptLabel: conceptLabel(m.conceptKey) })),
    };
  });
}
