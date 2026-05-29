import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { getCurrentSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Login",
  description: "Entrar na conta Noir Atelier."
};

export default async function LoginPage() {
  if (await getCurrentSession()) {
    redirect("/account");
  }

  return <AuthForm mode="login" />;
}
