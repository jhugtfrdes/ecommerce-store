import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { ClearCartOnSuccess } from "@/components/clear-cart-on-success";

export const metadata: Metadata = {
  title: "Pagamento concluído",
  description: "A tua encomenda foi recebida com sucesso."
};

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-[80svh] bg-ink px-4 py-28 sm:px-6 lg:px-8">
      <ClearCartOnSuccess />
      <div className="premium-border mx-auto max-w-2xl rounded-lg bg-white/[0.04] p-8 text-center">
        <CheckCircle2 className="mx-auto text-mint" size={44} />
        <h1 className="mt-6 text-3xl font-semibold text-white">Pagamento concluído</h1>
        <p className="mt-4 text-titanium">
          Obrigado pela compra. A confirmação será enviada pelo Stripe para o email usado no checkout.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-platinum px-6 text-sm font-semibold text-ink"
        >
          Voltar à loja
        </Link>
      </div>
    </div>
  );
}
