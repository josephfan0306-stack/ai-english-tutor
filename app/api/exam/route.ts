import { z } from "zod";
import { generateJSON } from "@/lib/anthropic";
import { handle, BadRequest } from "@/lib/api";
import { getUnit, unitForPrompt } from "@/lib/curriculum";
import { ExamSchema } from "@/lib/schemas";

const Body = z.object({
  unitIds: z.array(z.string()).min(1).max(12),
  difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
});

const DIFFICULTY = { easy: "基礎（課本程度）", medium: "中等（段考程度）", hard: "進階（會考程度）" };

export async function POST(request: Request) {
  return handle(request, Body, async ({ unitIds, difficulty }) => {
    const units = unitIds.map(getUnit);
    if (units.some((u) => !u)) throw new BadRequest("有單元不存在");

    return generateJSON(
      ExamSchema,
      `請出一份國中英語考卷，總分 100 分，難度：${DIFFICULTY[difficulty]}。

範圍：
${units.map((u) => `- ${unitForPrompt(u!)}`).join("\n")}

考卷結構（依序）：
1. 字彙選擇（multiple-choice）10 題
2. 文法選擇（multiple-choice）10 題
3. 句型改寫（rewrite）5 題
4. 中翻英（translation）5 題
5. 閱讀測驗（reading）1 篇短文，3 題選擇題

要求：
- 題目平均分配到每個範圍單元。
- pointsEach 讓總分剛好 100 分。
- 每題都要附答案與中文解析。
- title 例如「國中英語 第X冊 Unit X-X 評量卷」。`,
      { maxTokens: 32000 }
    );
  });
}
