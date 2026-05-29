"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Star } from "lucide-react";
import { AddToCart } from "@/components/add-to-cart";
import { formatCurrency } from "@/lib/format";
import type { Product } from "@/lib/products";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay: index * 0.06 }}
      whileHover={{ y: -5 }}
      className="premium-border group overflow-hidden rounded-lg bg-white/[0.032] shadow-[0_14px_50px_rgba(0,0,0,0.2)] transition-colors hover:border-white/20 hover:bg-white/[0.055]"
    >
      <Link href={`/produto/${product.slug}`} className="relative block overflow-hidden bg-[linear-gradient(140deg,rgba(255,255,255,0.04),rgba(99,230,190,0.06))]">
        <Image
          src={product.images[0]}
          alt={product.name}
          width={720}
          height={620}
          className="aspect-[1.25/1] w-full object-cover transition duration-700 group-hover:scale-[1.035]"
        />
        <span className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-ink/60 text-white opacity-0 backdrop-blur-xl transition group-hover:opacity-100">
          <ArrowUpRight size={16} />
        </span>
      </Link>
      <div className="p-3 sm:p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link href={`/produto/${product.slug}`} className="font-semibold text-white transition hover:text-mint">
              {product.name}
            </Link>
            <p className="mt-1 truncate text-xs text-titanium sm:text-sm">{product.category}</p>
          </div>
          <p className="shrink-0 text-sm font-semibold text-white sm:text-base">{formatCurrency(product.price)}</p>
        </div>
        <div className="mt-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1 text-mint">
            <Star size={13} fill="currentColor" />
            <span className="text-xs font-semibold">{product.rating}.0</span>
          </div>
          <span className="text-xs text-titanium">{product.stock > 0 ? `${product.stock} stock` : "Esgotado"}</span>
        </div>
        <p className="mt-2 line-clamp-2 min-h-10 text-xs leading-5 text-titanium sm:text-sm">{product.shortDescription}</p>
        <div className="mt-3">
          <AddToCart product={product} compact />
        </div>
      </div>
    </motion.article>
  );
}
