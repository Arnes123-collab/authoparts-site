type SupabaseRequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  query?: string;
  prefer?: string;
};

export type SupabaseResult<T> = {
  data: T | null;
  error: string | null;
  isConfigured: boolean;
};

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return null;
  }

  return {
    url: url.replace(/\/$/, ""),
    key,
  };
}

export async function supabaseRest<T>(
  table: string,
  options: SupabaseRequestOptions = {},
): Promise<SupabaseResult<T>> {
  const config = getSupabaseConfig();

  if (!config) {
    return {
      data: null,
      error: "Supabase не настроен. Проверьте .env.local",
      isConfigured: false,
    };
  }

  const method = options.method || "GET";
  const query = options.query ? `?${options.query}` : "";
  const response = await fetch(`${config.url}/rest/v1/${table}${query}`, {
    method,
    headers: {
      apikey: config.key,
      Authorization: `Bearer ${config.key}`,
      "Content-Type": "application/json",
      Prefer: options.prefer || (method === "POST" ? "return=representation" : ""),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  });

  const text = await response.text();
  const parsed = text ? JSON.parse(text) : null;

  if (!response.ok) {
    return {
      data: null,
      error: typeof parsed?.message === "string" ? parsed.message : "Ошибка Supabase REST API",
      isConfigured: true,
    };
  }

  return {
    data: parsed as T,
    error: null,
    isConfigured: true,
  };
}
