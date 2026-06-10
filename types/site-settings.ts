export interface SiteSettings {
  id: string;
  name: string;
  slogan: string;
  logoText: string;
  logoSubtitle: string;
  phone1: string;
  phone2: string;
  whatsapp: string;
  email: string;
  address: string;
  workTime: string;
  instagram: string;
  facebook: string;
  telegram: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutText: string;
  footerText: string;
  requisites: string;
  commercialSignature: string;
  createdAt: string;
  updatedAt?: string;
}

export interface SiteSettingsDbRow {
  id: string;
  name: string | null;
  slogan: string | null;
  logo_text: string | null;
  logo_subtitle: string | null;
  phone1: string | null;
  phone2: string | null;
  whatsapp: string | null;
  email: string | null;
  address: string | null;
  work_time: string | null;
  instagram: string | null;
  facebook: string | null;
  telegram: string | null;
  hero_title: string | null;
  hero_subtitle: string | null;
  about_text: string | null;
  footer_text: string | null;
  requisites: string | null;
  commercial_signature: string | null;
  created_at: string;
  updated_at: string | null;
}

export type SiteSettingsFormData = Omit<SiteSettings, "id" | "createdAt" | "updatedAt">;

export function mapSiteSettingsFromDb(row: SiteSettingsDbRow): SiteSettings {
  return {
    id: row.id,
    name: row.name ?? "",
    slogan: row.slogan ?? "",
    logoText: row.logo_text ?? "",
    logoSubtitle: row.logo_subtitle ?? "",
    phone1: row.phone1 ?? "",
    phone2: row.phone2 ?? "",
    whatsapp: row.whatsapp ?? "",
    email: row.email ?? "",
    address: row.address ?? "",
    workTime: row.work_time ?? "",
    instagram: row.instagram ?? "",
    facebook: row.facebook ?? "",
    telegram: row.telegram ?? "",
    heroTitle: row.hero_title ?? "",
    heroSubtitle: row.hero_subtitle ?? "",
    aboutText: row.about_text ?? "",
    footerText: row.footer_text ?? "",
    requisites: row.requisites ?? "",
    commercialSignature: row.commercial_signature ?? "",
    createdAt: row.created_at,
    updatedAt: row.updated_at ?? undefined,
  };
}
