import Link from "next/link";
import { AdminPlansList } from "@/components/AdminPlansList";

export const dynamic = "force-dynamic";

export default function AdminPlansPage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <section className="section-container py-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-black text-[var(--accent)]">Этап 5</p>
            <h1 className="text-4xl font-black">Тренировочные планы</h1>
            <p className="mt-3 text-[var(--muted)]">Создавайте программы для клиентов и формируйте текст для WhatsApp.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin" className="rounded-xl border border-[var(--border)] sport-card px-5 py-3 font-bold">Назад</Link>
            <Link href="/admin/plans/new" className="rounded-xl bg-[var(--accent)] px-5 py-3 font-black text-white">Создать план</Link>
          </div>
        </div>

        <AdminPlansList />
      </section>
    </main>
  );
}
