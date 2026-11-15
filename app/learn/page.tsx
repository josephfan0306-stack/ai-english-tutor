import Link from "next/link";
import { CURRICULUM } from "@/lib/curriculum";
import { PageShell } from "@/components/ui";
import { MistakesPanel } from "@/components/MistakesPanel";
import { IconArrow } from "@/components/icons";

/** 學習入口：選年級 + 我的弱點 */
export default function LearnPage() {
  return (
    <PageShell eyebrow="Start learning" title="選擇你的年級" subtitle="選好年級後，就可以使用講義、練習和生成考卷。">
      <div className="grid gap-5 md:grid-cols-3">
        {CURRICULUM.map((g) => (
          <Link
            key={g.grade}
            href={`/grade/${g.grade}`}
            className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift"
          >
            <span className="absolute -right-3 -top-6 font-serif text-[7rem] font-bold italic leading-none text-slate-100 transition group-hover:text-indigo-50">
              {g.grade}
            </span>
            <p className="relative text-sm text-slate-500">{g.grade} 年級</p>
            <p className="relative mt-1 font-serif text-3xl font-bold text-ink">{g.label}英文</p>
            <p className="relative mt-4 text-sm text-slate-600">{g.books.map((b) => b.label).join("・")}</p>
            <span className="relative mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-indigo-700">
              進入 <IconArrow className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>
      <div className="mt-10">
        <MistakesPanel />
      </div>
    </PageShell>
  );
}
