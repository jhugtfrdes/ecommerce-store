import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Star } from "lucide-react";
import { AddToCart } from "@/components/add-to-cart";
import { ReviewCard } from "@/components/review-card";
import { getProductBySlug, getProducts } from "@/lib/catalog";
import { formatCurrency } from "@/lib/format";
import { reviews } from "@/lib/products";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {};
  }

  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: [{ url: product.images[0], alt: product.name }]
    }
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images,
    description: product.description,
    brand: { "@type": "Brand", name: "Noir Atelier" },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: reviews.length
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "EUR",
      price: (product.price / 100).toFixed(2),
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    }
  };

  return (
    <div className="bg-ink px-4 pb-20 pt-24 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="grid gap-4 sm:grid-cols-2">
          {product.images.map((image) => (
            <div key={image} className="premium-border overflow-hidden rounded-lg bg-graphite">
              <Image
                src={image}
                alt={product.name}
                width={1000}
                height={1000}
                priority={image === product.images[0]}
                className="aspect-square w-full object-cover"
              />
            </div>
          ))}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-mint">{product.category}</p>
          <h1 className="mt-3 text-4xl font-semibold text-white sm:text-6xl">{product.name}</h1>
          <div className="mt-5 flex items-center gap-3">
            <div className="flex gap-1 text-mint">
              {Array.from({ length: product.rating }).map((_, index) => (
                <Star key={index} size={17} fill="currentColor" />
              ))}
            </div>
            <span className="text-sm text-titanium">{reviews.length} reviews</span>
          </div>
          <p className="mt-6 text-3xl font-semibold text-white">{formatCurrency(product.price)}</p>
          <p className="mt-5 text-lg leading-8 text-titanium">{product.description}</p>

          <div className="mt-8 grid gap-3">
            {product.features.map((feature) => (
              <div key={feature} className="flex items-center gap-3 text-sm text-platinum">
                <Check size={18} className="text-mint" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-3">
            <AddToCart product={product} />
            <Link
              href="/checkout"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 px-6 text-sm font-semibold text-white transition hover:border-white/35 hover:bg-white/5"
            >
              Ir para checkout
            </Link>
          </div>
          <p className="mt-4 text-sm text-titanium">{product.stock} unidades em stock</p>
        </aside>
      </div>

      <section className="mx-auto mt-20 max-w-7xl">
        <h2 className="text-3xl font-semibold text-white">O que dizem os clientes</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {reviews.map((review) => (
            <ReviewCard key={review.author} review={review} />
          ))}
        </div>
      </section>
    </div>
  );
}
