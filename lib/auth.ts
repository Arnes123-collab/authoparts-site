const encoder = new TextEncoder();

export const ADMIN_COOKIE_NAME = "admin_session";

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET || "dev-secret-change-me";
}

export async function createAdminSessionToken() {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode("admin-access")
  );

  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function isValidAdminSession(token?: string) {
  if (!token) {
    return false;
  }

  const expectedToken = await createAdminSessionToken();
  return token === expectedToken;
}
