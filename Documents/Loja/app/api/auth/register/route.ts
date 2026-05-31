import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ProfileAuth = {
  email: string;
  full_name: string | null;
  role: "user" | "admin";
};

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase não está configurado. Define NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY." }, { status: 503 });
  }

  const body = (await request.json()) as { email?: string; name?: string; password?: string };

  if (!body.email || !body.password || body.password.length < 8) {
    return NextResponse.json({ error: "Email e password com pelo menos 8 caracteres são obrigatórios." }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email: body.email,
    password: body.password,
    options: {
      data: {
        name: body.name ?? ""
      }
    }
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const { data: profile } = data.user
    ? await supabase
        .from("profiles")
        .select("email, full_name, role")
        .eq("id", data.user.id)
        .maybeSingle<ProfileAuth>()
    : { data: null };

  return NextResponse.json({
    user: data.user
      ? {
          email: profile?.email ?? data.user.email,
          name: profile?.full_name ?? data.user.user_metadata?.name ?? null,
          role: profile?.role ?? "user"
        }
      : null,
    needsEmailConfirmation: !data.session
  }, { status: 201 });
}
