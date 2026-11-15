"use client";

import { useSyncExternalStore } from "react";

const STUDENT_KEY = "ai-english-tutor:studentId";

function readStudentId(): string {
  try {
    let id = localStorage.getItem(STUDENT_KEY);
    if (!id) {
      id = `student-${crypto.randomUUID()}`;
      localStorage.setItem(STUDENT_KEY, id);
    }
    return id;
  } catch {
    return "guest";
  }
}

/** 目前沒有帳號系統，先在瀏覽器產生一組學生 ID */
export function useStudentId(): string {
  return useSyncExternalStore(
    () => () => {},
    readStudentId,
    () => ""
  );
}

export async function postJSON<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? `請求失敗（${res.status}）`);
  return data as T;
}
