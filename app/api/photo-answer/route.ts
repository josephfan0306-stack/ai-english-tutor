import { z } from "zod";
import { generateJSON } from "@/lib/anthropic";
import { handle } from "@/lib/api";
import { conceptLabel, conceptListForPrompt } from "@/lib/concepts";
import { getGrade } from "@/lib/curriculum";
import { PhotoAnswerSchema } from "@/lib/schemas";

// Claude 單張圖片上限 5MB（base64 後約 6.7MB 字元）
const MAX_BASE64_LENGTH = 6_900_000;

const Body = z.object({
  imageBase64: z.string().min(100).max(MAX_BASE64_LENGTH),
  mediaType: z.enum(["image/jpeg", "image/png", "image/webp", "image/gif"]),
  question: z.string().max(500).default(""),
  grade: z.number().int().min(7).max(9).optional(),
});

/** 拍照問答案：辨識照片中的英文題目，回傳正確答案與解析 */
export async function POST(request: Request) {
  return handle(request, Body, async ({ imageBase64, mediaType, question, grade }) => {
    const gradeLabel = grade ? getGrade(grade)?.label : undefined;

    const result = await generateJSON(PhotoAnswerSchema, [
      { type: "image", source: { type: "base64", media_type: mediaType, data: imageBase64 } },
      {
        type: "text",
        text: `這是一位${gradeLabel ?? "國中"}學生拍的英文題目照片（可能是講義、考卷或作業）。

請：
1. 辨識照片中的每一題英文題目（含選項），照順序列出。
2. 如果照片上有學生手寫或圈選的答案，填在 studentAnswer，並判斷對錯。
3. 給出正確答案和清楚的中文解析，學生答錯時要說明錯在哪。
4. 照片模糊、太暗、不是英文題目時，readable 設為 false，並在 message 告訴學生怎麼重拍。
${question ? `\n學生的問題：${question}\n（請在解析或 overallComment 中特別回答這個問題）\n` : ""}
conceptKey 從下列觀念代碼中挑每題主要考的觀念：
${conceptListForPrompt()}`,
      },
    ]);

    return {
      ...result,
      questions: result.questions.map((q) => ({ ...q, conceptLabel: conceptLabel(q.conceptKey) })),
    };
  });
}
