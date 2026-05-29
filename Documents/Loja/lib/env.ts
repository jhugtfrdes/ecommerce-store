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

  if (!process.env.ADMIN_SESSION_SECRET) {
    warnings.push("ADMIN_SESSION_SECRET não está definido. A app vai usar um secret runtime temporário.");
  }

  if (!process.env.ADMIN_EMAIL && !process.env.ADMIN_USERS_JSON) {
    missing.push("ADMIN_EMAIL ou ADMIN_USERS_JSON");
  }

  if (!process.env.ADMIN_PASSWORD_HASH && !process.env.ADMIN_USERS_JSON) {
    missing.push("ADMIN_PASSWORD_HASH ou ADMIN_USERS_JSON");
  }

  if (!process.env.NEXT_PUBLIC_SITE_URL) {
    warnings.push("NEXT_PUBLIC_SITE_URL não está definido. Será usado http://localhost:3000.");
  }

  return {
    ok: missing.length === 0,
    missing,
    warnings,
    message: missing.length
      ? `Setup incompleto: configura ${missing.join(", ")} ou executa npm run setup.`
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
