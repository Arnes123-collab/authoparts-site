import type { Client } from "@/types/client";

export type BodyMeasurement = {
  id: string;
  client_id: string;
  measurement_date: string;
  body_weight: number | null;
  chest: number | null;
  waist: number | null;
  hips: number | null;
  thigh: number | null;
  arm: number | null;
  shoulder: number | null;
  comment: string | null;
  created_at: string;
};

export type BodyMeasurementRequestPayload = {
  client_id: string;
  measurement_date: string | null;
  body_weight: number | string | null;
  chest: number | string | null;
  waist: number | string | null;
  hips: number | string | null;
  thigh: number | string | null;
  arm: number | string | null;
  shoulder: number | string | null;
  comment: string | null;
};

export type BodyMeasurementJoined = BodyMeasurement & {
  clients?: Pick<Client, "name" | "whatsapp" | "instagram"> | null;
};

export type BodyMeasurementListItem = BodyMeasurement & {
  client_name: string | null;
  whatsapp: string | null;
  instagram: string | null;
};
