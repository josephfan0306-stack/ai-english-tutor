"use client";

import { useEffect, useState } from "react";
import { useStudentId } from "@/components/client-utils";
import { Card } from "@/components/ui";

type Mistake = { conceptKey: string; conceptLabel: string; errorCount: number };

/** 首頁「我最常錯的觀念」 */
export function MistakesPanel() {
  const studentId = useStudentId();
  const [mistakes, setMistakes] = useState<Mistake[] | null>(null);

  useEffect(() => {
    if (!studentId) return;
    let cancelled = false;
    fetch(`/api/mistakes?studentId=${encodeURIComponent(studentId)}`)
      .then((r) => (r.ok ? r.json() : { mistakes: [] }))
      .then((d) => !cancelled && setMistakes(d.mistakes ?? []))
      .catch(() => !cancelled && setMistakes([]));
    return () => {
      cancelled = true;
    };
  }, [studentId]);

  return (
    <Card>
      <h2 className="font-semibold text-slate-900">📊 我最常錯的觀念</h2>
      {mistakes === null ? (
        <p className="mt-2 text-sm text-slate-500">讀取中…</p>
      ) : mistakes.length === 0 ? (
        <p className="mt-2 text-sm text-slate-500">還沒有紀錄。去做幾題中翻英練習，這裡會統計你的弱點。</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {mistakes.map((m) => (
            <li key={m.conceptKey} className="flex items-center gap-3 text-sm">
              <span className="w-48 shrink-0 text-slate-700">{m.conceptLabel}</span>
              <span
                className="h-2 rounded-full bg-red-400"
                style={{ width: `${Math.min(100, (m.errorCount / mistakes[0].errorCount) * 100)}%` }}
              />
              <span className="shrink-0 font-medium text-red-600">{m.errorCount} 次</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
