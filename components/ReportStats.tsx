import type { DailyReport } from "@/types/daily-report";

type ReportStatsProps = {
  reports: DailyReport[];
};

function money(value: number) {
  return new Intl.NumberFormat("ru-RU").format(value);
}

export default function ReportStats({ reports }: ReportStatsProps) {
  const totals = reports.reduce(
    (acc, report) => {
      acc.processedLeads += report.processedLeads;
      acc.sentOffers += report.sentOffers;
      acc.clientReplies += report.clientReplies;
      acc.rejections += report.rejections;
      acc.salesCount += report.salesCount;
      acc.salesAmount += report.salesAmount;
      return acc;
    },
    {
      processedLeads: 0,
      sentOffers: 0,
      clientReplies: 0,
      rejections: 0,
      salesCount: 0,
      salesAmount: 0,
    }
  );

  const conversion =
    totals.sentOffers > 0
      ? Math.round((totals.salesCount / totals.sentOffers) * 100)
      : 0;

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      <div className="card p-5">
        <p className="text-secondaryText">Обработано клиентов</p>
        <p className="text-3xl font-bold mt-2">{totals.processedLeads}</p>
      </div>

      <div className="card p-5">
        <p className="text-secondaryText">КП отправлено</p>
        <p className="text-3xl font-bold mt-2">{totals.sentOffers}</p>
      </div>

      <div className="card p-5">
        <p className="text-secondaryText">Продажи</p>
        <p className="text-3xl font-bold mt-2">{totals.salesCount}</p>
      </div>

      <div className="card p-5">
        <p className="text-secondaryText">Сумма продаж</p>
        <p className="text-3xl font-bold mt-2">{money(totals.salesAmount)} тг</p>
      </div>

      <div className="card p-5">
        <p className="text-secondaryText">Ответы клиентов</p>
        <p className="text-3xl font-bold mt-2">{totals.clientReplies}</p>
      </div>

      <div className="card p-5">
        <p className="text-secondaryText">Отказы</p>
        <p className="text-3xl font-bold mt-2">{totals.rejections}</p>
      </div>

      <div className="card p-5">
        <p className="text-secondaryText">Конверсия КП в продажу</p>
        <p className="text-3xl font-bold mt-2">{conversion}%</p>
      </div>

      <div className="card p-5">
        <p className="text-secondaryText">Всего отчётов</p>
        <p className="text-3xl font-bold mt-2">{reports.length}</p>
      </div>
    </div>
  );
}
