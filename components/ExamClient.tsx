"use client";

import { useState } from "react";
import type { Grade } from "@/lib/curriculum";
import type { Exam } from "@/lib/schemas";
import { postJSON } from "@/components/client-utils";
import { Button, Card, ErrorBox, Loading, Tabs, optionLetter } from "@/components/ui";

type Difficulty = "easy" | "medium" | "hard";

export function ExamClient({ grade }: { grade: Grade }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAnswers, setShowAnswers] = useState(false);

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  async function generate() {
    setLoading(true);
    setError("");
    setExam(null);
    setShowAnswers(false);
    try {
      setExam(await postJSON<Exam>("/api/exam", { unitIds: selected, difficulty }));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  const starts = (exam?.sections ?? []).reduce<number[]>(
    (acc, s, i) => [...acc, i === 0 ? 0 : acc[i - 1] + exam!.sections[i - 1].questions.length],
    []
  );

  return (
    <div className="space-y-6">
      <Card className="space-y-4 print:hidden">
        <div className="grid gap-4 sm:grid-cols-2">
          {grade.books.map((b) => {
            const ids = b.units.map((u) => u.id);
            const all = ids.every((id) => selected.includes(id));
            return (
              <div key={b.book}>
                <div className="flex items-center justify-between">
                  <p className="font-medium text-slate-900">{b.label}</p>
                  <button
                    type="button"
                    className="text-xs text-indigo-600 hover:underline"
                    onClick={() =>
                      setSelected((s) => (all ? s.filter((x) => !ids.includes(x)) : [...new Set([...s, ...ids])]))
                    }
                  >
                    {all ? "取消全選" : "全選"}
                  </button>
                </div>
                <div className="mt-2 space-y-1">
                  {b.units.map((u) => (
                    <label key={u.id} className="flex cursor-pointer items-start gap-2 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        className="mt-0.5"
                        checked={selected.includes(u.id)}
                        onChange={() => toggle(u.id)}
                      />
                      <span>
                        U{u.unit} {u.title}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Tabs<Difficulty>
            value={difficulty}
            onChange={setDifficulty}
            options={[
              { value: "easy", label: "基礎" },
              { value: "medium", label: "段考" },
              { value: "hard", label: "會考" },
            ]}
          />
          <Button onClick={generate} loading={loading} disabled={selected.length === 0}>
            生成考卷（{selected.length} 個單元）
          </Button>
        </div>
      </Card>

      {loading && <Loading text="AI 正在出考卷，題目比較多，大約需要 1-2 分鐘…" />}
      {error && <ErrorBox message={error} />}

      {exam && (
        <article className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm print:border-0 print:p-0 print:shadow-none">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900">{exam.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{exam.instructions}</p>
            <p className="mt-3 text-sm text-slate-500">班級：______　座號：______　姓名：____________　得分：______</p>
          </div>
          <div className="flex justify-end gap-2 print:hidden">
            <Button variant="secondary" onClick={() => setShowAnswers((v) => !v)}>
              {showAnswers ? "隱藏解答" : "顯示解答"}
            </Button>
            <Button variant="secondary" onClick={() => window.print()}>
              列印
            </Button>
          </div>

          {exam.sections.map((s, si) => (
            <section key={si}>
              <h3 className="font-bold text-slate-900">
                {s.name}
                <span className="ml-2 text-sm font-normal text-slate-500">
                  （每題 {s.pointsEach} 分，共 {s.pointsEach * s.questions.length} 分）
                </span>
              </h3>
              <p className="text-sm text-slate-600">{s.instructions}</p>
              {s.passage && (
                <p className="mt-3 whitespace-pre-line rounded-lg bg-slate-50 p-4 leading-relaxed text-slate-800">
                  {s.passage}
                </p>
              )}
              <ol className="mt-3 space-y-4">
                {s.questions.map((q, qi) => {
                  const qNo = starts[si] + qi + 1;
                  return (
                    <li key={qi} className="break-inside-avoid">
                      <p className="whitespace-pre-line text-slate-900">
                        {qNo}. {q.question}
                      </p>
                      {q.options.length > 0 && (
                        <p className="mt-1 flex flex-wrap gap-x-6 gap-y-1 pl-4 text-slate-700">
                          {q.options.map((o, oi) => (
                            <span key={oi}>
                              ({optionLetter(oi)}) {o}
                            </span>
                          ))}
                        </p>
                      )}
                      {(s.type === "translation" || s.type === "rewrite") && !showAnswers && (
                        <p className="mt-2 border-b border-slate-300 pb-5" />
                      )}
                      {showAnswers && (
                        <div className="mt-2 rounded-md bg-green-50 p-2 text-sm">
                          <p className="font-medium text-green-800">答案：{q.answer}</p>
                          <p className="text-slate-700">{q.explanation}</p>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ol>
            </section>
          ))}
        </article>
      )}
    </div>
  );
}
