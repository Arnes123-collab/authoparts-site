export type CoachSettings = {
  id: string;
  coach_name: string;
  brand_name: string;
  specialization: string | null;
  logo_url: string | null;
  coach_photo_url: string | null;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  gold_color: string;
  instagram: string | null;
  whatsapp: string | null;
  email: string | null;
  city: string | null;
  offer_title: string | null;
  offer_description: string | null;
  created_at: string;
  updated_at: string;
};

export type CoachSettingsPayload = Omit<CoachSettings, "id" | "created_at" | "updated_at">;
