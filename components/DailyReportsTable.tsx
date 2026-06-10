import type { DailyReport } from "@/types/daily-report";

type DailyReportsTableProps = {
  reports: DailyReport[];
};

function money(value: number) {
  return new Intl.NumberFormat("ru-RU").format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "medium",
  }).format(new Date(value));
}

export default function DailyReportsTable({ reports }: DailyReportsTableProps) {
  return (
    <div className="card p-6">
      <h2 className="text-3xl font-bold mb-6">История отчётов</h2>

      {reports.length === 0 ? (
        <p className="text-secondaryText">
          Пока нет ни одного дневного отчёта.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] border-collapse">
            <thead>
              <tr className="border-b border-borderColor text-left text-secondaryText">
                <th className="py-4 pr-4">Дата</th>
                <th className="py-4 pr-4">Клиенты</th>
                <th className="py-4 pr-4">КП</th>
                <th className="py-4 pr-4">Ответы</th>
                <th className="py-4 pr-4">Отказы</th>
                <th className="py-4 pr-4">Продажи</th>
                <th className="py-4 pr-4">Сумма</th>
                <th className="py-4 pr-4">Комментарий</th>
              </tr>
            </thead>

            <tbody>
              {reports.map((report) => (
                <tr key={report.id} className="border-b border-borderColor/70 align-top">
                  <td className="py-4 pr-4 font-semibold">{formatDate(report.reportDate)}</td>
                  <td className="py-4 pr-4 text-secondaryText">{report.processedLeads}</td>
                  <td className="py-4 pr-4 text-secondaryText">{report.sentOffers}</td>
                  <td className="py-4 pr-4 text-secondaryText">{report.clientReplies}</td>
                  <td className="py-4 pr-4 text-secondaryText">{report.rejections}</td>
                  <td className="py-4 pr-4 text-secondaryText">{report.salesCount}</td>
                  <td className="py-4 pr-4 text-secondaryText">{money(report.salesAmount)} тг</td>
                  <td className="py-4 pr-4 text-secondaryText max-w-sm whitespace-pre-wrap">
                    {report.comment || "Без комментария"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
