import Link from "next/link";
import { AdminReportsManager } from "@/components/AdminReportsManager";

export const dynamic = "force-dynamic";

export default function AdminReportsPage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <section className="section-container py-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-black text-[var(--accent)]">Этап 8</p>
            <h1 className="text-4xl font-black">Отчёты клиентов</h1>
            <p className="mt-3 text-[var(--muted)]">Контроль выполнения, веса, сна, энергии, боли и питания.</p>
          </div>
          <Link href="/admin" className="rounded-xl border border-[var(--border)] sport-card px-5 py-3 font-bold">Назад в админку</Link>
        </div>
        <AdminReportsManager />
      </section>
    </main>
  );
}
