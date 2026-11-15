import { notFound } from "next/navigation";
import { CURRICULUM, getGrade } from "@/lib/curriculum";
import { PageShell } from "@/components/ui";
import { PracticeClient } from "@/components/PracticeClient";

export function generateStaticParams() {
  return CURRICULUM.map((g) => ({ grade: String(g.grade) }));
}

export default async function PracticePage(props: PageProps<"/grade/[grade]/practice">) {
  const grade = getGrade((await props.params).grade);
  if (!grade) notFound();
  return (
    <PageShell
      eyebrow={`Grade ${grade.grade} · Practice`}
      title={`${grade.label}｜練習`}
      subtitle="AI 出題、即時批改；中翻英的錯誤會記錄下來，下次遇到同樣觀念會提醒你"
      back={{ href: `/grade/${grade.grade}`, label: `${grade.label}英文` }}
    >
      <PracticeClient grade={grade} />
    </PageShell>
  );
}
