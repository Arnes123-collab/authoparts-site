import Link from "next/link";
import { ClientReportForm } from "@/components/ClientReportForm";

export const dynamic = "force-dynamic";

export default function ReportPage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <section className="section-container py-10">
        <Link href="/" className="font-bold text-[var(--accent)]">← На главную</Link>
        <div className="mx-auto mt-8 max-w-3xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[var(--accent)]">Отчёт клиента</p>
          <h1 className="mt-3 text-4xl font-black md:text-5xl">Отправьте отчёт после тренировки</h1>
          <p className="mt-4 text-[var(--muted)]">Заполните выполнение тренировки, вес, сон, энергию, боль и питание. Тренер увидит отчёт в админ-панели.</p>
        </div>
        <ClientReportForm />
      </section>
    </main>
  );
}
