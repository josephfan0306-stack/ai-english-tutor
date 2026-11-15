import { getTopMistakes } from "@/lib/learning-records";

/** 學生最常錯的觀念排行：GET /api/mistakes?studentId=xxx */
export async function GET(request: Request) {
  const studentId = new URL(request.url).searchParams.get("studentId");
  if (!studentId) return Response.json({ error: "缺少 studentId" }, { status: 400 });

  try {
    const docs = await getTopMistakes(studentId, 10);
    return Response.json({
      mistakes: docs.map((d) => ({
        conceptKey: d.conceptKey,
        conceptLabel: d.conceptLabel,
        errorCount: d.errorCount ?? 0,
        lastSeenAt: d.lastSeenAt,
      })),
    });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "讀取紀錄失敗" }, { status: 500 });
  }
}
