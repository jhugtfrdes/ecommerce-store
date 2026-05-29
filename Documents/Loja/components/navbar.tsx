"use client";

import Link from "next/link";
import { Menu, Settings, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/components/cart-provider";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { count } = useCart();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-ink/62 backdrop-blur-2xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-base font-semibold text-white transition hover:text-mint">
          Noir Atelier
        </Link>
        <div className="hidden items-center gap-8 text-sm text-titanium md:flex">
          <Link href="/#produtos" className="transition hover:text-white">
            Produtos
          </Link>
          <Link href="/produto/aura-headphones" className="transition hover:text-white">
            Destaque
          </Link>
          <Link href="/checkout" className="transition hover:text-white">
            Checkout
          </Link>
          <Link href="/admin" className="transition hover:text-white">
            Admin
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin"
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white transition hover:bg-white/10 sm:inline-flex"
            aria-label="Abrir admin"
          >
            <Settings size={18} />
          </Link>
          <Link
            href="/carrinho"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white transition hover:bg-white/10"
            aria-label="Abrir carrinho"
          >
            <ShoppingBag size={19} />
            {count > 0 ? (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-mint px-1 text-xs font-bold text-ink">
                {count}
              </span>
            ) : null}
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white md:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label="Abrir menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>
      {open ? (
        <div className="border-t border-white/10 bg-ink px-4 py-4 md:hidden">
          <div className="mx-auto grid max-w-7xl gap-3 text-sm text-titanium">
            <Link href="/#produtos" onClick={() => setOpen(false)}>
              Produtos
            </Link>
            <Link href="/produto/aura-headphones" onClick={() => setOpen(false)}>
              Destaque
            </Link>
            <Link href="/checkout" onClick={() => setOpen(false)}>
              Checkout
            </Link>
            <Link href="/admin" onClick={() => setOpen(false)}>
              Admin
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
