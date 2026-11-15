import Link from "next/link";
import type { ReactNode } from "react";
import type { Grade } from "@/lib/curriculum";

export function PageShell({
  title,
  subtitle,
  back,
  eyebrow,
  children,
}: {
  title: string;
  subtitle?: string;
  back?: { href: string; label: string };
  eyebrow?: string;
  children: ReactNode;
}) {
  return (
    <main className="relative flex-1">
      <div className="bg-dots pointer-events-none absolute inset-x-0 top-0 h-72 [mask-image:linear-gradient(to_bottom,black,transparent)] print:hidden" />
      <div className="relative mx-auto w-full max-w-5xl px-4 pb-20 pt-8 sm:px-6 sm:pt-12">
        {back && (
          <Link
            href={back.href}
            className="group inline-flex items-center gap-1.5 text-sm text-slate-500 transition hover:text-ink print:hidden"
          >
            <span className="transition-transform group-hover:-translate-x-0.5">←</span> {back.label}
          </Link>
        )}
        {eyebrow && (
          <p className="mt-4 font-serif text-sm italic tracking-wide text-gold">{eyebrow}</p>
        )}
        <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight text-ink sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-3 max-w-2xl leading-relaxed text-slate-600">{subtitle}</p>}
        <div className="mt-8 animate-rise">{children}</div>
      </div>
    </main>
  );
}

export function UnitSelect({
  grade,
  value,
  onChange,
}: {
  grade: Grade;
  value: string;
  onChange: (unitId: string) => void;
}) {
  return (
    <div className="relative w-full">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-4 pr-10 text-slate-900 shadow-soft transition focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-100"
      >
        {grade.books.map((b) => (
          <optgroup key={b.book} label={b.label}>
            {b.units.map((u) => (
              <option key={u.id} value={u.id}>
                Unit {u.unit}　{u.title}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">▼</span>
    </div>
  );
}

export function Tabs<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div className="inline-flex rounded-full border border-slate-200 bg-slate-100/70 p-1">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
            value === o.value ? "bg-white text-ink shadow-soft" : "text-slate-500 hover:text-slate-900"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Button({
  children,
  loading,
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean; variant?: "primary" | "secondary" }) {
  const styles =
    variant === "primary"
      ? "bg-ink text-white shadow-soft hover:bg-indigo-800 hover:shadow-lift disabled:bg-slate-300 disabled:shadow-none"
      : "border border-slate-200 bg-white text-slate-700 shadow-soft hover:border-slate-300 hover:text-ink disabled:text-slate-400";
  return (
    <button
      {...props}
      disabled={props.disabled || loading}
      className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-medium transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed ${styles} ${props.className ?? ""}`}
    >
      {loading && <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />}
      {loading ? "處理中…" : children}
    </button>
  );
}

export function Loading({ text = "AI 正在產生內容，大約需要 30 秒到 1 分鐘…" }: { text?: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-indigo-100 bg-white p-5 shadow-soft">
      <div className="flex items-center gap-3 text-sm text-indigo-800">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-60" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-gold" />
        </span>
        {text}
      </div>
      <div className="mt-4 space-y-2.5">
        {[92, 78, 85].map((w) => (
          <div
            key={w}
            className="h-2.5 animate-shimmer rounded-full bg-[linear-gradient(90deg,var(--color-slate-100),var(--color-slate-200),var(--color-slate-100))] bg-[length:200%_100%]"
            style={{ width: `${w}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export function ErrorBox({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50/80 p-4 text-sm text-red-700">
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-bold">!</span>
      {message}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-slate-200/80 bg-white p-6 shadow-soft ${className}`}>{children}</div>
  );
}

export function optionLetter(i: number) {
  return String.fromCharCode(65 + i);
}
