"use client";

import { useState } from "react";
import { Lock, Loader2 } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { formatCurrency } from "@/lib/format";

export function CheckoutView() {
  const { items, subtotal } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCheckout() {
    setLoading(true);
    setError("");

    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((item) => ({
          id: item.product.id,
          quantity: item.quantity
        }))
      })
    });

    const data = (await response.json()) as { url?: string; error?: string };
    if (!response.ok || !data.url) {
      setError(data.error ?? "Não foi possível iniciar o checkout.");
      setLoading(false);
      return;
    }

    window.location.href = data.url;
  }

  return (
    <div className="min-h-[80svh] bg-ink px-4 pb-20 pt-24 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_420px]">
        <section>
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-mint">Checkout seguro</p>
          <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">Finalizar encomenda</h1>
          <div className="premium-border mt-8 rounded-lg bg-white/[0.03] p-6">
            <div className="flex items-center gap-3 text-white">
              <Lock size={20} className="text-mint" />
              <h2 className="text-xl font-semibold">Pagamento via Stripe</h2>
            </div>
            <p className="mt-4 text-sm leading-6 text-titanium">
              Ao continuar, serás redirecionado para uma sessão de checkout Stripe. A loja já está preparada para usar Price IDs reais ou gerar preços a partir do catálogo local.
            </p>
            {error ? <p className="mt-4 rounded-md border border-ember/30 bg-ember/10 p-3 text-sm text-white">{error}</p> : null}
            <button
              type="button"
              disabled={items.length === 0 || loading}
              onClick={handleCheckout}
              className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-platinum px-6 text-sm font-semibold text-ink transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
              Pagar {formatCurrency(subtotal)}
            </button>
          </div>
        </section>

        <aside className="premium-border h-fit rounded-lg bg-white/[0.04] p-6">
          <h2 className="text-xl font-semibold text-white">Encomenda</h2>
          <div className="mt-6 grid gap-4">
            {items.length === 0 ? (
              <p className="text-sm text-titanium">Adiciona produtos ao carrinho para continuar.</p>
            ) : (
              items.map((item) => (
                <div key={item.product.id} className="flex justify-between gap-4 text-sm">
                  <div>
                    <p className="font-medium text-white">{item.product.name}</p>
                    <p className="mt-1 text-titanium">Qtd. {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-white">{formatCurrency(item.product.price * item.quantity)}</p>
                </div>
              ))
            )}
          </div>
          <div className="mt-6 border-t border-white/10 pt-5">
            <div className="flex justify-between text-lg font-semibold text-white">
              <span>Total</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
