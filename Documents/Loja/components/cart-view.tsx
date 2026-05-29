"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { formatCurrency } from "@/lib/format";

export function CartView() {
  const { items, subtotal, updateQuantity, removeItem } = useCart();
  const shipping = items.length > 0 ? 0 : 0;
  const total = subtotal + shipping;

  return (
    <div className="min-h-[80svh] bg-[radial-gradient(circle_at_50%_0%,rgba(126,87,255,0.10),transparent_30%),#07080a] px-4 pb-20 pt-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-4xl font-semibold text-white sm:text-5xl">Carrinho</h1>
        {items.length === 0 ? (
          <div className="premium-border mt-10 rounded-lg bg-white/[0.03] p-8">
            <p className="text-titanium">O teu carrinho ainda está vazio.</p>
            <Link
              href="/#produtos"
              className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-platinum px-6 text-sm font-semibold text-ink"
            >
              Explorar produtos
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
            <div className="grid gap-4">
              {items.map((item) => (
                <article key={item.product.id} className="premium-border grid grid-cols-[96px_1fr] gap-4 rounded-lg bg-white/[0.03] p-4 sm:grid-cols-[132px_1fr_auto]">
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.name}
                    width={260}
                    height={260}
                    className="aspect-square rounded-md object-cover"
                  />
                  <div>
                    <Link href={`/produto/${item.product.slug}`} className="font-semibold text-white hover:text-mint">
                      {item.product.name}
                    </Link>
                    <p className="mt-1 text-sm text-titanium">{item.product.category}</p>
                    <p className="mt-3 font-semibold text-white">{formatCurrency(item.product.price)}</p>
                    <div className="mt-4 flex items-center gap-2">
                      <button
                        type="button"
                        aria-label="Diminuir quantidade"
                        className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-white"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="grid h-9 min-w-10 place-items-center text-sm font-semibold text-white">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label="Aumentar quantidade"
                        className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-white"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      >
                        <Plus size={16} />
                      </button>
                      <button
                        type="button"
                        aria-label="Remover produto"
                        className="ml-2 grid h-9 w-9 place-items-center rounded-full border border-white/10 text-titanium transition hover:text-white"
                        onClick={() => removeItem(item.product.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <p className="hidden text-right font-semibold text-white sm:block">
                    {formatCurrency(item.product.price * item.quantity)}
                  </p>
                </article>
              ))}
            </div>

            <aside className="premium-border h-fit rounded-lg bg-white/[0.04] p-6">
              <h2 className="text-xl font-semibold text-white">Resumo</h2>
              <div className="mt-6 grid gap-4 text-sm">
                <div className="flex justify-between text-titanium">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-titanium">
                  <span>Envio</span>
                  <span>Grátis</span>
                </div>
                <div className="border-t border-white/10 pt-4">
                  <div className="flex justify-between text-lg font-semibold text-white">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>
              <Link
                href="/checkout"
                className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-platinum px-6 text-sm font-semibold text-ink transition hover:bg-white"
              >
                Avançar para checkout
              </Link>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
