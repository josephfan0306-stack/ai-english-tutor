import type { ConceptWarning } from "@/lib/warnings";

/** 「這個觀念你錯過 N 次」提醒 */
export function Warnings({ warnings, title = "注意！這些觀念你以前錯過" }: { warnings: ConceptWarning[]; title?: string }) {
  if (warnings.length === 0) return null;
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
      <p className="font-semibold text-amber-900">⚠️ {title}</p>
      <ul className="mt-2 space-y-2">
        {warnings.map((w) => (
          <li key={w.conceptKey} className="text-sm text-amber-900">
            <span className="font-medium">{w.conceptLabel}</span>：已經錯了{" "}
            <span className="font-bold text-red-600">{w.errorCount}</span> 次
            {w.recentExamples.length > 0 && (
              <span className="block text-amber-800">
                上次：<s>{w.recentExamples.at(-1)!.originalText}</s> → {w.recentExamples.at(-1)!.correctedText}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
