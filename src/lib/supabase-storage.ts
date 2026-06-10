import { Buffer } from "node:buffer";

export type SupabaseStorageUploadResult = {
  publicUrl: string | null;
  error: string | null;
  isConfigured: boolean;
};

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;

  return {
    url: url.replace(/\/$/, ""),
    key,
  };
}

function sanitizeFileName(fileName: string) {
  const cleanName = fileName
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]/g, "-")
    .replace(/-+/g, "-")
    .slice(-90);

  return cleanName || "exercise-image";
}

export async function uploadExerciseImage(params: {
  bucket: string;
  fileName: string;
  contentType: string;
  base64: string;
}): Promise<SupabaseStorageUploadResult> {
  const config = getSupabaseConfig();

  if (!config) {
    return {
      publicUrl: null,
      error: "Supabase Storage не настроен. Проверьте .env.local",
      isConfigured: false,
    };
  }

  const safeFileName = sanitizeFileName(params.fileName);
  const filePath = `${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}-${safeFileName}`;
  const binary = Buffer.from(params.base64, "base64");

  const response = await fetch(`${config.url}/storage/v1/object/${params.bucket}/${filePath}`, {
    method: "POST",
    headers: {
      apikey: config.key,
      Authorization: `Bearer ${config.key}`,
      "Content-Type": params.contentType,
      "x-upsert": "false",
    },
    body: binary,
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    let message = "Ошибка загрузки фото в Supabase Storage";

    try {
      const parsed = JSON.parse(text) as { message?: string; error?: string };
      message = parsed.message || parsed.error || message;
    } catch {
      if (text) message = text;
    }

    return {
      publicUrl: null,
      error: message,
      isConfigured: true,
    };
  }

  return {
    publicUrl: `${config.url}/storage/v1/object/public/${params.bucket}/${filePath}`,
    error: null,
    isConfigured: true,
  };
}
