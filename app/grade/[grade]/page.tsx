import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { CURRICULUM, getGrade } from "@/lib/curriculum";
import { PageShell } from "@/components/ui";
import { IconArrow, IconBook, IconExam, IconPen } from "@/components/icons";

export function generateStaticParams() {
  return CURRICULUM.map((g) => ({ grade: String(g.grade) }));
}

const FEATURES: { slug: string; icon: ReactNode; title: string; en: string; desc: string; items: string[] }[] = [
  {
    slug: "handout",
    icon: <IconBook className="h-5 w-5" />,
    title: "講義",
    en: "Handouts",
    desc: "依單元產生中翻英講義、文法與句型講義，可直接列印。",
    items: ["中翻英講義", "文法與句型"],
  },
  {
    slug: "practice",
    icon: <IconPen className="h-5 w-5" />,
    title: "練習",
    en: "Practice",
    desc: "AI 出題、即時批改，自動記錄你錯過的觀念；也可以拍照問答案。",
    items: ["中翻英練習", "文法與句型練習", "拍照問答案"],
  },
  {
    slug: "exam",
    icon: <IconExam className="h-5 w-5" />,
    title: "生成考卷",
    en: "Exams",
    desc: "勾選多個單元，產生一份 100 分完整評量卷，附解答。",
    items: ["字彙", "文法", "句型改寫", "中翻英", "閱讀"],
  },
];

export default async function GradePage(props: PageProps<"/grade/[grade]">) {
  const { grade: gradeParam } = await props.params;
  const grade = getGrade(gradeParam);
  if (!grade) notFound();

  return (
    <PageShell
      eyebrow={`Grade ${grade.grade}`}
      title={`${grade.label}英文`}
      subtitle="選擇你要使用的功能。"
      back={{ href: "/learn", label: "選擇年級" }}
    >
      <div className="grid gap-5 md:grid-cols-3">
        {FEATURES.map((f) => (
          <Link
            key={f.slug}
            href={`/grade/${grade.grade}/${f.slug}`}
            className="group flex flex-col rounded-3xl border border-slate-200 bg-white p-7 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift"
          >
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-ink text-gold">{f.icon}</span>
            <p className="mt-5 font-serif text-xs italic tracking-wide text-slate-400">{f.en}</p>
            <p className="font-serif text-2xl font-bold text-ink">{f.title}</p>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{f.desc}</p>
            <div className="mt-5 flex flex-wrap gap-1.5">
              {f.items.map((i) => (
                <span key={i} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600">
                  {i}
                </span>
              ))}
            </div>
            <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-indigo-700">
              開始 <IconArrow className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>

      <h2 className="mt-16 font-serif text-2xl font-bold text-ink">單元一覽</h2>
      <p className="mt-1 text-sm text-slate-500">每課的文法與句型重點</p>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {grade.books.map((b) => (
          <div key={b.book} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
            <p className="font-serif text-lg font-bold text-ink">{b.label}</p>
            <ol className="mt-4 space-y-4">
              {b.units.map((u) => (
                <li key={u.id} className="flex gap-4">
                  <span className="font-serif text-2xl font-bold italic leading-none text-indigo-200">
                    {String(u.unit).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="font-medium text-slate-900">{u.title}</p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      <span className="text-gold">{u.theme}</span>　{u.grammar.join("・")}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
