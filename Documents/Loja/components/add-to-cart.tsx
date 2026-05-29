"use client";

import { ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/components/cart-provider";
import type { Product } from "@/lib/products";

export function AddToCart({ product }: { product: Product }) {
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
      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-platinum px-6 text-sm font-semibold text-ink transition hover:bg-white"
    >
      <ShoppingBag size={18} />
      {added ? "Adicionado" : "Adicionar ao carrinho"}
    </button>
  );
}
