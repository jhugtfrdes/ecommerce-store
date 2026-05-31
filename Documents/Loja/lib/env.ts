import "server-only";

type EnvValidation = {
  ok: boolean;
  missing: string[];
  warnings: string[];
  message: string;
};

export function validateEnvironment(): EnvValidation {
  const missing: string[] = [];
  const warnings: string[] = [];

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    missing.push("NEXT_PUBLIC_SUPABASE_URL");
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    warnings.push("SUPABASE_SERVICE_ROLE_KEY não está definido. O admin não consegue gerir produtos nem uploads.");
  }

  return {
    ok: missing.length === 0,
    missing,
    warnings,
    message: missing.length
      ? `Setup incompleto: configura ${missing.join(", ")} no .env.local e na Vercel.`
      : "Configuração pronta."
  };
}

export function getSetupMessage() {
  const validation = validateEnvironment();
  return {
    configured: validation.ok,
    message: validation.message,
    missing: validation.missing,
    warnings: validation.warnings
  };
}
