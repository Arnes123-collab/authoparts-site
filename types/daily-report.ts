export interface DailyReport {
  id: string;
  reportDate: string;
  processedLeads: number;
  sentOffers: number;
  clientReplies: number;
  rejections: number;
  salesCount: number;
  salesAmount: number;
  comment: string;
  createdAt: string;
  updatedAt?: string;
}

export interface DailyReportDbRow {
  id: string;
  report_date: string;
  processed_leads: number | string | null;
  sent_offers: number | string | null;
  client_replies: number | string | null;
  rejections: number | string | null;
  sales_count: number | string | null;
  sales_amount: number | string | null;
  comment: string | null;
  created_at: string;
  updated_at: string | null;
}

export type DailyReportFormData = {
  reportDate: string;
  processedLeads: number;
  sentOffers: number;
  clientReplies: number;
  rejections: number;
  salesCount: number;
  salesAmount: number;
  comment: string;
};

export function mapDailyReportFromDb(row: DailyReportDbRow): DailyReport {
  return {
    id: row.id,
    reportDate: row.report_date,
    processedLeads: Number(row.processed_leads ?? 0),
    sentOffers: Number(row.sent_offers ?? 0),
    clientReplies: Number(row.client_replies ?? 0),
    rejections: Number(row.rejections ?? 0),
    salesCount: Number(row.sales_count ?? 0),
    salesAmount: Number(row.sales_amount ?? 0),
    comment: row.comment ?? "",
    createdAt: row.created_at,
    updatedAt: row.updated_at ?? undefined,
  };
}
