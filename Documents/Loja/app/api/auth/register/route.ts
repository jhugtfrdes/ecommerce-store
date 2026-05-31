import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ProfileAuth = {
  email: string;
  full_name: string | null;
  role: "user" | "admin";
};

type RegisterBody = {
  email?: string;
  name?: string;
  password?: string;
};

type RegisterInput = {
  email: string;
  name: string;
  password: string;
};

const isDevelopment = process.env.NODE_ENV !== "production";

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase não está configurado. Define NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY." },
      { status: 503 }
    );
  }

  const body = (await request.json()) as RegisterBody;
  const email = normalizeEmail(body.email);
  const name = body.name?.trim() ?? "";
  const password = body.password ?? "";

  authDebug(requestId, "register:start", {
    email,
    mode: isDevelopment ? "development-admin-createUser" : "production-signUp",
    hasPassword: Boolean(password),
    passwordLength: password.length
  });

  if (!email || !password || password.length < 8) {
    return NextResponse.json({ error: "Indica um email válido e uma password com pelo menos 8 caracteres." }, { status: 400 });
  }

  if (isDevelopment) {
    const response = await registerConfirmedDevelopmentUser({ email, name, password }, requestId);

    if (response) {
      return response;
    }
  }

  return registerWithSupabaseSignup({ email, name, password }, requestId);
}

async function registerConfirmedDevelopmentUser({ email, name, password }: RegisterInput, requestId: string) {
  const admin = createSupabaseAdminClient();

  if (!admin) {
    authDebug(requestId, "register:admin-client-missing", { email });
    return null;
  }

  const created = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name }
  });

  authDebug(requestId, "register:createUser:result", {
    email,
    userId: created.data.user?.id,
    createdEmail: created.data.user?.email,
    emailConfirmedAt: created.data.user?.email_confirmed_at,
    confirmedAt: created.data.user?.confirmed_at,
    errorStatus: created.error?.status,
    errorMessage: created.error?.message
  });

  if (created.error) {
    const friendly = getFriendlyAuthError(created.error);
    return NextResponse.json({ error: friendly.message }, { status: friendly.status });
  }

  if (!created.data.user) {
    return NextResponse.json({ error: "Não foi possível criar a conta. Tenta novamente." }, { status: 500 });
  }

  const profile = await ensureProfile(created.data.user.id, email, name, requestId);

  if (!profile) {
    return NextResponse.json({ error: "A conta foi criada, mas não foi possível preparar o perfil." }, { status: 500 });
  }

  return signInAndRespond({ email, password, profile, status: 201, requestId });
}

async function registerWithSupabaseSignup({ email, name, password }: RegisterInput, requestId: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name }
    }
  });

  authDebug(requestId, "register:signUp:result", {
    email,
    userId: data.user?.id,
    createdEmail: data.user?.email,
    hasSession: Boolean(data.session),
    emailConfirmedAt: data.user?.email_confirmed_at,
    confirmedAt: data.user?.confirmed_at,
    errorStatus: error?.status,
    errorMessage: error?.message
  });

  if (error) {
    const friendly = getFriendlyAuthError(error);
    return NextResponse.json({ error: friendly.message }, { status: friendly.status });
  }

  const profile = data.user ? await getProfile(data.user.id) : null;

  return NextResponse.json(
    {
      user: data.user
        ? {
            email: profile?.email ?? data.user.email,
            name: profile?.full_name ?? data.user.user_metadata?.name ?? null,
            role: profile?.role ?? "user"
          }
        : null,
      needsEmailConfirmation: !data.session
    },
    { status: 201 }
  );
}

async function signInAndRespond({
  email,
  password,
  profile,
  status,
  requestId
}: {
  email: string;
  password: string;
  profile: ProfileAuth;
  status: number;
  requestId: string;
}) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  authDebug(requestId, "register:autoSignIn:result", {
    email,
    userId: data.user?.id,
    signedInEmail: data.user?.email,
    hasSession: Boolean(data.session),
    errorStatus: error?.status,
    errorMessage: error?.message
  });

  if (error || !data.user || !data.session) {
    const friendly = getFriendlyAuthError(error ?? { message: "Missing session", status: 401 });
    return NextResponse.json(
      { error: `Conta criada, mas não foi possível iniciar sessão automaticamente. ${friendly.message}` },
      { status: friendly.status }
    );
  }

  return NextResponse.json(
    {
      user: {
        email: profile.email,
        name: profile.full_name ?? data.user.user_metadata?.name ?? null,
        role: profile.role
      },
      needsEmailConfirmation: false
    },
    { status }
  );
}

async function ensureProfile(userId: string, email: string, name: string, requestId: string) {
  const admin = createSupabaseAdminClient();

  if (!admin) {
    authDebug(requestId, "register:profile:admin-client-missing", { email, userId });
    return null;
  }

  const { data, error } = await admin
    .from("profiles")
    .upsert(
      {
        id: userId,
        email,
        full_name: name,
        role: "user"
      },
      { onConflict: "id" }
    )
    .select("email, full_name, role")
    .single<ProfileAuth>();

  authDebug(requestId, "register:profile:result", {
    email,
    userId,
    profileEmail: data?.email,
    profileRole: data?.role,
    errorMessage: error?.message
  });

  if (error) {
    console.error("Supabase profile upsert failed:", error.message);
    return null;
  }

  return data;
}

async function getProfile(userId: string) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("profiles")
    .select("email, full_name, role")
    .eq("id", userId)
    .maybeSingle<ProfileAuth>();

  return data;
}

function getFriendlyAuthError(error: { message?: string; status?: number }) {
  const message = error.message?.toLowerCase() ?? "";

  if (error.status === 429 || message.includes("rate limit")) {
    return {
      status: 429,
      message: "O Supabase bloqueou temporariamente novos emails. Em desenvolvimento, desativa a confirmação por email ou espera alguns minutos."
    };
  }

  if (message.includes("email not confirmed") || message.includes("not confirmed")) {
    return {
      status: 401,
      message: "O email desta conta ainda não está confirmado no Supabase."
    };
  }

  if (message.includes("invalid login") || message.includes("invalid credentials")) {
    return {
      status: 401,
      message: "Email ou password incorretos."
    };
  }

  if (message.includes("already") || message.includes("registered") || message.includes("exists")) {
    return {
      status: 409,
      message: "Já existe uma conta com este email. Entra com a tua password."
    };
  }

  if (message.includes("invalid")) {
    return {
      status: 400,
      message: "Confirma se o email e a password estão corretos."
    };
  }

  return {
    status: error.status && error.status >= 400 ? error.status : 400,
    message: "Não foi possível autenticar agora. Tenta novamente."
  };
}

function normalizeEmail(email: string | undefined) {
  return email?.trim().toLowerCase() ?? "";
}

function authDebug(requestId: string, step: string, data: Record<string, unknown>) {
  if (!isDevelopment) {
    return;
  }

  console.log(`[auth:${requestId}] ${step}`, data);
}
