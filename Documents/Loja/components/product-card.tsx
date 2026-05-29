import Image from "next/image";
import Link from "next/link";
import { AddToCart } from "@/components/add-to-cart";
import { formatCurrency } from "@/lib/format";
import type { Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="premium-border overflow-hidden rounded-lg bg-white/[0.035]">
      <Link href={`/produto/${product.slug}`} className="block">
        <Image
          src={product.images[0]}
          alt={product.name}
          width={900}
          height={900}
          className="aspect-square w-full object-cover transition duration-500 hover:scale-[1.03]"
        />
      </Link>
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link href={`/produto/${product.slug}`} className="font-semibold text-white transition hover:text-mint">
              {product.name}
            </Link>
            <p className="mt-1 text-sm text-titanium">{product.category}</p>
          </div>
          <p className="font-semibold text-white">{formatCurrency(product.price)}</p>
        </div>
        <p className="mt-4 min-h-12 text-sm leading-6 text-titanium">{product.shortDescription}</p>
        <div className="mt-5">
          <AddToCart product={product} />
        </div>
      </div>
    </article>
  );
}
