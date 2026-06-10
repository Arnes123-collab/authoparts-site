import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { mapLeadFromDb, type LeadDbRow } from "@/types/lead";
import {
  mapLeadOfferFromDb,
  type LeadOfferDbRow,
} from "@/types/lead-offer";
import { offerStatusLabels } from "@/components/OfferLabels";
import PrintButton from "@/components/PrintButton";
import { getSiteSettings } from "@/lib/settings";

type PrintPageProps = {
  params: {
    id: string;
  };
};

function money(value: number) {
  return new Intl.NumberFormat("ru-RU").format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "medium",
  }).format(new Date(value));
}

export default async function PrintCommercialOfferPage({
  params,
}: PrintPageProps) {
  const { data: leadData, error: leadError } = await supabase
    .from("leads")
    .select("*")
    .eq("id", params.id)
    .single<LeadDbRow>();

  if (leadError || !leadData) {
    notFound();
  }

  const { data: offersData } = await supabase
    .from("lead_offers")
    .select("*")
    .eq("lead_id", params.id)
    .neq("status", "rejected")
    .order("created_at", { ascending: false })
    .returns<LeadOfferDbRow[]>();

  const lead = mapLeadFromDb(leadData);
  const settings = await getSiteSettings();
  const offers = offersData ? offersData.map(mapLeadOfferFromDb) : [];
  const total = offers.reduce((sum, item) => sum + item.salePrice, 0);

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="max-w-4xl mx-auto px-8 py-10">
        <div className="print:hidden mb-6 flex gap-3">
          <Link href={`/admin/leads/${lead.id}`} className="btn-secondary">
            ← Назад в карточку
          </Link>

          <PrintButton />
        </div>

        <div className="border-b border-gray-300 pb-6 mb-8">
          <p className="text-sm uppercase tracking-widest text-gray-500">
            Коммерческое предложение
          </p>

          <h1 className="text-4xl font-bold mt-2">
            {settings.logoText}
          </h1>

          <p className="text-gray-600 mt-2">
            {settings.footerText}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <p className="text-gray-500 text-sm">Клиент</p>
            <p className="font-bold text-xl">{lead.name}</p>
            <p>{lead.phone}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Дата</p>
            <p className="font-bold">{formatDate(new Date().toISOString())}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Автомобиль</p>
            <p className="font-bold">
              {[lead.carBrand, lead.carModel, lead.year].filter(Boolean).join(" ") || "Не указан"}
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">VIN</p>
            <p className="font-bold">{lead.vin || "Не указан"}</p>
          </div>
        </div>

        <div className="mb-8">
          <p className="text-gray-500 text-sm">Запрос клиента</p>
          <p className="text-xl font-bold">{lead.partRequest || "Не указан"}</p>
        </div>

        <table className="w-full border-collapse mb-8">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-3 text-left">№</th>
              <th className="border border-gray-300 p-3 text-left">Предложение</th>
              <th className="border border-gray-300 p-3 text-left">Цена</th>
              <th className="border border-gray-300 p-3 text-left">Статус</th>
              <th className="border border-gray-300 p-3 text-left">Комментарий</th>
            </tr>
          </thead>

          <tbody>
            {offers.length === 0 ? (
              <tr>
                <td colSpan={5} className="border border-gray-300 p-3">
                  Варианты пока не добавлены.
                </td>
              </tr>
            ) : (
              offers.map((offer, index) => (
                <tr key={offer.id}>
                  <td className="border border-gray-300 p-3">{index + 1}</td>
                  <td className="border border-gray-300 p-3">{offer.offeredPart}</td>
                  <td className="border border-gray-300 p-3">{money(offer.salePrice)} тг</td>
                  <td className="border border-gray-300 p-3">{offerStatusLabels[offer.status]}</td>
                  <td className="border border-gray-300 p-3">{offer.comment || ""}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="flex justify-end mb-10">
          <div className="w-full max-w-sm border border-gray-300 p-5">
            <p className="text-gray-500">Итого по предложениям</p>
            <p className="text-3xl font-bold">{money(total)} тг</p>
          </div>
        </div>

        <div className="border-t border-gray-300 pt-6 text-gray-700">
          <p>
            Если один из вариантов подходит, напишите нам - мы оформим заказ и уточним срок поставки.
          </p>

          <p className="mt-4 font-bold">
            {settings.commercialSignature}
          </p>
        </div>
      </div>
    </main>
  );
}
