import { NextResponse } from "next/server";
import { findIdentityByEmail } from "@/lib/auth";
import { verifyPassword } from "@/lib/password";
import { adminCookieName, createAdminSessionToken } from "@/lib/admin-session";
import { getSetupMessage } from "@/lib/env";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; password?: string };

  if (!body.email || !body.password) {
    return NextResponse.json({ error: "Email e password são obrigatórios." }, { status: 400 });
  }

  const identity = await findIdentityByEmail(body.email);

  if (!identity || !verifyPassword(body.password, identity.passwordHash)) {
    const setup = getSetupMessage();
    return NextResponse.json({
      error: setup.configured
        ? "Credenciais inválidas."
        : "Credenciais inválidas. Para criar o admin inicial, executa npm run setup e reinicia o servidor.",
      setup
    }, { status: 401 });
  }

  const response = NextResponse.json({
    user: {
      email: identity.email,
      name: identity.name,
      role: identity.role
    }
  });

  response.cookies.set(adminCookieName, await createAdminSessionToken({
    sub: identity.id,
    email: identity.email,
    role: identity.role
  }), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8
  });

  return response;
}
