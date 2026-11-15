import { z } from "zod";
import { generateJSON } from "@/lib/anthropic";
import { handle, BadRequest } from "@/lib/api";
import { getUnit, unitForPrompt } from "@/lib/curriculum";
import { HandoutSchema } from "@/lib/schemas";

const Body = z.object({
  unitId: z.string(),
  type: z.enum(["translation", "grammar"]),
});

export async function POST(request: Request) {
  return handle(request, Body, async ({ unitId, type }) => {
    const unit = getUnit(unitId);
    if (!unit) throw new BadRequest("找不到這個單元");

    const focus =
      type === "translation"
        ? `請製作「中翻英講義」：
- sections：整理 3-5 個本課最常考的中翻英句型，每個要有中文解說、句型公式、3 個例句（中英對照）。
- commonMistakes：台灣學生中翻英最常犯的 4-6 個錯誤（中式英文、時態、語序等）。
- practiceSentences：8 句由易到難的中翻英練習句，附參考答案。`
        : `請製作「文法與句型講義」：
- sections：把本課文法拆成 3-5 個小重點，每個要有清楚的中文解說、句型公式、3 個例句（中英對照），note 可以放易混淆的提醒。
- commonMistakes：4-6 個常見錯誤（錯誤句 → 正確句 → 原因）。
- practiceSentences：6 句應用本課文法的中翻英練習句，附參考答案。`;

    return generateJSON(
      HandoutSchema,
      `單元：${unitForPrompt(unit)}

${focus}

title 用「${unit.title}｜${type === "translation" ? "中翻英講義" : "文法與句型講義"}」。`
    );
  });
}
