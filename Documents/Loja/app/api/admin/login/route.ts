import { NextResponse } from "next/server";
import { findAdminByEmail, verifyPassword } from "@/lib/admin-auth";
import { adminCookieName, createAdminSessionToken, getSessionSecret } from "@/lib/admin-session";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; password?: string };

  if (!getSessionSecret()) {
    return NextResponse.json({ error: "ADMIN_SESSION_SECRET não está configurado." }, { status: 500 });
  }

  if (!body.email || !body.password) {
    return NextResponse.json({ error: "Email e password são obrigatórios." }, { status: 400 });
  }

  const admin = findAdminByEmail(body.email);

  if (!admin || !verifyPassword(body.password, admin.passwordHash)) {
    return NextResponse.json({ error: "Credenciais inválidas." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(adminCookieName, await createAdminSessionToken({
    sub: admin.id,
    email: admin.email,
    role: admin.role || "admin"
  }), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8
  });

  return response;
}
