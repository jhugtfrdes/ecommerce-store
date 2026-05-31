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

  const body = (await request.json()) as { email?: string; password?: string };

  if (!body.email || !body.password) {
    return NextResponse.json({ error: "Email e password são obrigatórios." }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: body.email,
    password: body.password
  });

  if (error || !data.user) {
    return NextResponse.json({ error: "Credenciais inválidas." }, { status: 401 });
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
    }
  });
}
