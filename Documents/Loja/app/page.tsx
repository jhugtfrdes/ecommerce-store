import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Shield, Sparkles, Truck } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { ReviewCard } from "@/components/review-card";
import { products, reviews } from "@/lib/products";

export default function HomePage() {
  const featured = products.slice(0, 3);

  return (
    <>
      <section className="relative min-h-[92svh] overflow-hidden bg-radial-premium">
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink to-transparent" />
        <div className="mx-auto grid min-h-[92svh] max-w-7xl items-center gap-10 px-4 pb-12 pt-28 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div className="max-w-2xl">
            <p className="mb-5 inline-flex rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-titanium">
              Nova coleção limitada
            </p>
            <h1 className="text-balance text-5xl font-semibold tracking-normal text-white sm:text-6xl lg:text-7xl">
              Noir Atelier
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-titanium">
              Produtos premium para trabalho, viagem e rotina criativa. Uma experiência de compra escura, rápida e refinada.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="#produtos"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-platinum px-6 text-sm font-semibold text-ink transition hover:bg-white"
              >
                Comprar agora <ArrowRight size={18} />
              </Link>
              <Link
                href="/produto/aura-headphones"
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 px-6 text-sm font-semibold text-white transition hover:border-white/35 hover:bg-white/5"
              >
                Ver destaque
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-4 text-sm text-titanium">
              {["Envio 24h", "Pagamentos seguros", "Devolução 30 dias"].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <Check size={16} className="text-mint" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="premium-border overflow-hidden rounded-[2rem] bg-graphite shadow-premium">
              <Image
                src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1600&auto=format&fit=crop"
                alt="Auscultadores premium Noir Atelier"
                width={1200}
                height={1400}
                priority
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="produtos" className="bg-ink px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.22em] text-mint">Catálogo</p>
              <h2 className="mt-3 text-3xl font-semibold text-white sm:text-5xl">Pronto para vários produtos.</h2>
            </div>
            <Link href="/carrinho" className="text-sm font-semibold text-titanium transition hover:text-white">
              Ver carrinho
            </Link>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-graphite/45 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-3">
          {[
            { icon: Shield, title: "Checkout Stripe", text: "Pagamentos com cartão prontos para produção." },
            { icon: Truck, title: "Logística clara", text: "Estados de compra simples e focados em conversão." },
            { icon: Sparkles, title: "SEO otimizado", text: "Metadata, páginas estáticas e performance por defeito." }
          ].map((item) => (
            <div key={item.title} className="premium-border rounded-lg bg-white/[0.03] p-6">
              <item.icon className="text-mint" size={24} />
              <h3 className="mt-5 text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-titanium">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-ink px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">Reviews</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {reviews.map((review) => (
              <ReviewCard key={review.author} review={review} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
