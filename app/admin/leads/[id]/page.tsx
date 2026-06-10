import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import LeadDetails from "@/components/LeadDetails";
import LeadNotes from "@/components/LeadNotes";
import LeadOffers from "@/components/LeadOffers";
import CommercialOfferPanel from "@/components/CommercialOfferPanel";
import { mapLeadOfferFromDb, type LeadOfferDbRow } from "@/types/lead-offer";
import { mapLeadFromDb, type LeadDbRow } from "@/types/lead";
import { getSiteSettings } from "@/lib/settings";

type LeadPageProps = { params: { id: string } };

export default async function LeadPage({ params }: LeadPageProps) {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("id", params.id)
    .single<LeadDbRow>();

  if (error || !data) notFound();

  const lead = mapLeadFromDb(data);

  const { data: offersData } = await supabase
    .from("lead_offers")
    .select("*")
    .eq("lead_id", params.id)
    .order("created_at", { ascending: false })
    .returns<LeadOfferDbRow[]>();

  const offers = offersData ? offersData.map(mapLeadOfferFromDb) : [];
  const settings = await getSiteSettings();

  return (
    <main>
      <div className="container-custom pt-8">
        <Link href="/admin" className="text-accent hover:underline">← Вернуться в CRM</Link>
      </div>
      <LeadDetails lead={lead} />
      <CommercialOfferPanel lead={lead} offers={offers} signature={settings.commercialSignature} />
      <LeadOffers leadId={lead.id} defaultRequestedPart={lead.partRequest} />
      <LeadNotes leadId={lead.id} />
    </main>
  );
}
