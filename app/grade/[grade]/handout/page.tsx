import { notFound } from "next/navigation";
import { CURRICULUM, getGrade } from "@/lib/curriculum";
import { PageShell } from "@/components/ui";
import { HandoutClient } from "@/components/HandoutClient";

export function generateStaticParams() {
  return CURRICULUM.map((g) => ({ grade: String(g.grade) }));
}

export default async function HandoutPage(props: PageProps<"/grade/[grade]/handout">) {
  const grade = getGrade((await props.params).grade);
  if (!grade) notFound();
  return (
    <PageShell
      eyebrow={`Grade ${grade.grade} · Handouts`}
      title={`${grade.label}｜講義`}
      subtitle="選擇單元與講義類型，AI 會為你整理重點"
      back={{ href: `/grade/${grade.grade}`, label: `${grade.label}英文` }}
    >
      <HandoutClient grade={grade} />
    </PageShell>
  );
}
