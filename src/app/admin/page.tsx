import Link from "next/link";
import { AdminStats } from "@/components/AdminStats";

export const dynamic = "force-dynamic";
const adminSections = [
  { title: "Клиенты", href: "/admin/clients", description: "Просмотр заявок и клиентской базы." },
  { title: "CMS упражнений", href: "/admin/exercises", description: "Большая база упражнений: категории, теги, замены, фильтры и активность." },
  { title: "Тренировочные планы", href: "/admin/plans", description: "Создание программ, упражнения с фото и WhatsApp-текст." },
  { title: "Оплаты", href: "/admin/payments", description: "Тарифы, даты оплат, сроки действия и просрочки." },
  { title: "Питание", href: "/admin/nutrition", description: "Планы питания: калории, БЖУ, вода и рекомендации." },
  { title: "Отчёты", href: "/admin/reports", description: "Отчёты клиентов по тренировкам, питанию, боли и самочувствию." },
  { title: "Замеры тела", href: "/admin/measurements", description: "Вес, талия, грудь, бёдра и другие контрольные замеры." },
  { title: "Аналитика", href: "/admin/analytics", description: "Сводка прогресса: вес, талия, выполнение тренировок, боль и энергия." },
  { title: "Шаблоны", href: "/admin/templates", description: "Готовые шаблоны тренировок и питания для разных целей клиентов." },
  { title: "Брендирование", href: "/admin/settings", description: "Тёмная спортивная тема, фото, логотип, контакты, оффер и цвета тренера." },
];

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <section className="section-container py-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-black text-[var(--accent)]">Этап 12</p>
            <h1 className="text-4xl font-black">Админ-панель тренера</h1>
            <p className="mt-3 text-[var(--muted)]">Закрытая зона для управления заявками, клиентами, упражнениями, тренировочными планами, оплатами, питанием, отчётами, аналитикой, шаблонами и расширенной CMS упражнений и брендированием тренера.</p>
          </div>
          <Link href="/" className="rounded-xl border border-[var(--border)] sport-card px-5 py-3 font-bold">На сайт</Link>
        </div>

        <AdminStats />

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {adminSections.map((section) => (
            <Link key={section.title} href={section.href} className="rounded-3xl sport-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <h2 className="text-2xl font-black">{section.title}</h2>
              <p className="mt-3 text-[var(--muted)]">{section.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
