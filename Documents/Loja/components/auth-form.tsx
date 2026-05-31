"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Loader2, Mail, UserRound } from "lucide-react";
import { useSearchParams } from "next/navigation";

type AuthFormProps = {
  mode: "login" | "register";
};

export function AuthForm({ mode }: AuthFormProps) {
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isRegister = mode === "register";

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(isRegister ? "/api/auth/register" : "/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });

      const data = (await response.json().catch(() => ({}))) as { error?: string; needsEmailConfirmation?: boolean };

      if (!response.ok) {
        setError(data.error || "Não foi possível autenticar. Confirma os dados e tenta novamente.");
        return;
      }

      if (isRegister && data.needsEmailConfirmation) {
        setSuccess("Conta criada. Confirma o email antes de entrar.");
        return;
      }

      window.location.href = searchParams.get("next") || "/account";
    } catch {
      setError("Não foi possível ligar ao servidor. Tenta novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="relative min-h-[82svh] overflow-hidden bg-[linear-gradient(135deg,#050608,#0b1017_46%,#071512)] px-4 py-28 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_0%,rgba(99,230,190,0.17),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(126,87,255,0.17),transparent_30%)]" />
      <motion.form
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        onSubmit={submit}
        className="premium-border relative mx-auto max-w-md rounded-xl bg-white/[0.055] p-6 shadow-premium backdrop-blur-2xl"
      >
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-mint">{isRegister ? "Criar conta" : "Entrar"}</p>
        <h1 className="mt-4 text-3xl font-semibold text-white">{isRegister ? "Começa a tua coleção." : "Bem-vindo de volta."}</h1>
        <p className="mt-3 text-sm leading-6 text-titanium">
          Acesso seguro com sessão HttpOnly. Admins entram no painel; clientes acompanham conta e compras.
        </p>

        {isRegister ? (
          <Input icon={UserRound} label="Nome" value={name} onChange={setName} autoComplete="name" placeholder="O teu nome" />
        ) : null}
        <Input icon={Mail} label="Email" type="email" value={email} onChange={setEmail} autoComplete="username" placeholder="tu@exemplo.pt" />
        <Input icon={Lock} label="Password" type="password" value={password} onChange={setPassword} autoComplete={isRegister ? "new-password" : "current-password"} placeholder="Mínimo 8 caracteres" />

        {error ? <p className="mt-4 rounded-md border border-ember/30 bg-ember/10 p-3 text-sm text-white">{error}</p> : null}
        {success ? <p className="mt-4 rounded-md border border-mint/30 bg-mint/10 p-3 text-sm text-white">{success}</p> : null}
        <button className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-ink transition hover:scale-[1.01] disabled:opacity-60" disabled={loading}>
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Lock size={18} />}
          {isRegister ? "Criar conta" : "Entrar"}
        </button>
        <p className="mt-5 text-center text-sm text-titanium">
          {isRegister ? "Já tens conta?" : "Ainda não tens conta?"}{" "}
          <Link href={isRegister ? "/login" : "/register"} className="font-semibold text-white hover:text-mint">
            {isRegister ? "Entrar" : "Criar conta"}
          </Link>
        </p>
      </motion.form>
    </section>
  );
}

function Input({
  icon: Icon,
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
  placeholder
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete: string;
  placeholder: string;
}) {
  return (
    <label className="mt-5 block text-sm font-medium text-white">
      {label}
      <span className="relative mt-2 block">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-titanium" size={18} />
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={autoComplete}
          placeholder={placeholder}
          required
          className="h-12 w-full rounded-lg border border-white/10 bg-ink/80 pl-11 pr-4 text-white outline-none transition focus:border-mint/70"
        />
      </span>
    </label>
  );
}
