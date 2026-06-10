import { supabase } from "@/lib/supabase";
import { DEFAULT_COMPANY_SETTINGS } from "@/config/company";
import {
  mapSiteSettingsFromDb,
  type SiteSettings,
  type SiteSettingsDbRow,
} from "@/types/site-settings";

export const SETTINGS_SINGLETON_ID = "00000000-0000-0000-0000-000000000001";

export function defaultSettings(): SiteSettings {
  return {
    id: SETTINGS_SINGLETON_ID,
    ...DEFAULT_COMPANY_SETTINGS,
    createdAt: new Date().toISOString(),
    updatedAt: undefined,
  };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", SETTINGS_SINGLETON_ID)
    .maybeSingle<SiteSettingsDbRow>();

  if (error || !data) {
    return defaultSettings();
  }

  return mapSiteSettingsFromDb(data);
}
