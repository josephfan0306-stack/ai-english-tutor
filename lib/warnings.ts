import "server-only";
import { getConceptWarnings } from "@/lib/learning-records";

export type ConceptWarning = {
  conceptKey: string;
  conceptLabel: string;
  errorCount: number;
  recentExamples: { originalText: string; correctedText: string }[];
};

/** 查詢觀念錯誤次數；資料庫連不上時不影響主流程，回傳空陣列 */
export async function safeWarnings(studentId: string | undefined, conceptKeys: string[]): Promise<ConceptWarning[]> {
  if (!studentId || conceptKeys.length === 0) return [];
  try {
    const docs = await getConceptWarnings(studentId, [...new Set(conceptKeys)]);
    return docs.map((d) => ({
      conceptKey: d.conceptKey,
      conceptLabel: d.conceptLabel,
      errorCount: d.errorCount ?? 0,
      recentExamples: (d.recentExamples ?? []).slice(-3).map((e) => ({
        originalText: e.originalText ?? "",
        correctedText: e.correctedText ?? "",
      })),
    }));
  } catch (err) {
    console.error("查詢觀念錯誤紀錄失敗", err);
    return [];
  }
}
