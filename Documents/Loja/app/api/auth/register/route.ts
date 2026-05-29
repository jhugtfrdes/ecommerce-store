import { NextResponse } from "next/server";
import { createStoredUser } from "@/lib/users";
import { adminCookieName, createAdminSessionToken } from "@/lib/admin-session";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; name?: string; password?: string };

  if (!body.email || !body.password || body.password.length < 8) {
    return NextResponse.json({ error: "Email e password com pelo menos 8 caracteres são obrigatórios." }, { status: 400 });
  }

  const user = await createStoredUser({
    email: body.email,
    name: body.name || "",
    password: body.password
  });

  if (!user) {
    return NextResponse.json({ error: "Já existe uma conta com esse email." }, { status: 409 });
  }

  const response = NextResponse.json({
    user: {
      email: user.email,
      name: user.name,
      role: user.role
    }
  }, { status: 201 });

  response.cookies.set(adminCookieName, await createAdminSessionToken({
    sub: user.id,
    email: user.email,
    role: user.role
  }), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8
  });

  return response;
}
