import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { supabase } from "@/lib/supabase";
import LeadTable from "@/components/LeadTable";
import FunnelStats from "@/components/FunnelStats";
import TodayFollowUps from "@/components/TodayFollowUps";
import { mapLeadFromDb, type LeadDbRow } from "@/types/lead";

export default async function AdminPage() {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<LeadDbRow[]>();

  const leads = data ? data.map(mapLeadFromDb) : [];

  return (
    <main>
      <div className="container-custom py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <p className="text-accent font-semibold mb-2">CRM автозапчастей</p>
            <h1 className="text-4xl font-bold">Деньги и действия продавца</h1>
            <p className="text-secondaryText mt-2">Воронка продаж, контакты на сегодня и контроль сделок.</p>
          </div>
          <div className="flex flex-wrap gap-3">\n            <Link href="/" className="btn-secondary">На сайт</Link>\n            <Link href="/admin/reports" className="btn-secondary">Отчёты</Link>\n            <Link href="/admin/settings" className="btn-secondary">Настройки</Link>\n            <Link href="/admin/products" className="btn-secondary">Каталог</Link>\n            <LogoutButton />\n          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl bg-danger p-4 text-white">
            Не удалось загрузить клиентов. Проверьте Supabase и .env.local.
          </div>
        )}

        <FunnelStats leads={leads} />
        <TodayFollowUps leads={leads} />
        <LeadTable leads={leads} />
      </div>
    </main>
  );
}
