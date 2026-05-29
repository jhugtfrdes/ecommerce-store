"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
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
      whileHover={{ y: -6 }}
      className="premium-border group overflow-hidden rounded-lg bg-white/[0.035] shadow-[0_18px_70px_rgba(0,0,0,0.22)]"
    >
      <Link href={`/produto/${product.slug}`} className="block">
        <Image
          src={product.images[0]}
          alt={product.name}
          width={900}
          height={900}
          className="aspect-[1.12/1] w-full object-cover transition duration-700 group-hover:scale-[1.045]"
        />
      </Link>
      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link href={`/produto/${product.slug}`} className="font-semibold text-white transition hover:text-mint">
              {product.name}
            </Link>
            <p className="mt-1 text-sm text-titanium">{product.category}</p>
          </div>
          <p className="font-semibold text-white">{formatCurrency(product.price)}</p>
        </div>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-titanium">{product.shortDescription}</p>
        <div className="mt-4">
          <AddToCart product={product} />
        </div>
      </div>
    </motion.article>
  );
}
