import type { Lead } from "@/types/lead";
import { dealStageLabels } from "@/components/DealLabels";
import type { DealStage } from "@/types/lead";

type FunnelStatsProps = { leads: Lead[] };

const stages: DealStage[] = ["new_request", "contacted", "price_requested", "offer_sent", "ordered", "completed", "lost"];

function money(value: number) {
  return new Intl.NumberFormat("ru-RU").format(value);
}

export default function FunnelStats({ leads }: FunnelStatsProps) {
  const totalPipeline = leads.reduce((sum, lead) => sum + lead.estimatedAmount, 0);
  const completedAmount = leads.filter((lead) => lead.dealStage === "completed").reduce((sum, lead) => sum + lead.estimatedAmount, 0);
  const activeLeads = leads.filter((lead) => !["completed", "lost"].includes(lead.dealStage)).length;

  return (
    <div className="grid lg:grid-cols-4 gap-5 mb-8">
      <div className="card p-5">
        <p className="text-secondaryText">Потенциал сделок</p>
        <p className="text-3xl font-bold mt-2">{money(totalPipeline)} тг</p>
      </div>
      <div className="card p-5">
        <p className="text-secondaryText">Завершено на сумму</p>
        <p className="text-3xl font-bold mt-2">{money(completedAmount)} тг</p>
      </div>
      <div className="card p-5">
        <p className="text-secondaryText">Активные сделки</p>
        <p className="text-3xl font-bold mt-2">{activeLeads}</p>
      </div>
      <div className="card p-5">
        <p className="text-secondaryText">Потеряно</p>
        <p className="text-3xl font-bold mt-2">{leads.filter((lead) => lead.dealStage === "lost").length}</p>
      </div>

      <div className="card p-5 lg:col-span-4">
        <h2 className="text-2xl font-bold mb-5">Воронка продаж</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-7 gap-4">
          {stages.map((stage) => {
            const count = leads.filter((lead) => lead.dealStage === stage).length;
            return (
              <div key={stage} className="bg-secondary border border-borderColor rounded-2xl p-4">
                <p className="text-secondaryText text-sm min-h-[40px]">{dealStageLabels[stage]}</p>
                <p className="text-3xl font-bold mt-2">{count}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
