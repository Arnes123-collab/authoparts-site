import { LeadForm } from "@/components/LeadForm";

export const dynamic = "force-dynamic";
const services = [
  {
    title: "Похудение без хаоса",
    text: "План тренировок и питания под цель клиента, уровень подготовки и реальные ограничения.",
  },
  {
    title: "Набор мышц",
    text: "Прогрессия нагрузки, контроль техники, восстановление и понятная структура занятий.",
  },
  {
    title: "Тренировки после 40",
    text: "Безопасная силовая работа с акцентом на суставы, спину, плечи и стабильный прогресс.",
  },
];

const prices = [
  { name: "Старт", price: "от 5 000 тг", details: "разбор цели и базовый план" },
  { name: "План на месяц", price: "от 15 000 тг", details: "тренировки + рекомендации" },
  { name: "Онлайн-ведение", price: "от 40 000 тг", details: "контроль, отчёты, корректировки" },
];

const steps = [
  "Клиент оставляет заявку",
  "Тренер проводит первичный разбор",
  "Создаётся программа тренировок",
  "Добавляется план питания",
  "Клиент отправляет отчёты",
  "Тренер корректирует нагрузку",
];

export default function Home() {
  return (
    <main>
      <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[#050505e6] backdrop-blur">
        <div className="section-container flex items-center justify-between py-4">
          <a href="#top" className="text-xl font-black tracking-tight">
            Fitness Coach <span className="text-[var(--accent)]">Pro</span>
          </a>
          <nav className="hidden gap-6 text-sm font-semibold text-[var(--muted)] md:flex">
            <a href="#services">Услуги</a>
            <a href="#pricing">Тарифы</a>
            <a href="#process">Процесс</a>
            <a href="#request">Заявка</a>
          </nav>
          <a
            href="#request"
            className="rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-bold text-white transition hover:bg-[var(--accent-dark)]"
          >
            Оставить заявку
          </a>
        </div>
      </header>

      <section id="top" className="section-container grid gap-10 py-16 md:grid-cols-[1.1fr_0.9fr] md:py-24">
        <div className="flex flex-col justify-center">
          <p className="mb-4 w-fit rounded-full border border-[var(--border)] sport-card px-4 py-2 text-sm font-bold text-[var(--accent)]">
            Веб-система для фитнес-тренера
          </p>
          <h1 className="text-4xl font-black leading-tight tracking-tight md:text-6xl">
            Сайт, заявки, клиенты, тренировки и питание в одной системе
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
            Fitness Coach Pro помогает тренеру принимать заявки, вести клиентов, создавать программы тренировок,
            добавлять питание, контролировать отчёты и оплату.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#request"
              className="rounded-xl bg-[var(--accent)] px-7 py-4 text-center font-black text-white transition hover:bg-[var(--accent-dark)]"
            >
              Получить консультацию
            </a>
            <a
              href="#services"
              className="rounded-xl border border-[var(--border)] sport-card px-7 py-4 text-center font-black"
            >
              Посмотреть услуги
            </a>
          </div>
        </div>

        <div className="card-shadow rounded-[32px] bg-[var(--card)] p-6">
          <div className="rounded-[24px] bg-[var(--surface-strong)] p-6 text-white">
            <p className="text-sm font-bold text-[#f0c36a]">Панель тренера</p>
            <h2 className="mt-3 text-3xl font-black">Клиенты под контролем</h2>
            <div className="mt-8 grid gap-3">
              {[
                ["Активные клиенты", "24"],
                ["Планы тренировок", "68"],
                ["Планы питания", "31"],
                ["Отчёты за неделю", "112"],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between rounded-2xl bg-white/10 p-4">
                  <span className="text-white/75">{label}</span>
                  <span className="text-2xl font-black">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="bg-white py-16">
        <div className="section-container">
          <h2 className="text-3xl font-black md:text-4xl">Кому подходит</h2>
          <p className="mt-4 max-w-2xl text-[var(--muted)]">
            Продукт подходит для фитнес-тренеров, тренеров по похудению, онлайн-коучей и специалистов,
            работающих с клиентами после 40 лет.
          </p>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {services.map((service) => (
              <article key={service.title} className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
                <h3 className="text-xl font-black">{service.title}</h3>
                <p className="mt-3 leading-7 text-[var(--muted)]">{service.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="section-container py-16">
        <h2 className="text-3xl font-black md:text-4xl">Тарифы тренера</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {prices.map((item) => (
            <article key={item.name} className="card-shadow rounded-3xl sport-card p-6">
              <h3 className="text-xl font-black">{item.name}</h3>
              <p className="mt-4 text-3xl font-black text-[var(--accent)]">{item.price}</p>
              <p className="mt-3 text-[var(--muted)]">{item.details}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="process" className="bg-[var(--surface-strong)] py-16 text-white">
        <div className="section-container">
          <h2 className="text-3xl font-black md:text-4xl">Как проходит работа</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step} className="rounded-3xl sport-card/10 p-6">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-[var(--accent)] font-black">
                  {index + 1}
                </div>
                <p className="text-lg font-bold">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="request" className="section-container py-16">
        <div className="grid gap-8 rounded-[32px] sport-card p-6 card-shadow md:grid-cols-[0.9fr_1.1fr] md:p-10">
          <div>
            <h2 className="text-3xl font-black md:text-4xl">Оставить заявку</h2>
            <p className="mt-4 leading-7 text-[var(--muted)]">
              На втором этапе форма уже отправляет заявку через API Route Handler и сохраняет данные клиента
              в таблицу Supabase <strong>clients</strong>.
            </p>
          </div>
          <LeadForm />
        </div>
      </section>

      <footer className="border-t border-[var(--border)] py-8">
        <div className="section-container flex flex-col gap-2 text-sm text-[var(--muted)] md:flex-row md:items-center md:justify-between">
          <p>Fitness Coach Pro v1.0</p>
          <p>Сайт и веб-система для тренера</p>
        </div>
      </footer>
    </main>
  );
}
