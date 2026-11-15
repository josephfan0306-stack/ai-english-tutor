"use client";

import { useState } from "react";
import type { MistakeExplanation, ModelAnswer } from "@/lib/schemas";
import { postJSON } from "@/components/client-utils";
import { Button, ErrorBox, Loading } from "@/components/ui";

type Explanation = Omit<MistakeExplanation, "mistakes"> & {
  mistakes: (MistakeExplanation["mistakes"][number] & { conceptLabel: string })[];
};

type Panel<T> = { open: boolean; loading: boolean; error: string; data: T | null };
const initial = { open: false, loading: false, error: "", data: null };

/** 中翻英批改後的兩個按鈕：給我正確答案／詳細解釋我錯在哪 */
export function AnswerTools({
  unitId,
  zh,
  studentAnswer,
  corrections,
}: {
  unitId: string;
  zh: string;
  studentAnswer: string;
  corrections: { originalText: string; correctedText: string; conceptKey: string; kind: string }[];
}) {
  const [answer, setAnswer] = useState<Panel<ModelAnswer>>(initial);
  const [explain, setExplain] = useState<Panel<Explanation>>(initial);

  // 已經載入過就只切換顯示，不重複呼叫 API
  async function toggle<T>(
    panel: Panel<T>,
    set: React.Dispatch<React.SetStateAction<Panel<T>>>,
    url: string,
    body: unknown
  ) {
    if (panel.data || panel.loading) {
      set((p) => ({ ...p, open: !p.open }));
      return;
    }
    set({ open: true, loading: true, error: "", data: null });
    try {
      const data = await postJSON<T>(url, body);
      set({ open: true, loading: false, error: "", data });
    } catch (e) {
      set({ open: true, loading: false, error: (e as Error).message, data: null });
    }
  }

  return (
    <div className="space-y-3 border-t border-slate-100 pt-3">
      <div className="flex flex-wrap gap-2">
        <Button
          variant={answer.open ? "primary" : "secondary"}
          onClick={() => toggle(answer, setAnswer, "/api/practice/answer", { unitId, zh, studentAnswer })}
        >
          ✅ 給我正確答案
        </Button>
        <Button
          variant={explain.open ? "primary" : "secondary"}
          onClick={() =>
            toggle(explain, setExplain, "/api/practice/explain", { unitId, zh, studentAnswer, corrections })
          }
        >
          🔍 詳細解釋我錯在哪
        </Button>
      </div>

      {answer.open && (
        <section className="rounded-xl border border-green-200 bg-green-50/50 p-4">
          <h4 className="font-semibold text-green-800">✅ 正確答案</h4>
          {answer.loading && <Loading text="AI 正在整理正確答案…" />}
          {answer.error && <ErrorBox message={answer.error} />}
          {answer.data && <ModelAnswerView data={answer.data} />}
        </section>
      )}

      {explain.open && (
        <section className="rounded-xl border border-orange-200 bg-orange-50/50 p-4">
          <h4 className="font-semibold text-orange-800">🔍 錯誤詳細解說</h4>
          {explain.loading && <Loading text="AI 老師正在分析你的錯誤…" />}
          {explain.error && <ErrorBox message={explain.error} />}
          {explain.data && <ExplanationView data={explain.data} />}
        </section>
      )}
    </div>
  );
}

function ModelAnswerView({ data }: { data: ModelAnswer }) {
  return (
    <div className="mt-2 space-y-4 text-sm">
      <p className="rounded-lg bg-white p-3 text-lg font-medium text-slate-900">{data.bestAnswer}</p>
      {data.comparison && <p className="text-slate-700">💬 {data.comparison}</p>}

      {data.pattern && (
        <div>
          <p className="font-medium text-slate-800">句型</p>
          <p className="mt-1 inline-block rounded-md bg-indigo-50 px-3 py-1 font-mono text-indigo-900">{data.pattern}</p>
        </div>
      )}

      <div>
        <p className="font-medium text-slate-800">怎麼一步步寫出來</p>
        <ol className="mt-1 space-y-1.5">
          {data.steps.map((s, i) => (
            <li key={i} className="flex gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-600 text-xs text-white">
                {i + 1}
              </span>
              <span>
                <span className="font-medium text-slate-900">{s.step}</span>
                <span className="text-slate-600">：{s.explanation}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>

      {data.keyVocabulary.length > 0 && (
        <div>
          <p className="font-medium text-slate-800">關鍵字詞</p>
          <ul className="mt-1 space-y-1">
            {data.keyVocabulary.map((v, i) => (
              <li key={i}>
                <span className="font-medium text-slate-900">{v.word}</span>
                <span className="text-slate-500">（{v.meaning}）</span>
                <span className="text-slate-600">— {v.usage}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {data.alternatives.length > 0 && (
        <div>
          <p className="font-medium text-slate-800">其他正確寫法</p>
          <ul className="mt-1 space-y-1">
            {data.alternatives.map((a, i) => (
              <li key={i}>
                <span className="text-slate-900">{a.en}</span>
                {a.note && <span className="block text-slate-500">{a.note}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function ExplanationView({ data }: { data: Explanation }) {
  return (
    <div className="mt-2 space-y-4 text-sm">
      <p className="text-base text-slate-800">{data.summary}</p>

      {data.mistakes.map((m, i) => (
        <div key={i} className="rounded-lg bg-white p-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-900">錯誤 {i + 1}</span>
            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600">{m.conceptLabel}</span>
          </div>
          <p className="mt-1">
            <span className="text-red-600 line-through">{m.yourText}</span> →{" "}
            <span className="font-medium text-green-700">{m.correctText}</span>
          </p>
          <p className="mt-2 text-slate-700">
            <span className="font-medium">為什麼錯：</span>
            {m.whyWrong}
          </p>
          <p className="mt-1 whitespace-pre-line text-slate-700">
            <span className="font-medium">文法規則：</span>
            {m.rule}
          </p>
          {m.examples.length > 0 && (
            <ul className="mt-2 space-y-1 border-l-2 border-orange-200 pl-3">
              {m.examples.map((ex, j) => (
                <li key={j}>
                  <span className="text-red-500 line-through">{ex.wrong}</span> →{" "}
                  <span className="text-green-700">{ex.right}</span>
                  <span className="text-slate-500">（{ex.zh}）</span>
                </li>
              ))}
            </ul>
          )}
          {m.tip && <p className="mt-2 text-amber-700">💡 {m.tip}</p>}
        </div>
      ))}

      <p>
        <span className="font-medium text-slate-800">改正後的你的句子：</span>
        <span className="text-green-700">{data.correctedAnswer}</span>
      </p>

      {data.checklist.length > 0 && (
        <div>
          <p className="font-medium text-slate-800">下次寫之前先檢查</p>
          <ul className="mt-1 space-y-0.5">
            {data.checklist.map((c, i) => (
              <li key={i}>☐ {c}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
