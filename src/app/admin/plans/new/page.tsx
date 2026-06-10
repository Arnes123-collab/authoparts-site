import Link from "next/link";
import { NewTrainingPlanForm } from "@/components/NewTrainingPlanForm";

export const dynamic = "force-dynamic";

export default function NewTrainingPlanPage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <section className="section-container py-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-black text-[var(--accent)]">Этап 5</p>
            <h1 className="text-4xl font-black">Создать тренировочный план</h1>
            <p className="mt-3 text-[var(--muted)]">Сначала выберите клиента и задайте цель плана.</p>
          </div>
          <Link href="/admin/plans" className="rounded-xl border border-[var(--border)] sport-card px-5 py-3 font-bold">К планам</Link>
        </div>

        <NewTrainingPlanForm />
      </section>
    </main>
  );
}
