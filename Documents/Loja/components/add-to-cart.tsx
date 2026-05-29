"use client";

import { ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/components/cart-provider";
import type { Product } from "@/lib/products";

export function AddToCart({ product, compact = false }: { product: Product; compact?: boolean }) {
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  return (
    <button
      type="button"
      onClick={() => {
        addItem(product);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1200);
      }}
      className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-white px-3 text-sm font-semibold text-ink shadow-[0_12px_38px_rgba(255,255,255,0.08)] transition hover:scale-[1.015] hover:bg-platinum active:scale-[0.99] sm:h-11 sm:px-5"
    >
      <ShoppingBag size={18} />
      <span>{added ? "Adicionado" : compact ? "Adicionar" : "Adicionar ao carrinho"}</span>
    </button>
  );
}
