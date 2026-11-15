import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import type { z } from "zod";

const MODEL = "claude-opus-5-5";

// SDK 會自動讀取環境變數 ANTHROPIC_API_KEY（.env.local）
// 金鑰若沒綁定 workspace，需帶 anthropic-workspace-id 標頭（讀 ANTHROPIC_WORKSPACE_ID）
const workspaceId = process.env.ANTHROPIC_WORKSPACE_ID;
const client = new Anthropic({
  defaultHeaders: workspaceId ? { "anthropic-workspace-id": workspaceId } : undefined,
});

const SYSTEM_PROMPT = `你是一位資深的台灣國中英語老師，熟悉 108 課綱與翰林版國中英語課本。
你的學生是國中生，請用繁體中文解說、英文例句要符合該年級程度，用字不要超出國中範圍。
內容要原創，不要照抄任何出版社講義或課本原文。`;

export class AIError extends Error {
  constructor(
    message: string,
    public status = 500
  ) {
    super(message);
  }
}

type Effort = "low" | "medium" | "high";

/**
 * 呼叫 Claude 並用 zod schema 取得結構化 JSON
 */
export async function generateJSON<T extends z.ZodType>(
  schema: T,
  prompt: string | Anthropic.Beta.BetaContentBlockParam[],
  { effort = "medium", maxTokens = 16000 }: { effort?: Effort; maxTokens?: number } = {}
): Promise<z.infer<T>> {
  try {
    // 用串流避免長內容（例如考卷）觸發 HTTP 逾時，最後取完整訊息
    const response = await client.beta.messages
      .stream({
        model: MODEL,
        max_tokens: maxTokens,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: prompt }],
        output_config: { effort, format: betaZodOutputFormat(schema) },
        // 若模型因安全分類拒答，伺服器端自動改用備援模型重跑
        betas: ["server-side-fallback-2026-07-01"],
        fallbacks: "default",
      })
      .finalMessage();

    if (response.stop_reason === "refusal") {
      throw new AIError("AI 無法產生這份內容，請換個單元或稍後再試", 422);
    }
    if (response.stop_reason === "max_tokens") {
      throw new AIError("內容太長被截斷了，請減少題數再試一次", 422);
    }
    if (!response.parsed_output) {
      throw new AIError("AI 回傳的格式不正確，請再試一次", 502);
    }
    return response.parsed_output as z.infer<T>;
  } catch (err) {
    if (err instanceof AIError) throw err;
    if (err instanceof Anthropic.AuthenticationError) {
      throw new AIError("ANTHROPIC_API_KEY 無效，請檢查 .env.local", 500);
    }
    if (err instanceof Anthropic.RateLimitError) {
      throw new AIError("請求太頻繁，請稍後再試", 429);
    }
    if (err instanceof Anthropic.APIError) {
      throw new AIError(`AI 服務錯誤（${err.status}）：${err.message}`, 502);
    }
    throw err;
  }
}
