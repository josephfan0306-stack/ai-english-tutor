import "server-only";
import { z } from "zod";
import { AIError } from "@/lib/anthropic";

/** Route handler 共用：驗證 body、統一錯誤格式 */
export async function handle<B extends z.ZodType>(
  request: Request,
  bodySchema: B,
  fn: (body: z.infer<B>) => Promise<unknown>
) {
  let body: z.infer<B>;
  try {
    body = bodySchema.parse(await request.json());
  } catch {
    return Response.json({ error: "請求參數不正確" }, { status: 400 });
  }

  try {
    return Response.json(await fn(body));
  } catch (err) {
    if (err instanceof AIError) {
      return Response.json({ error: err.message }, { status: err.status });
    }
    console.error(err);
    return Response.json({ error: "伺服器發生錯誤，請稍後再試" }, { status: 500 });
  }
}

export class BadRequest extends AIError {
  constructor(message: string) {
    super(message, 400);
  }
}
