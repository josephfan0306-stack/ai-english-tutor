import Link from "next/link";
import { CURRICULUM } from "@/lib/curriculum";
import {
  IconArrow,
  IconBook,
  IconCamera,
  IconChart,
  IconCheck,
  IconExam,
  IconMemory,
  IconPen,
  IconSpark,
} from "@/components/icons";

const unitCount = CURRICULUM.reduce((n, g) => n + g.books.reduce((m, b) => m + b.units.length, 0), 0);

export default function Landing() {
  return (
    <main className="overflow-x-clip">
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <Memory />
      <Grades />
      <FinalCTA />
    </main>
  );
}

/* ───────────────────────── Hero ───────────────────────── */
function Hero() {
  return (
    <section className="relative">
      <div className="bg-dots absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_70%)]" />
      <div className="absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-indigo-200/40 blur-3xl" />
      <div className="absolute right-[-10%] top-40 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:pb-28 lg:pt-24">
        <div className="animate-rise">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-medium text-slate-600 shadow-soft backdrop-blur">
            <IconSpark className="h-3.5 w-3.5 text-gold" />
            國中英語 · 翰林版單元 · AI 家教
          </span>
          <h1 className="mt-6 font-serif text-[2.4rem] font-bold leading-[1.2] tracking-tight text-ink sm:text-5xl xl:text-[3.6rem]">
            每一次寫錯，
            <br />
            都是<span className="highlight px-1">下一次寫對</span>
            <br />
            的開始。
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
            依照課本單元產生講義、即時批改你的中翻英，並且
            <strong className="font-medium text-ink">記住你錯過的每一個觀念</strong>
            ——下次遇到類似題目，它會先提醒你。
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/learn"
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-ink px-7 font-medium text-white shadow-lift transition hover:bg-indigo-800"
            >
              開始學習
              <IconArrow className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#how"
              className="inline-flex h-12 items-center rounded-full border border-slate-300 bg-white/60 px-6 font-medium text-slate-700 backdrop-blur transition hover:border-slate-400 hover:text-ink"
            >
              看看怎麼運作
            </a>
          </div>
          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
            {["國一到國三全冊", `${unitCount} 個課本單元`, "中翻英即時批改"].map((t) => (
              <li key={t} className="flex items-center gap-1.5">
                <IconCheck className="h-4 w-4 text-gold" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <HeroMock />
      </div>
    </section>
  );
}

/** 首頁右側的產品示意畫面（純展示） */
function HeroMock() {
  return (
    <div className="relative mx-auto w-full max-w-md animate-rise [animation-delay:150ms] lg:max-w-none">
      {/* 背後的講義紙 */}
      <div className="absolute -left-6 top-10 hidden h-[88%] w-[88%] -rotate-6 rounded-3xl border border-slate-200 bg-white/70 shadow-soft sm:block" />

      <div className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-lift sm:p-7">
        <div className="flex items-center justify-between">
          <p className="font-serif text-xs italic tracking-wide text-slate-400">Unit 1 · Have You Had Breakfast Yet?</p>
          <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">中翻英</span>
        </div>
        <p className="mt-4 text-lg font-medium text-ink">我已經寫完我的功課了。</p>

        <div className="mt-4 rounded-2xl bg-slate-50 p-4">
          <p className="text-xs text-slate-400">你的答案</p>
          <p className="mt-1 font-serif text-[17px] text-slate-800">
            I <span className="text-red-500 line-through decoration-2">already finish</span>{" "}
            <span className="rounded bg-emerald-50 px-1 font-medium text-emerald-700">have already finished</span> my
            homework.
          </p>
        </div>

        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-slate-100 p-4">
          <span className="mt-0.5 shrink-0 whitespace-nowrap rounded-md bg-red-50 px-1.5 py-0.5 text-[11px] font-medium text-red-600">錯誤</span>
          <p className="text-sm leading-relaxed text-slate-600">
            「已經……了」要用<strong className="font-medium text-ink">現在完成式</strong> have + p.p.，already 放在 have
            和過去分詞之間。
          </p>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
          <div className="flex gap-2">
            <span className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs text-slate-600">給我正確答案</span>
            <span className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs text-slate-600">詳細解釋</span>
          </div>
          <span className="font-serif text-2xl font-bold text-ink">
            60<span className="text-sm font-normal text-slate-400"> 分</span>
          </span>
        </div>
      </div>

      {/* 浮動提醒卡 */}
      <div className="absolute -bottom-16 right-4 w-60 animate-float sm:-right-6 rounded-2xl border border-amber-200 bg-amber-50/95 p-4 shadow-lift backdrop-blur sm:-right-8">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-amber-900">
          <IconMemory className="h-4 w-4" /> 觀念提醒
        </p>
        <p className="mt-1.5 text-sm text-amber-900">
          「現在完成式」你已經錯了 <span className="font-serif text-lg font-bold text-red-600">3</span> 次
        </p>
      </div>
      <div className="absolute -left-4 -top-5 hidden animate-float rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-lift [animation-delay:1.5s] sm:block">
        <p className="text-[11px] text-slate-400">AI 批改</p>
        <p className="flex items-center gap-1 font-serif text-lg font-bold text-emerald-600">
          <IconCheck className="h-4 w-4" /> 完成
        </p>
      </div>
    </div>
  );
}

/* ───────────────────────── Stats ───────────────────────── */
function Stats() {
  const items = [
    { k: "3", v: "個年級", d: "國一到國三，六冊課本" },
    { k: String(unitCount), v: "個單元", d: "依翰林版課程計畫整理" },
    { k: "4", v: "種學習方式", d: "講義、練習、考卷、拍照問" },
    { k: "∞", v: "次耐心", d: "AI 家教不會不耐煩" },
  ];
  return (
    <section className="border-y border-slate-200 bg-white/60">
      <dl className="mx-auto grid max-w-6xl grid-cols-2 divide-slate-200 px-4 sm:px-6 lg:grid-cols-4 lg:divide-x">
        {items.map((s) => (
          <div key={s.v} className="px-2 py-8 lg:px-8">
            <dt className="flex items-baseline gap-1.5">
              <span className="font-serif text-4xl font-bold text-ink">{s.k}</span>
              <span className="text-sm font-medium text-slate-700">{s.v}</span>
            </dt>
            <dd className="mt-1 text-sm text-slate-500">{s.d}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/* ───────────────────────── Features ───────────────────────── */
function SectionHeading({ eyebrow, title, desc }: { eyebrow: string; title: string; desc: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="font-serif text-sm italic tracking-wide text-gold">{eyebrow}</p>
      <h2 className="mt-3 font-serif text-3xl font-bold tracking-tight text-ink sm:text-4xl">{title}</h2>
      <p className="mt-4 leading-relaxed text-slate-600">{desc}</p>
    </div>
  );
}

function Features() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <SectionHeading
        eyebrow="Everything you need"
        title="一個家教，四種學法"
        desc="從理解觀念、動手練習到模擬考試，每一步都對準課本進度。"
      />

      <div className="mt-14 grid gap-5 lg:grid-cols-6">
        {/* 講義 */}
        <article className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-soft transition hover:shadow-lift lg:col-span-4">
          <FeatureIcon><IconBook className="h-5 w-5" /></FeatureIcon>
          <h3 className="mt-5 font-serif text-2xl font-bold text-ink">講義</h3>
          <p className="mt-2 max-w-md text-slate-600">
            選一個單元，馬上得到一份重點講義：句型公式、中英例句、常見錯誤，還附中翻英練習句。可以直接列印。
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-indigo-50/70 p-4">
              <p className="text-xs font-medium text-indigo-700">句型</p>
              <p className="mt-1 font-mono text-sm text-indigo-900">S + have/has + p.p.</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-medium text-slate-500">常見錯誤</p>
              <p className="mt-1 text-sm">
                <span className="text-red-500 line-through">I have went</span> → <span className="text-emerald-700">I have gone</span>
              </p>
            </div>
          </div>
        </article>

        {/* 練習 */}
        <article className="relative overflow-hidden rounded-3xl bg-ink p-8 text-white shadow-lift lg:col-span-2">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold/30 blur-2xl" />
          <FeatureIcon dark><IconPen className="h-5 w-5" /></FeatureIcon>
          <h3 className="mt-5 font-serif text-2xl font-bold">練習與批改</h3>
          <p className="mt-2 text-indigo-100/80">
            中翻英逐題即時批改，再一鍵看「正確答案怎麼寫出來」與「我錯在哪」的詳細解說。
          </p>
          <div className="relative mt-6 space-y-2">
            {["給我正確答案", "詳細解釋我錯在哪"].map((t) => (
              <div key={t} className="flex items-center justify-between rounded-xl bg-white/[0.07] px-4 py-2.5 text-sm ring-1 ring-white/10">
                {t}
                <IconArrow className="h-4 w-4 text-gold" />
              </div>
            ))}
          </div>
        </article>

        {/* 考卷 */}
        <article className="group rounded-3xl border border-slate-200 bg-white p-8 shadow-soft transition hover:shadow-lift lg:col-span-3">
          <FeatureIcon><IconExam className="h-5 w-5" /></FeatureIcon>
          <h3 className="mt-5 font-serif text-2xl font-bold text-ink">生成考卷</h3>
          <p className="mt-2 text-slate-600">
            勾選範圍單元、選擇難度，產出 100 分完整評量卷：字彙、文法、句型改寫、中翻英、閱讀測驗，附詳解。
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {["基礎", "段考", "會考"].map((t) => (
              <span key={t} className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600">
                {t}
              </span>
            ))}
          </div>
        </article>

        {/* 拍照 */}
        <article className="group rounded-3xl border border-slate-200 bg-gold-soft/60 p-8 shadow-soft transition hover:shadow-lift lg:col-span-3">
          <FeatureIcon><IconCamera className="h-5 w-5" /></FeatureIcon>
          <h3 className="mt-5 font-serif text-2xl font-bold text-ink">拍照問答案</h3>
          <p className="mt-2 text-slate-700">
            作業不會寫？拍下題目上傳，AI 會辨識每一題、對你寫的答案，告訴你正確答案和原因。
          </p>
        </article>
      </div>
    </section>
  );
}

function FeatureIcon({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <span
      className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${
        dark ? "bg-white/10 text-gold ring-1 ring-white/15" : "bg-ink text-gold"
      }`}
    >
      {children}
    </span>
  );
}

/* ───────────────────────── How it works ───────────────────────── */
function HowItWorks() {
  const steps = [
    { n: "01", t: "選年級與單元", d: "對照課本進度，從國一到國三，選你正在學的那一課。" },
    { n: "02", t: "作答、即時批改", d: "AI 逐句批改，指出每個錯誤屬於哪個文法觀念，並說明原因。" },
    { n: "03", t: "記住你的弱點", d: "錯誤會被記錄；下次出題時針對弱點加強，並提醒你小心。" },
  ];
  return (
    <section id="how" className="scroll-mt-20 border-y border-slate-200 bg-white/60">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <SectionHeading eyebrow="How it works" title="三步驟，學一次就記住" desc="不只是給答案，而是讓你知道下一次怎麼自己寫對。" />
        <ol className="mt-16 grid gap-10 md:grid-cols-3 md:gap-6">
          {steps.map((s, i) => (
            <li key={s.n} className="relative">
              {i < steps.length - 1 && (
                <span className="absolute left-16 top-7 hidden h-px w-[calc(100%-4rem)] bg-gradient-to-r from-slate-300 to-transparent md:block" />
              )}
              <span className="font-serif text-5xl font-bold italic text-indigo-200">{s.n}</span>
              <h3 className="mt-4 font-serif text-xl font-bold text-ink">{s.t}</h3>
              <p className="mt-2 leading-relaxed text-slate-600">{s.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ───────────────────────── Memory ───────────────────────── */
function Memory() {
  const bars = [
    { l: "現在完成式", n: 7 },
    { l: "第三人稱單數加 s", n: 5 },
    { l: "介系詞", n: 4 },
    { l: "冠詞 a / an / the", n: 2 },
  ];
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <div className="relative overflow-hidden rounded-[2rem] bg-ink px-6 py-14 text-white shadow-lift sm:px-14">
        <div className="bg-dots absolute inset-0 opacity-20" />
        <div className="absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-indigo-500/30 blur-3xl" />
        <div className="relative grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="font-serif text-sm italic tracking-wide text-gold">A tutor that remembers</p>
            <h2 className="mt-3 font-serif text-3xl font-bold leading-snug sm:text-4xl">
              它記得你上次
              <br />
              在哪裡跌倒。
            </h2>
            <p className="mt-5 max-w-md leading-relaxed text-indigo-100/80">
              每一次批改，錯誤都會依文法觀念歸類累計。出新題目前先查你的紀錄，對你最常錯的觀念多出題、先提醒——就像一位真的認識你的家教。
            </p>
            <Link
              href="/learn"
              className="mt-8 inline-flex h-11 items-center gap-2 rounded-full bg-white px-6 text-sm font-medium text-ink transition hover:bg-gold-soft"
            >
              查看我的弱點 <IconArrow className="h-4 w-4" />
            </Link>
          </div>
          <div className="rounded-3xl bg-white/[0.06] p-6 ring-1 ring-white/10 backdrop-blur">
            <p className="flex items-center gap-2 text-sm text-indigo-100/80">
              <IconChart className="h-4 w-4 text-gold" /> 我最常錯的觀念
            </p>
            <ul className="mt-5 space-y-4">
              {bars.map((b) => (
                <li key={b.l}>
                  <div className="flex justify-between text-sm">
                    <span>{b.l}</span>
                    <span className="font-serif text-gold">{b.n} 次</span>
                  </div>
                  <div className="mt-1.5 h-2 rounded-full bg-white/10">
                    <div className="h-2 rounded-full bg-gradient-to-r from-gold to-amber-300" style={{ width: `${(b.n / 7) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Grades ───────────────────────── */
function Grades() {
  return (
    <section id="grades" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-24 sm:px-6">
      <SectionHeading eyebrow="Choose your grade" title="從你的年級開始" desc="每個年級涵蓋上下兩冊課本，所有單元都可以產生講義、練習和考卷。" />
      <div className="mt-14 grid gap-5 md:grid-cols-3">
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
            <ul className="relative mt-5 space-y-1.5 text-sm text-slate-600">
              {g.books.map((b) => (
                <li key={b.book} className="flex justify-between border-b border-dashed border-slate-200 pb-1.5">
                  <span>{b.label}</span>
                  <span className="text-slate-400">{b.units.length} 課</span>
                </li>
              ))}
            </ul>
            <span className="relative mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-indigo-700">
              進入學習 <IconArrow className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ───────────────────────── Final CTA ───────────────────────── */
function FinalCTA() {
  return (
    <section className="border-t border-slate-200 bg-white/60">
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <h2 className="font-serif text-3xl font-bold tracking-tight text-ink sm:text-4xl">今天，就寫對一句英文。</h2>
        <p className="mt-4 text-slate-600">不用註冊，選好年級就能開始。</p>
        <Link
          href="/learn"
          className="group mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-ink px-8 font-medium text-white shadow-lift transition hover:bg-indigo-800"
        >
          開始學習 <IconArrow className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
