"use client";

import { useState } from "react";
import type { Grade } from "@/lib/curriculum";
import type { Grading, GrammarQuestions, TranslationQuestions } from "@/lib/schemas";
import type { ConceptWarning } from "@/lib/warnings";
import { postJSON, useStudentId } from "@/components/client-utils";
import { Button, Card, ErrorBox, Loading, Tabs, UnitSelect, optionLetter } from "@/components/ui";
import { Warnings } from "@/components/Warnings";
import { AnswerTools } from "@/components/AnswerTools";
import { PhotoAsk } from "@/components/PhotoAsk";

type PracticeType = "translation" | "grammar";

type PracticeResponse =
  | ({ type: "translation"; unitId: string; warnings: ConceptWarning[] } & TranslationQuestions)
  | ({ type: "grammar"; unitId: string; warnings: ConceptWarning[] } & GrammarQuestions);

export function PracticeClient({ grade }: { grade: Grade }) {
  const studentId = useStudentId();
  const [unitId, setUnitId] = useState(grade.books[0].units[0].id);
  const [type, setType] = useState<PracticeType>("translation");
  const [count, setCount] = useState(5);
  const [data, setData] = useState<PracticeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generate() {
    setLoading(true);
    setError("");
    setData(null);
    try {
      setData(await postJSON<PracticeResponse>("/api/practice", { unitId, type, count, studentId }));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <Tabs<PracticeType>
          value={type}
          onChange={setType}
          options={[
            { value: "translation", label: "中翻英練習" },
            { value: "grammar", label: "文法與句型練習" },
          ]}
        />
        <div className="flex flex-col gap-3 sm:flex-row">
          <UnitSelect grade={grade} value={unitId} onChange={setUnitId} />
          <select
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-slate-900 shadow-soft focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-100"
          >
            {[5, 8, 10].map((n) => (
              <option key={n} value={n}>
                {n} 題
              </option>
            ))}
          </select>
          <Button onClick={generate} loading={loading} disabled={!studentId} className="shrink-0">
            開始練習
          </Button>
        </div>
      </Card>

      <PhotoAsk grade={grade.grade} />

      {loading && <Loading text="AI 正在出題，大約需要 20-40 秒…" />}
      {error && <ErrorBox message={error} />}

      {data && (
        <>
          <Warnings warnings={data.warnings} title="出題提醒：這些觀念你以前錯過，這次要特別注意" />
          {data.type === "translation" ? (
            <div className="space-y-4">
              {data.questions.map((q, i) => (
                <TranslationItem key={`${data.unitId}-${i}`} index={i} q={q} unitId={data.unitId} studentId={studentId} />
              ))}
            </div>
          ) : (
            <GrammarPractice key={data.unitId + data.questions.length} questions={data.questions} />
          )}
        </>
      )}
    </div>
  );
}

// ─────────────── 中翻英：逐題批改
type GradeResponse = Omit<Grading, "corrections"> & {
  corrections: (Grading["corrections"][number] & { conceptLabel: string })[];
  saved: boolean;
  warnings: ConceptWarning[];
};

function TranslationItem({
  index,
  q,
  unitId,
  studentId,
}: {
  index: number;
  q: TranslationQuestions["questions"][number];
  unitId: string;
  studentId: string;
}) {
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<GradeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    setLoading(true);
    setError("");
    try {
      setResult(
        await postJSON<GradeResponse>("/api/practice/grade", {
          studentId,
          unitId,
          zh: q.zh,
          targetConcepts: q.targetConcepts,
          studentAnswer: answer,
        })
      );
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <p className="font-medium text-slate-900">
        {index + 1}. {q.zh}
      </p>
      {q.hint && <p className="mt-1 text-sm text-slate-500">提示：{q.hint}</p>}
      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        disabled={!!result}
        rows={2}
        placeholder="請輸入英文翻譯…"
        className="mt-3 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none disabled:bg-slate-50"
      />
      {!result && (
        <div className="mt-2 flex items-center gap-3">
          <Button onClick={submit} loading={loading} disabled={!answer.trim()}>
            送出批改
          </Button>
          {loading && <span className="text-sm text-slate-500">AI 批改中，約 10-30 秒…</span>}
        </div>
      )}
      {error && <div className="mt-3"><ErrorBox message={error} /></div>}

      {result && (
        <div className="mt-4 space-y-3">
          <div className={`rounded-lg p-3 ${result.isCorrect ? "bg-green-50" : "bg-red-50"}`}>
            <p className={`font-semibold ${result.isCorrect ? "text-green-700" : "text-red-700"}`}>
              {result.isCorrect ? "✓ 答對了！" : "✗ 還有地方要修正"}　{result.score} 分
            </p>
            <p className="mt-1 text-slate-700">{result.overallFeedback}</p>
          </div>

          {!result.isCorrect && (
            <p className="text-slate-800">
              <span className="text-sm text-slate-500">修正後：</span>
              {result.correctedAnswer}
            </p>
          )}

          {result.corrections.length > 0 && (
            <ul className="space-y-2">
              {result.corrections.map((c, i) => (
                <li key={i} className="rounded-lg border border-slate-200 p-3 text-sm">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded px-1.5 py-0.5 text-xs font-medium ${
                        c.kind === "error" ? "bg-red-100 text-red-700" : "bg-sky-100 text-sky-700"
                      }`}
                    >
                      {c.kind === "error" ? "錯誤" : "建議"}
                    </span>
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600">{c.conceptLabel}</span>
                  </div>
                  <p className="mt-1">
                    <span className="text-red-600 line-through">{c.originalText}</span> →{" "}
                    <span className="font-medium text-green-700">{c.correctedText}</span>
                  </p>
                  <p className="mt-1 text-slate-600">{c.explanation}</p>
                  {c.example && <p className="mt-1 text-slate-500">例：{c.example}</p>}
                </li>
              ))}
            </ul>
          )}

          <p className="text-sm text-slate-600">
            參考答案：{result.referenceAnswers.join("　/　")}
          </p>

          <Warnings warnings={result.warnings} title="這題犯錯的觀念，累計次數" />
          {!result.saved && <p className="text-xs text-amber-600">（這次紀錄沒有存進資料庫）</p>}

          <AnswerTools unitId={unitId} zh={q.zh} studentAnswer={answer} corrections={result.corrections} />
        </div>
      )}
    </Card>
  );
}

// ─────────────── 文法與句型：作答後一次對答案
function normalize(s: string) {
  return s.toLowerCase().replace(/[.,!?'’"]/g, "").replace(/\s+/g, " ").trim();
}

function GrammarPractice({ questions }: { questions: GrammarQuestions["questions"] }) {
  const [answers, setAnswers] = useState<string[]>(() => questions.map(() => ""));
  const [checked, setChecked] = useState(false);

  const isRight = (i: number) => {
    const q = questions[i];
    return [q.answer, ...q.acceptableAnswers].some((a) => normalize(a) === normalize(answers[i]));
  };
  const score = questions.filter((_, i) => isRight(i)).length;

  return (
    <div className="space-y-4">
      {questions.map((q, i) => (
        <Card key={i}>
          <p className="text-xs text-slate-500">
            {q.type === "multiple-choice" ? "選擇題" : q.type === "fill-in" ? "填空題" : "句型改寫"}
          </p>
          <p className="mt-1 whitespace-pre-line font-medium text-slate-900">
            {i + 1}. {q.question}
          </p>
          {q.type === "multiple-choice" ? (
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {q.options.map((opt, j) => (
                <label
                  key={j}
                  className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                    answers[i] === opt ? "border-indigo-500 bg-indigo-50" : "border-slate-200"
                  }`}
                >
                  <input
                    type="radio"
                    name={`q${i}`}
                    disabled={checked}
                    checked={answers[i] === opt}
                    onChange={() => setAnswers((a) => a.map((v, k) => (k === i ? opt : v)))}
                  />
                  ({optionLetter(j)}) {opt}
                </label>
              ))}
            </div>
          ) : (
            <input
              value={answers[i]}
              disabled={checked}
              onChange={(e) => setAnswers((a) => a.map((v, k) => (k === i ? e.target.value : v)))}
              placeholder="請輸入答案"
              className="mt-3 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 disabled:bg-slate-50"
            />
          )}
          {checked && (
            <div className={`mt-3 rounded-lg p-3 text-sm ${isRight(i) ? "bg-green-50" : "bg-red-50"}`}>
              <p className={isRight(i) ? "font-medium text-green-700" : "font-medium text-red-700"}>
                {isRight(i) ? "✓ 正確" : `✗ 正確答案：${q.answer}`}
              </p>
              <p className="mt-1 text-slate-700">{q.explanation}</p>
            </div>
          )}
        </Card>
      ))}
      {checked ? (
        <Card className="text-center">
          <p className="text-lg font-bold text-slate-900">
            答對 {score} / {questions.length} 題
          </p>
          <p className="mt-1 text-sm text-slate-500">
            填空與改寫題是用字串比對，如果你的寫法也合理但被判錯，請參考解析。
          </p>
        </Card>
      ) : (
        <Button onClick={() => setChecked(true)} disabled={answers.some((a) => !a.trim())}>
          對答案
        </Button>
      )}
    </div>
  );
}
