import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Crown, PackageCheck, ShieldCheck } from "lucide-react";
import { LogoutButton } from "@/components/logout-button";
import { getCurrentSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Conta",
  description: "Área de cliente Noir Atelier."
};

export default async function AccountPage() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login?next=/account");
  }

  return (
    <div className="min-h-[80svh] bg-[radial-gradient(circle_at_70%_0%,rgba(99,230,190,0.12),transparent_30%),#07080a] px-4 pb-20 pt-28 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-mint">Conta</p>
        <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">Olá, {session.email}</h1>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Card icon={ShieldCheck} title="Sessão segura" text="Cookie HttpOnly com expiração e assinatura HMAC." />
          <Card icon={PackageCheck} title="Compras" text="Histórico e tracking podem ser ligados aqui." />
          <Card icon={Crown} title="Role" text={session.role === "admin" ? "Administrador" : "Cliente"} />
        </div>
        {session.role === "admin" ? (
          <Link href="/admin" className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-ink transition hover:scale-[1.01]">
            Painel Admin
          </Link>
        ) : null}
        <div>
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}

function Card({ icon: Icon, title, text }: { icon: React.ComponentType<{ size?: number; className?: string }>; title: string; text: string }) {
  return (
    <div className="premium-border rounded-lg bg-white/[0.045] p-5">
      <Icon className="text-mint" size={22} />
      <h2 className="mt-4 font-semibold text-white">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-titanium">{text}</p>
    </div>
  );
}
