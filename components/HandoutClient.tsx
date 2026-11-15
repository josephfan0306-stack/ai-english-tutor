"use client";

import { useState } from "react";
import type { Grade } from "@/lib/curriculum";
import type { Handout } from "@/lib/schemas";
import { postJSON } from "@/components/client-utils";
import { Button, Card, ErrorBox, Loading, Tabs, UnitSelect } from "@/components/ui";

type HandoutType = "translation" | "grammar";

export function HandoutClient({ grade }: { grade: Grade }) {
  const [unitId, setUnitId] = useState(grade.books[0].units[0].id);
  const [type, setType] = useState<HandoutType>("translation");
  const [handout, setHandout] = useState<Handout | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAnswers, setShowAnswers] = useState(false);

  async function generate() {
    setLoading(true);
    setError("");
    setHandout(null);
    setShowAnswers(false);
    try {
      setHandout(await postJSON<Handout>("/api/handout", { unitId, type }));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card className="space-y-4 print:hidden">
        <Tabs<HandoutType>
          value={type}
          onChange={setType}
          options={[
            { value: "translation", label: "中翻英講義" },
            { value: "grammar", label: "文法與句型" },
          ]}
        />
        <div className="flex flex-col gap-3 sm:flex-row">
          <UnitSelect grade={grade} value={unitId} onChange={setUnitId} />
          <Button onClick={generate} loading={loading} className="shrink-0">
            產生講義
          </Button>
        </div>
      </Card>

      {loading && <Loading />}
      {error && <ErrorBox message={error} />}

      {handout && (
        <article className="space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{handout.title}</h2>
              <p className="mt-2 text-slate-700">{handout.summary}</p>
            </div>
            <Button variant="secondary" onClick={() => window.print()} className="shrink-0 print:hidden">
              列印
            </Button>
          </div>

          {handout.sections.map((s, i) => (
            <Card key={i}>
              <h3 className="text-lg font-semibold text-indigo-700">
                {i + 1}. {s.heading}
              </h3>
              {s.pattern && (
                <p className="mt-2 inline-block rounded-md bg-indigo-50 px-3 py-1 font-mono text-sm text-indigo-900">
                  {s.pattern}
                </p>
              )}
              <p className="mt-2 whitespace-pre-line text-slate-700">{s.explanation}</p>
              <ul className="mt-3 space-y-2">
                {s.examples.map((ex, j) => (
                  <li key={j} className="border-l-2 border-indigo-200 pl-3">
                    <p className="text-slate-900">{ex.en}</p>
                    <p className="text-sm text-slate-500">{ex.zh}</p>
                    {ex.note && <p className="text-sm text-amber-700">💡 {ex.note}</p>}
                  </li>
                ))}
              </ul>
            </Card>
          ))}

          {handout.commonMistakes.length > 0 && (
            <Card>
              <h3 className="text-lg font-semibold text-red-700">常見錯誤</h3>
              <ul className="mt-3 space-y-3">
                {handout.commonMistakes.map((m, i) => (
                  <li key={i}>
                    <p>
                      <span className="text-red-600 line-through">✗ {m.wrong}</span>
                    </p>
                    <p className="text-green-700">✓ {m.right}</p>
                    <p className="text-sm text-slate-600">{m.explanation}</p>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {handout.practiceSentences.length > 0 && (
            <Card>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">中翻英練習</h3>
                <Button variant="secondary" onClick={() => setShowAnswers((v) => !v)} className="print:hidden">
                  {showAnswers ? "隱藏答案" : "顯示答案"}
                </Button>
              </div>
              <ol className="mt-3 list-decimal space-y-2 pl-6">
                {handout.practiceSentences.map((p, i) => (
                  <li key={i}>
                    <p className="text-slate-900">{p.zh}</p>
                    {showAnswers ? (
                      <p className="text-sm text-green-700">{p.en}</p>
                    ) : (
                      <p className="border-b border-dashed border-slate-300 py-2" />
                    )}
                  </li>
                ))}
              </ol>
            </Card>
          )}
        </article>
      )}
    </div>
  );
}
