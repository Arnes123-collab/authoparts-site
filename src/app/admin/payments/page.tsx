import Link from "next/link";
import { AdminPaymentsManager } from "@/components/AdminPaymentsManager";

export const dynamic = "force-dynamic";

export default function AdminPaymentsPage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <section className="section-container py-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-black text-[var(--accent)]">Этап 7</p>
            <h1 className="text-4xl font-black">Оплаты и тарифы</h1>
            <p className="mt-3 text-[var(--muted)]">Контроль оплат, сроков действия, пауз и просрочек по клиентам.</p>
          </div>
          <Link href="/admin" className="rounded-xl border border-[var(--border)] sport-card px-5 py-3 font-bold">Назад в админку</Link>
        </div>

        <AdminPaymentsManager />
      </section>
    </main>
  );
}
