import { NextResponse } from "next/server";
import { getSetupMessage } from "@/lib/env";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function GET() {
  return NextResponse.json({
    ...getSetupMessage(),
    storage: "supabase",
    supabaseConfigured: isSupabaseConfigured()
  });
}
