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
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase não está configurado. Define NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY." },
      { status: 503 }
    );
  }

  const body = (await request.json()) as RegisterBody;
  const email = body.email?.trim().toLowerCase();
  const name = body.name?.trim() ?? "";
  const password = body.password ?? "";

  if (!email || !password || password.length < 8) {
    return NextResponse.json({ error: "Indica um email válido e uma password com pelo menos 8 caracteres." }, { status: 400 });
  }

  if (isDevelopment) {
    const response = await registerConfirmedDevelopmentUser({ email, name, password });

    if (response) {
      return response;
    }
  }

  return registerWithSupabaseSignup({ email, name, password });
}

async function registerConfirmedDevelopmentUser({ email, name, password }: RegisterInput) {
  const admin = createSupabaseAdminClient();

  if (!admin) {
    return null;
  }

  const created = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name }
  });

  if (created.error) {
    const friendly = getFriendlyAuthError(created.error);
    return NextResponse.json({ error: friendly.message }, { status: friendly.status });
  }

  if (!created.data.user) {
    return NextResponse.json({ error: "Não foi possível criar a conta. Tenta novamente." }, { status: 500 });
  }

  const profile = await ensureProfile(created.data.user.id, email, name);

  if (!profile) {
    return NextResponse.json({ error: "A conta foi criada, mas não foi possível preparar o perfil." }, { status: 500 });
  }

  return signInAndRespond({ email, password, profile, status: 201 });
}

async function registerWithSupabaseSignup({ email, name, password }: RegisterInput) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name }
    }
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
  status
}: {
  email: string;
  password: string;
  profile: ProfileAuth;
  status: number;
}) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    return NextResponse.json({ error: "Conta criada, mas não foi possível iniciar sessão automaticamente." }, { status: 201 });
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

async function ensureProfile(userId: string, email: string, name: string) {
  const admin = createSupabaseAdminClient();

  if (!admin) {
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
    message: "Não foi possível criar a conta agora. Tenta novamente."
  };
}
