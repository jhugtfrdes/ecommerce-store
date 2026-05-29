import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Checkout cancelado",
  description: "O pagamento foi cancelado antes de ser concluído."
};

export default function CheckoutCanceledPage() {
  return (
    <div className="min-h-[80svh] bg-ink px-4 py-28 sm:px-6 lg:px-8">
      <div className="premium-border mx-auto max-w-2xl rounded-lg bg-white/[0.04] p-8 text-center">
        <h1 className="text-3xl font-semibold text-white">Checkout cancelado</h1>
        <p className="mt-4 text-titanium">A compra não foi concluída. O carrinho continua disponível no teu browser.</p>
        <Link
          href="/carrinho"
          className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-platinum px-6 text-sm font-semibold text-ink"
        >
          Voltar ao carrinho
        </Link>
      </div>
    </div>
  );
}
