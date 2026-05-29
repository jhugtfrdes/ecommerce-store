"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, Check, Shield, Sparkles, Truck, Zap } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { ReviewCard } from "@/components/review-card";
import type { Product, Review } from "@/lib/products";

type HomeExperienceProps = {
  featured: Product[];
  reviews: Review[];
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 }
};

export function HomeExperience({ featured, reviews }: HomeExperienceProps) {
  const heroProduct = featured[0];

  return (
    <>
      <section className="relative min-h-[92svh] overflow-hidden bg-[linear-gradient(140deg,#050608_0%,#101218_42%,#081512_100%)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_16%,rgba(99,230,190,0.22),transparent_28%),radial-gradient(circle_at_78%_18%,rgba(126,87,255,0.18),transparent_30%),radial-gradient(circle_at_70%_84%,rgba(255,107,53,0.14),transparent_34%)]" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-ink to-transparent" />
        <div className="relative mx-auto grid min-h-[92svh] max-w-7xl items-center gap-10 px-4 pb-16 pt-28 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8">
          <motion.div initial="hidden" animate="visible" transition={{ staggerChildren: 0.08 }} className="max-w-2xl">
            <motion.p
              variants={fadeUp}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-platinum shadow-glow"
            >
              <Zap size={15} className="text-mint" />
              Coleção editável no painel admin
            </motion.p>
            <motion.h1 variants={fadeUp} className="text-balance text-5xl font-semibold text-white sm:text-6xl lg:text-7xl">
              Tecnologia premium, comprada sem fricção.
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-6 max-w-xl text-lg leading-8 text-titanium">
              Uma montra rápida, escura e elegante para produtos com margem alta, checkout Stripe e experiência mobile-first.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-ink shadow-[0_18px_60px_rgba(255,255,255,0.14)] transition hover:scale-[1.02]" href="#produtos">
                Comprar agora <ArrowRight size={18} className="transition group-hover:translate-x-0.5" />
              </Link>
              <Link className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-6 text-sm font-semibold text-white transition hover:border-mint/60 hover:bg-mint/10" href={heroProduct ? `/produto/${heroProduct.slug}` : "#produtos"}>
                Ver produto em destaque
              </Link>
            </motion.div>
            <motion.div variants={fadeUp} className="mt-10 grid grid-cols-3 gap-3 text-xs text-titanium sm:text-sm">
              {["Envio 24h", "Pagamento seguro", "Stock em tempo real"].map((item) => (
                <div key={item} className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
                  <Check size={16} className="mb-2 text-mint" />
                  <span>{item}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {heroProduct ? (
            <motion.div initial={{ opacity: 0, scale: 0.96, y: 28 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.7, ease: "easeOut" }} className="relative">
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="premium-border overflow-hidden rounded-[2rem] bg-white/[0.04] shadow-premium">
                <Image src={heroProduct.images[0]} alt={heroProduct.name} width={1200} height={1400} priority className="aspect-[4/5] w-full object-cover" />
              </motion.div>
              <div className="premium-border absolute bottom-5 left-5 right-5 rounded-xl bg-ink/72 p-4 backdrop-blur-2xl sm:left-auto sm:w-80">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-white">{heroProduct.name}</p>
                    <p className="mt-1 text-xs text-titanium">{heroProduct.shortDescription}</p>
                  </div>
                  <BadgeCheck className="shrink-0 text-mint" size={22} />
                </div>
              </div>
            </motion.div>
          ) : null}
        </div>
      </section>

      <section id="produtos" className="bg-ink px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.22em] text-mint">Catálogo</p>
              <h2 className="mt-3 text-3xl font-semibold text-white sm:text-5xl">Compacto, claro e pronto a converter.</h2>
            </div>
            <Link href="/checkout" className="text-sm font-semibold text-titanium transition hover:text-white">
              Checkout rápido
            </Link>
          </div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
            className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
          >
            {featured.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </motion.div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[linear-gradient(110deg,rgba(255,255,255,0.035),rgba(99,230,190,0.075),rgba(126,87,255,0.06))] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-3">
          {[
            { icon: Shield, title: "Stripe-ready", text: "Checkout seguro com sessão Stripe e webhook base." },
            { icon: Truck, title: "Menos abandono", text: "CTAs diretos, resumo claro e carrinho persistente." },
            { icon: Sparkles, title: "Gestão sem código", text: "Produtos, preço, stock e imagens no painel admin." }
          ].map((item, index) => (
            <motion.div key={item.title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ delay: index * 0.06 }} className="premium-border rounded-lg bg-ink/45 p-5">
              <item.icon className="text-mint" size={22} />
              <h3 className="mt-4 text-base font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-titanium">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-ink px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.22em] text-mint">Prova social</p>
              <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Reviews que reduzem dúvida.</h2>
            </div>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {reviews.map((review) => (
              <ReviewCard key={review.author} review={review} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
