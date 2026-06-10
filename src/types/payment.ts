export type PaymentStatus = "paid" | "pending" | "overdue" | "paused" | "cancelled";

export type Payment = {
  id: string;
  client_id: string;
  tariff: string;
  amount: number;
  currency: string;
  payment_date: string | null;
  start_date: string | null;
  expiry_date: string | null;
  status: PaymentStatus;
  note: string | null;
  created_at: string;
};

export type PaymentListItem = Payment & {
  client_name: string | null;
  whatsapp: string | null;
  instagram: string | null;
  days_left: number | null;
  computed_status: PaymentStatus;
};

export type PaymentRequestPayload = {
  client_id: string;
  tariff: string;
  amount: number | string;
  currency: string | null;
  payment_date: string | null;
  start_date: string | null;
  expiry_date: string | null;
  status: PaymentStatus;
  note: string | null;
};
