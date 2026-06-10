import Link from "next/link";
import type { Lead } from "@/types/lead";
import PriorityBadge from "@/components/PriorityBadge";

type TodayFollowUpsProps = { leads: Lead[] };

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function isActive(lead: Lead) {
  return !["completed", "lost"].includes(lead.dealStage);
}

export default function TodayFollowUps({ leads }: TodayFollowUpsProps) {
  const today = todayIso();

  const todayLeads = leads
    .filter((lead) => lead.nextContactDate === today && isActive(lead))
    .slice(0, 8);

  const overdueLeads = leads
    .filter((lead) => lead.nextContactDate && lead.nextContactDate < today && isActive(lead))
    .slice(0, 8);

  return (
    <div className="grid lg:grid-cols-2 gap-5 mb-8">
      <div className="card p-5">
        <h2 className="text-2xl font-bold mb-4">Кому написать сегодня</h2>
        {todayLeads.length === 0 ? (
          <p className="text-secondaryText">На сегодня контактов нет.</p>
        ) : (
          <div className="space-y-3">
            {todayLeads.map((lead) => (
              <Link key={lead.id} href={`/admin/leads/${lead.id}`} className="block bg-secondary border border-borderColor rounded-2xl p-4 hover:border-accent">
                <div className="flex justify-between gap-3">
                  <div>
                    <p className="font-bold">{lead.name}</p>
                    <p className="text-secondaryText text-sm">{lead.phone}</p>
                  </div>
                  <PriorityBadge priority={lead.priority} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="card p-5">
        <h2 className="text-2xl font-bold mb-4">Просроченные контакты</h2>
        {overdueLeads.length === 0 ? (
          <p className="text-secondaryText">Просрочек нет.</p>
        ) : (
          <div className="space-y-3">
            {overdueLeads.map((lead) => (
              <Link key={lead.id} href={`/admin/leads/${lead.id}`} className="block bg-secondary border border-danger/50 rounded-2xl p-4 hover:border-danger">
                <div className="flex justify-between gap-3">
                  <div>
                    <p className="font-bold">{lead.name}</p>
                    <p className="text-secondaryText text-sm">Нужно было связаться: {lead.nextContactDate}</p>
                  </div>
                  <PriorityBadge priority={lead.priority} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
