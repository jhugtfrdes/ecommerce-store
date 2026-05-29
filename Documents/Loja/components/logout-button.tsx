"use client";

import { LogOut } from "lucide-react";

export function LogoutButton() {
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  }

  return (
    <button onClick={logout} className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/10 px-6 text-sm font-semibold text-white transition hover:bg-white/10">
      <LogOut size={17} />
      Sair
    </button>
  );
}
