import Link from "next/link";
import { CURRICULUM } from "@/lib/curriculum";
import { LogoMark } from "@/components/icons";

export function Brand() {
  return (
    <Link href="/" className="group flex items-center gap-2.5">
      <LogoMark className="h-8 w-8 transition-transform duration-300 group-hover:-rotate-6" />
      <span className="leading-none">
        <span className="block font-serif text-lg font-bold tracking-tight text-ink">墨學</span>
        <span className="block font-serif text-[11px] italic tracking-wide text-slate-500">Inkwell English</span>
      </span>
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-paper/80 backdrop-blur-md print:hidden">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Brand />
        <nav className="flex items-center gap-1 text-sm">
          {CURRICULUM.map((g) => (
            <Link
              key={g.grade}
              href={`/grade/${g.grade}`}
              className="hidden rounded-full px-3 py-1.5 text-slate-600 transition hover:bg-slate-100 hover:text-ink sm:block"
            >
              {g.label}
            </Link>
          ))}
          <Link
            href="/learn"
            className="ml-2 rounded-full bg-ink px-4 py-2 font-medium text-white shadow-soft transition hover:bg-indigo-800"
          >
            開始學習
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-paper print:hidden">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div className="max-w-sm">
          <Brand />
          <p className="mt-3 text-sm leading-relaxed text-slate-500">
            把每一次寫錯，變成下一次寫對。為國中生設計的 AI 英文家教。
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 text-sm">
          <div>
            <p className="font-medium text-slate-900">年級</p>
            <ul className="mt-2 space-y-1.5 text-slate-500">
              {CURRICULUM.map((g) => (
                <li key={g.grade}>
                  <Link href={`/grade/${g.grade}`} className="hover:text-ink">
                    {g.label}英文
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-medium text-slate-900">說明</p>
            <ul className="mt-2 space-y-1.5 text-slate-500">
              <li>單元依各校公開之翰林版課程計畫整理</li>
              <li>講義與題目由 AI 原創生成</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
