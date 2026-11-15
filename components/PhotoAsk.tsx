"use client";

import { useRef, useState } from "react";
import type { PhotoAnswer } from "@/lib/schemas";
import { postJSON } from "@/components/client-utils";
import { Button, Card, ErrorBox, Loading } from "@/components/ui";

type PhotoAnswerResponse = Omit<PhotoAnswer, "questions"> & {
  questions: (PhotoAnswer["questions"][number] & { conceptLabel: string })[];
};

const MAX_SIDE = 1800; // 長邊縮到 1800px，文字仍清楚、檔案也夠小

/** 在瀏覽器把照片縮小並轉成 JPEG base64 */
async function compressImage(file: File): Promise<{ base64: string; preview: string }> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("瀏覽器不支援圖片處理");
  ctx.fillStyle = "#fff"; // 透明背景（PNG）補白
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
  return { base64: dataUrl.split(",")[1], preview: dataUrl };
}

const VERDICT = {
  correct: { label: "✓ 你答對了", className: "bg-green-100 text-green-700" },
  incorrect: { label: "✗ 你答錯了", className: "bg-red-100 text-red-700" },
  unanswered: { label: "未作答", className: "bg-slate-100 text-slate-600" },
};

export function PhotoAsk({ grade }: { grade: number }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState<{ base64: string; preview: string } | null>(null);
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<PhotoAnswerResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // 讓同一張照片可以再選一次
    if (!file) return;
    setError("");
    setResult(null);
    if (!file.type.startsWith("image/")) {
      setError("請選擇圖片檔（jpg、png…）");
      return;
    }
    try {
      setImage(await compressImage(file));
    } catch {
      setError("這張圖片無法讀取，請換一張或改用 jpg / png 格式");
    }
  }

  async function ask() {
    if (!image) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      setResult(
        await postJSON<PhotoAnswerResponse>("/api/photo-answer", {
          imageBase64: image.base64,
          mediaType: "image/jpeg",
          question,
          grade,
        })
      );
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <Button variant="secondary" onClick={() => setOpen(true)}>
        📷 拍照問答案
      </Button>
    );
  }

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-slate-900">📷 拍照問答案</h2>
        <button type="button" onClick={() => setOpen(false)} className="text-sm text-slate-500 hover:text-slate-800">
          收起 ✕
        </button>
      </div>
      <p className="text-sm text-slate-600">拍下講義、考卷或作業上的英文題目，AI 會告訴你正確答案和解析；有寫答案的話也會幫你對答案。</p>

      {/* capture 讓手機直接開相機；電腦則是選檔案 */}
      <input ref={inputRef} type="file" accept="image/*" capture="environment" onChange={onFile} className="hidden" />

      {image ? (
        <div className="space-y-3">
          {/* eslint-disable-next-line @next/next/no-img-element -- 本機 data URL 預覽，不需要 next/image */}
          <img src={image.preview} alt="上傳的題目照片" className="max-h-80 rounded-lg border border-slate-200" />
          <Button variant="secondary" onClick={() => inputRef.current?.click()}>
            重新選擇照片
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center gap-1 rounded-xl border-2 border-dashed border-slate-300 py-10 text-slate-500 hover:border-indigo-400 hover:text-indigo-600"
        >
          <span className="text-3xl">📷</span>
          <span>點這裡拍照或選擇照片</span>
        </button>
      )}

      <input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="想特別問什麼？（選填，例如：第 3 題為什麼不能用 was？）"
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none"
      />

      <Button onClick={ask} loading={loading} disabled={!image}>
        詢問正確答案
      </Button>

      {loading && <Loading text="AI 正在看你的照片，大約需要 20-40 秒…" />}
      {error && <ErrorBox message={error} />}

      {result && !result.readable && <ErrorBox message={result.message || "照片看不清楚，請在光線充足的地方正面重拍"} />}

      {result && result.readable && (
        <div className="space-y-3">
          {result.questions.map((q, i) => (
            <div key={i} className="rounded-lg border border-slate-200 p-4 text-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-slate-900">第 {q.number} 題</span>
                <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${VERDICT[q.verdict].className}`}>
                  {VERDICT[q.verdict].label}
                </span>
                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600">{q.conceptLabel}</span>
              </div>
              <p className="mt-2 whitespace-pre-line text-slate-800">{q.question}</p>
              {q.studentAnswer && (
                <p className="mt-2 text-slate-600">
                  你的答案：
                  <span className={q.verdict === "incorrect" ? "text-red-600 line-through" : ""}>{q.studentAnswer}</span>
                </p>
              )}
              <p className="mt-1 font-medium text-green-700">正確答案：{q.correctAnswer}</p>
              <p className="mt-1 text-slate-700">{q.explanation}</p>
            </div>
          ))}
          {result.overallComment && (
            <p className="rounded-lg bg-indigo-50 p-3 text-sm text-indigo-900">💬 {result.overallComment}</p>
          )}
        </div>
      )}
    </Card>
  );
}
