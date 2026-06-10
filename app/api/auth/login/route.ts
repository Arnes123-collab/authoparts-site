import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  createAdminSessionToken,
} from "@/lib/auth";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    password?: string;
  };

  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return NextResponse.json(
      { message: "ADMIN_PASSWORD не настроен в .env.local." },
      { status: 500 }
    );
  }

  if (!body.password || body.password !== adminPassword) {
    return NextResponse.json(
      { message: "Неверный пароль." },
      { status: 401 }
    );
  }

  const token = await createAdminSessionToken();

  const response = NextResponse.json({
    message: "Вход выполнен.",
  });

  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  return response;
}
