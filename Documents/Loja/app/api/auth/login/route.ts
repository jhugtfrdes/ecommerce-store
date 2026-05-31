import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ProfileAuth = {
  email: string;
  full_name: string | null;
  role: "user" | "admin";
};

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase não está configurado. Define NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY." }, { status: 503 });
  }

  const body = (await request.json()) as { email?: string; password?: string };
  const email = body.email?.trim().toLowerCase() ?? "";
  const password = body.password ?? "";

  authDebug(requestId, "login:start", {
    nodeEnv: process.env.NODE_ENV,
    email,
    hasPassword: Boolean(password),
    passwordLength: password.length
  });

  if (!email || !password) {
    return NextResponse.json({ error: "Email e password são obrigatórios." }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  authDebug(requestId, "login:signInWithPassword:result", {
    email,
    userId: data.user?.id,
    signedInEmail: data.user?.email,
    session: Boolean(data.session),
    sessionExpiresAt: data.session?.expires_at,
    emailConfirmedAt: data.user?.email_confirmed_at,
    confirmedAt: data.user?.confirmed_at,
    errorStatus: error?.status,
    errorMessage: error?.message
  });

  if (error || !data.user) {
    const friendly = getFriendlyAuthError(error ?? { message: "Missing user", status: 401 });
    return NextResponse.json({ error: friendly.message }, { status: friendly.status });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("email, full_name, role")
    .eq("id", data.user.id)
    .maybeSingle<ProfileAuth>();

  return NextResponse.json({
    user: {
      email: profile?.email ?? data.user.email,
      name: profile?.full_name ?? data.user.user_metadata?.name ?? null,
      role: profile?.role ?? "user"
    },
    authenticated: true,
    ...devDebug({
      nodeEnv: process.env.NODE_ENV,
      emailConfirmedAt: data.user.email_confirmed_at,
      confirmedAt: data.user.confirmed_at,
      session: Boolean(data.session)
    })
  });
}

function getFriendlyAuthError(error: { message?: string; status?: number }) {
  const message = error.message?.toLowerCase() ?? "";

  if (message.includes("email not confirmed") || message.includes("not confirmed")) {
    return {
      status: 401,
      message: "O email desta conta ainda não está confirmado no Supabase."
    };
  }

  return {
    status: error.status && error.status >= 400 ? error.status : 401,
    message: "Email ou password incorretos."
  };
}

function authDebug(requestId: string, step: string, data: Record<string, unknown>) {
  if (process.env.NODE_ENV === "production") {
    return;
  }

  console.log(`[auth:${requestId}] ${step}`, data);
}

function devDebug(data: Record<string, unknown>) {
  if (process.env.NODE_ENV === "production") {
    return {};
  }

  return { _debug: data };
}
