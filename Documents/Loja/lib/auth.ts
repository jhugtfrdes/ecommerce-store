import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

type ProfileAuth = {
  email: string;
  full_name: string | null;
  role: "user" | "admin";
};

export async function getCurrentSession() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("email, full_name, role")
    .eq("id", userData.user.id)
    .maybeSingle<ProfileAuth>();

  return {
    sub: userData.user.id,
    email: profile?.email ?? userData.user.email ?? "",
    name: profile?.full_name ?? userData.user.user_metadata?.name ?? null,
    role: profile?.role ?? "user"
  };
}
