"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Loader2, Mail } from "lucide-react";
import { useSearchParams } from "next/navigation";

export function AdminLogin() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setError(data.error || "Credenciais inválidas.");
      setLoading(false);
      return;
    }

    window.location.href = searchParams.get("next") || "/admin";
  }

  return (
    <div className="min-h-[80svh] bg-[radial-gradient(circle_at_50%_0%,rgba(99,230,190,0.16),transparent_34%),#07080a] px-4 py-28 sm:px-6 lg:px-8">
      <motion.form
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        onSubmit={submit}
        className="premium-border mx-auto max-w-md rounded-lg bg-white/[0.045] p-6 shadow-premium"
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-mint/12 text-mint">
          <Lock size={20} />
        </div>
        <h1 className="mt-6 text-3xl font-semibold text-white">Admin Noir</h1>
        <p className="mt-3 text-sm leading-6 text-titanium">
          Entra com credenciais configuradas no ambiente para gerir produtos, imagens, preços e stock.
        </p>

        <label className="mt-6 block text-sm font-medium text-white" htmlFor="email">
          Email
        </label>
        <div className="relative mt-2">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-titanium" size={18} />
          <input
            id="email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-12 w-full rounded-lg border border-white/10 bg-ink pl-11 pr-4 text-white outline-none transition focus:border-mint/70"
            placeholder="admin@loja.pt"
            required
          />
        </div>

        <label className="mt-6 block text-sm font-medium text-white" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-2 h-12 w-full rounded-lg border border-white/10 bg-ink px-4 text-white outline-none transition focus:border-mint/70"
          placeholder="Password segura"
          required
        />
        {error ? <p className="mt-3 text-sm text-ember">{error}</p> : null}
        <button
          disabled={loading}
          className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-ink transition hover:scale-[1.01] disabled:opacity-60"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Lock size={18} />}
          Entrar
        </button>
      </motion.form>
    </div>
  );
}
