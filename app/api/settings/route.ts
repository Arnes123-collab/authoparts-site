import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { SETTINGS_SINGLETON_ID, getSiteSettings } from "@/lib/settings";
import type { SiteSettingsFormData } from "@/types/site-settings";

export async function GET() {
  const settings = await getSiteSettings();
  return NextResponse.json(settings);
}

export async function PATCH(request: NextRequest) {
  const body = (await request.json()) as Partial<SiteSettingsFormData>;

  const payload = {
    name: body.name?.trim() ?? "",
    slogan: body.slogan?.trim() ?? "",
    logo_text: body.logoText?.trim() ?? "",
    logo_subtitle: body.logoSubtitle?.trim() ?? "",
    phone1: body.phone1?.trim() ?? "",
    phone2: body.phone2?.trim() ?? "",
    whatsapp: body.whatsapp?.trim() ?? "",
    email: body.email?.trim() ?? "",
    address: body.address?.trim() ?? "",
    work_time: body.workTime?.trim() ?? "",
    instagram: body.instagram?.trim() ?? "",
    facebook: body.facebook?.trim() ?? "",
    telegram: body.telegram?.trim() ?? "",
    hero_title: body.heroTitle?.trim() ?? "",
    hero_subtitle: body.heroSubtitle?.trim() ?? "",
    about_text: body.aboutText?.trim() ?? "",
    footer_text: body.footerText?.trim() ?? "",
    requisites: body.requisites?.trim() ?? "",
    commercial_signature: body.commercialSignature?.trim() ?? "",
    updated_at: new Date().toISOString(),
  };

  if (!payload.name || !payload.phone1 || !payload.whatsapp) {
    return NextResponse.json(
      { message: "Название, телефон 1 и WhatsApp обязательны." },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("site_settings")
    .upsert({
      id: SETTINGS_SINGLETON_ID,
      ...payload,
    });

  if (error) {
    return NextResponse.json(
      { message: "Не удалось сохранить настройки." },
      { status: 500 }
    );
  }

  const settings = await getSiteSettings();
  return NextResponse.json(settings);
}
