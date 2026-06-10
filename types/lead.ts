export type LeadStatus =
  | "new"
  | "in_progress"
  | "ordered"
  | "completed"
  | "cancelled";

export type DealStage =
  | "new_request"
  | "contacted"
  | "price_requested"
  | "offer_sent"
  | "ordered"
  | "completed"
  | "lost";

export type LeadPriority = "low" | "medium" | "high";

export interface Lead {
  id: string;
  name: string;
  phone: string;
  carBrand: string;
  carModel: string;
  year: string;
  vin: string;
  partRequest: string;
  comment: string;
  status: LeadStatus;
  dealStage: DealStage;
  estimatedAmount: number;
  nextContactDate: string;
  priority: LeadPriority;
  createdAt: string;
  updatedAt?: string;
}

export type LeadFormData = Omit<
  Lead,
  "id" | "status" | "dealStage" | "estimatedAmount" | "nextContactDate" | "priority" | "createdAt" | "updatedAt"
>;

export interface LeadDbRow {
  id: string;
  name: string;
  phone: string;
  car_brand: string | null;
  car_model: string | null;
  year: string | null;
  vin: string | null;
  part_request: string | null;
  comment: string | null;
  status: LeadStatus;
  deal_stage: DealStage | null;
  estimated_amount: number | string | null;
  next_contact_date: string | null;
  priority: LeadPriority | null;
  created_at: string;
  updated_at: string | null;
}

export function mapLeadFromDb(row: LeadDbRow): Lead {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    carBrand: row.car_brand ?? "",
    carModel: row.car_model ?? "",
    year: row.year ?? "",
    vin: row.vin ?? "",
    partRequest: row.part_request ?? "",
    comment: row.comment ?? "",
    status: row.status,
    dealStage: row.deal_stage ?? "new_request",
    estimatedAmount: Number(row.estimated_amount ?? 0),
    nextContactDate: row.next_contact_date ?? "",
    priority: row.priority ?? "medium",
    createdAt: row.created_at,
    updatedAt: row.updated_at ?? undefined,
  };
}
