import Link from "next/link";
import { AdminClientsTable } from "@/components/AdminClientsTable";

export const dynamic = "force-dynamic";
export default function AdminClientsPage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <section className="section-container py-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-black text-[var(--accent)]">Админ-панель</p>
            <h1 className="text-4xl font-black">Клиенты и заявки</h1>
          </div>
          <Link href="/admin" className="rounded-xl border border-[var(--border)] sport-card px-5 py-3 font-bold">Назад в админку</Link>
        </div>

        <AdminClientsTable />
      </section>
    </main>
  );
}
