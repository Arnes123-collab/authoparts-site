import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  isValidAdminSession,
} from "@/lib/auth";

function isPublicLeadSubmit(request: NextRequest) {
  return request.nextUrl.pathname === "/api/leads" && request.method === "POST";
}

function isProtectedApi(pathname: string) {
  return pathname.startsWith("/api/leads") || pathname.startsWith("/api/lead-notes") || pathname.startsWith("/api/lead-offers") || pathname.startsWith("/api/daily-reports") || pathname.startsWith("/api/settings") || pathname.startsWith("/api/export") || pathname.startsWith("/api/products");
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicLeadSubmit(request)) {
    return NextResponse.next();
  }

  const shouldProtect =
    pathname.startsWith("/admin") || isProtectedApi(pathname);

  if (!shouldProtect) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const isAuthorized = await isValidAdminSession(token);

  if (isAuthorized) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api")) {
    return NextResponse.json(
      { message: "Нет доступа. Требуется вход в админку." },
      { status: 401 }
    );
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.searchParams.set("next", pathname);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/leads/:path*",
    "/api/leads",
    "/api/lead-notes/:path*",
    "/api/lead-notes",
    "/api/lead-offers/:path*",
    "/api/lead-offers",
    "/api/daily-reports/:path*",
    "/api/daily-reports",
    "/api/settings/:path*",
    "/api/settings",
    "/api/export/:path*",
    "/api/products/:path*",
    "/api/products",
  ],
};
