import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { getCurrentSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Criar conta",
  description: "Criar uma conta Noir Atelier."
};

export default async function RegisterPage() {
  if (await getCurrentSession()) {
    redirect("/account");
  }

  return <AuthForm mode="register" />;
}
