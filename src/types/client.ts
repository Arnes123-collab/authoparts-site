export type ClientStatus = "new" | "active" | "paused" | "finished";

export type Client = {
  id: string;
  name: string;
  age: number | null;
  weight: number | null;
  height: number | null;
  goal: string;
  experience: string | null;
  injuries: string | null;
  training_place: string | null;
  training_days: string | null;
  whatsapp: string | null;
  instagram: string | null;
  status: ClientStatus;
  created_at: string;
};

export type ClientRequestPayload = {
  name: string;
  age: number | string | null;
  weight: number | string | null;
  height: number | string | null;
  goal: string;
  experience: string | null;
  injuries: string | null;
  training_place: string | null;
  training_days: string | null;
  whatsapp: string | null;
  instagram: string | null;
};
