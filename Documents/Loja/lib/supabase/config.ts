export function getSupabaseConfig() {
  return {
    url: readEnv("NEXT_PUBLIC_SUPABASE_URL"),
    anonKey: readEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    serviceRoleKey: readEnv("SUPABASE_SERVICE_ROLE_KEY")
  };
}

export function isSupabaseConfigured() {
  const config = getSupabaseConfig();
  return Boolean(config.url && config.anonKey);
}

export function assertSupabasePublicConfig() {
  const config = getSupabaseConfig();

  if (!config.url || !config.anonKey) {
    throw new Error("Supabase não está configurado. Define NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }

  return {
    url: config.url,
    anonKey: config.anonKey
  };
}

function readEnv(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    return undefined;
  }

  return value.replace(/^["']|["']$/g, "");
}
