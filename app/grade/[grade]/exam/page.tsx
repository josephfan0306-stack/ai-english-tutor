import { notFound } from "next/navigation";
import { CURRICULUM, getGrade } from "@/lib/curriculum";
import { PageShell } from "@/components/ui";
import { ExamClient } from "@/components/ExamClient";

export function generateStaticParams() {
  return CURRICULUM.map((g) => ({ grade: String(g.grade) }));
}

export default async function ExamPage(props: PageProps<"/grade/[grade]/exam">) {
  const grade = getGrade((await props.params).grade);
  if (!grade) notFound();
  return (
    <PageShell
      eyebrow={`Grade ${grade.grade} · Exams`}
      title={`${grade.label}｜生成考卷`}
      subtitle="勾選要考的單元，AI 會產生一份 100 分的評量卷"
      back={{ href: `/grade/${grade.grade}`, label: `${grade.label}英文` }}
    >
      <ExamClient grade={grade} />
    </PageShell>
  );
}
