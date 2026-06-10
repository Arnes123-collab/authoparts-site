export type LeadOfferStatus =
  | "draft"
  | "offered"
  | "accepted"
  | "rejected"
  | "purchased"
  | "sold";

export interface LeadOffer {
  id: string;
  leadId: string;
  requestedPart: string;
  offeredPart: string;
  supplier: string;
  costPrice: number;
  salePrice: number;
  margin: number;
  status: LeadOfferStatus;
  comment: string;
  createdAt: string;
  updatedAt?: string;
}

export interface LeadOfferDbRow {
  id: string;
  lead_id: string;
  requested_part: string;
  offered_part: string;
  supplier: string | null;
  cost_price: number | string | null;
  sale_price: number | string | null;
  margin: number | string | null;
  status: LeadOfferStatus;
  comment: string | null;
  created_at: string;
  updated_at: string | null;
}

export type LeadOfferFormData = {
  leadId: string;
  requestedPart: string;
  offeredPart: string;
  supplier: string;
  costPrice: number;
  salePrice: number;
  status: LeadOfferStatus;
  comment: string;
};

export function mapLeadOfferFromDb(row: LeadOfferDbRow): LeadOffer {
  const costPrice = Number(row.cost_price ?? 0);
  const salePrice = Number(row.sale_price ?? 0);

  return {
    id: row.id,
    leadId: row.lead_id,
    requestedPart: row.requested_part,
    offeredPart: row.offered_part,
    supplier: row.supplier ?? "",
    costPrice,
    salePrice,
    margin: Number(row.margin ?? salePrice - costPrice),
    status: row.status,
    comment: row.comment ?? "",
    createdAt: row.created_at,
    updatedAt: row.updated_at ?? undefined,
  };
}
