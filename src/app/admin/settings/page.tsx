import Link from "next/link";
import { AdminBrandSettings } from "@/components/AdminBrandSettings";

export const dynamic = "force-dynamic";

export default function AdminSettingsPage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <section className="section-container py-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-black text-[var(--accent-gold)]">Этап 12</p>
            <h1 className="text-4xl font-black">Брендирование тренера</h1>
            <p className="mt-3 text-[var(--muted)]">Фото, логотип, контакты, оффер и спортивная цветовая схема шаблона.</p>
          </div>
          <Link href="/admin" className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 py-3 font-bold">Назад в админку</Link>
        </div>
        <AdminBrandSettings />
      </section>
    </main>
  );
}
