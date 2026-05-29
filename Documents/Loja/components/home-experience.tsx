"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, BadgeCheck, Box, Check, CreditCard, Layers3, Shield, Sparkles, Star, Zap } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { ReviewCard } from "@/components/review-card";
import type { Product, Review } from "@/lib/products";

type HomeExperienceProps = {
  featured: Product[];
  reviews: Review[];
};

const fadeUp = {
  hidden: { opacity: 0, y: 26, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" }
};

export function HomeExperience({ featured, reviews }: HomeExperienceProps) {
  const heroProduct = featured[0];
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.35], [0, -80]);
  const glowY = useTransform(scrollYProgress, [0, 0.35], [0, 90]);

  return (
    <>
      <section className="relative min-h-[96svh] overflow-hidden bg-[#050608]">
        <motion.div style={{ y: glowY }} className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(99,230,190,0.22),transparent_30%),radial-gradient(circle_at_82%_10%,rgba(126,87,255,0.21),transparent_28%),radial-gradient(circle_at_52%_82%,rgba(255,107,53,0.13),transparent_36%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.07)_0_1px,transparent_1px_100%)] bg-[size:64px_64px] opacity-[0.08]" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-ink via-ink/70 to-transparent" />

        <div className="relative mx-auto grid min-h-[96svh] max-w-7xl items-center gap-10 px-4 pb-16 pt-28 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8">
          <motion.div initial="hidden" animate="visible" transition={{ staggerChildren: 0.08 }} className="max-w-3xl">
            <motion.p variants={fadeUp} className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-platinum shadow-glow backdrop-blur-2xl">
              <Sparkles size={15} className="text-mint" />
              Loja high-end com checkout Stripe e gestão admin
            </motion.p>
            <motion.h1 variants={fadeUp} className="text-balance text-5xl font-semibold leading-[0.96] text-white sm:text-7xl lg:text-8xl">
              O futuro da tua loja parece isto.
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-6 max-w-2xl text-lg leading-8 text-titanium sm:text-xl">
              Uma experiência ecommerce com estética de startup premium: rápida, escura, elegante, conversora e pronta para escalar produtos.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <MagneticLink href="#produtos">Explorar produtos</MagneticLink>
              <Link className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.045] px-6 text-sm font-semibold text-white backdrop-blur-xl transition hover:border-mint/60 hover:bg-mint/10" href={heroProduct ? `/produto/${heroProduct.slug}` : "#produtos"}>
                Ver destaque
              </Link>
            </motion.div>
            <motion.div variants={fadeUp} className="mt-9 grid grid-cols-3 gap-3 text-xs text-titanium sm:max-w-xl sm:text-sm">
              {["Envio 24h", "Sessão segura", "Admin sem código"].map((item) => (
                <div key={item} className="rounded-lg border border-white/10 bg-white/[0.045] p-3 backdrop-blur-xl">
                  <Check size={15} className="mb-2 text-mint" />
                  <span>{item}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {heroProduct ? (
            <motion.div style={{ y: heroY }} initial={{ opacity: 0, scale: 0.95, rotateX: 8 }} animate={{ opacity: 1, scale: 1, rotateX: 0 }} transition={{ duration: 0.75, ease: "easeOut" }} className="relative perspective-1000">
              <motion.div animate={{ y: [0, -12, 0], rotate: [0, 0.45, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} className="premium-border overflow-hidden rounded-[2rem] bg-white/[0.055] shadow-premium backdrop-blur-2xl">
                <Image src={heroProduct.images[0]} alt={heroProduct.name} width={1200} height={1350} priority className="aspect-[4/5] w-full object-cover" />
              </motion.div>
              <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut" }} className="premium-border absolute -left-2 top-10 rounded-xl bg-ink/72 p-4 shadow-glow backdrop-blur-2xl sm:-left-8">
                <p className="text-xs text-titanium">Rating</p>
                <div className="mt-2 flex gap-1 text-mint">
                  {Array.from({ length: heroProduct.rating }).map((_, index) => (
                    <Star key={index} size={14} fill="currentColor" />
                  ))}
                </div>
              </motion.div>
              <div className="premium-border absolute bottom-5 left-5 right-5 rounded-xl bg-ink/76 p-4 backdrop-blur-2xl sm:left-auto sm:w-80">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-white">{heroProduct.name}</p>
                    <p className="mt-1 text-xs leading-5 text-titanium">{heroProduct.shortDescription}</p>
                  </div>
                  <BadgeCheck className="shrink-0 text-mint" size={22} />
                </div>
              </div>
            </motion.div>
          ) : null}
        </div>
      </section>

      <section className="bg-ink px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-3 md:grid-cols-4">
          {[
            { icon: Zap, label: "Performance", value: "Next.js 15" },
            { icon: CreditCard, label: "Checkout", value: "Stripe-ready" },
            { icon: Layers3, label: "Catálogo", value: `${featured.length} produtos` },
            { icon: Shield, label: "Sessão", value: "HttpOnly" }
          ].map((item, index) => (
            <motion.div key={item.label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} className="premium-border rounded-lg bg-white/[0.035] p-4 backdrop-blur-xl">
              <item.icon className="text-mint" size={19} />
              <p className="mt-4 text-xs uppercase tracking-[0.18em] text-titanium">{item.label}</p>
              <p className="mt-1 text-lg font-semibold text-white">{item.value}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="produtos" className="bg-ink px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.22em] text-mint">Catálogo</p>
                <h2 className="mt-3 max-w-3xl text-3xl font-semibold text-white sm:text-5xl">Cards densos, luxuosos e desenhados para vender.</h2>
              </div>
              <Link href="/checkout" className="text-sm font-semibold text-titanium transition hover:text-white">
                Checkout rápido
              </Link>
            </div>
          </Reveal>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={{ visible: { transition: { staggerChildren: 0.045 } } }} className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
            {featured.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </motion.div>
        </div>
      </section>

      <section className="bg-ink px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <Reveal className="premium-border rounded-2xl bg-[linear-gradient(135deg,rgba(255,255,255,0.07),rgba(99,230,190,0.06),rgba(126,87,255,0.05))] p-6 shadow-premium backdrop-blur-2xl sm:p-8">
            <Box className="text-mint" size={26} />
            <h2 className="mt-8 max-w-2xl text-3xl font-semibold text-white sm:text-5xl">Do primeiro clique ao checkout, tudo reduz fricção.</h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-titanium">
              Navegação mínima, CTAs claros, cards compactos, carrinho persistente e pagamento Stripe. A interface deixa o produto respirar sem parecer vazia.
            </p>
          </Reveal>
          <div className="grid gap-4">
            {[
              ["Glass UI", "Camadas translúcidas, blur e bordas finas para um look premium."],
              ["Storytelling", "Secções sequenciais que explicam valor antes de pedir compra."],
              ["Admin seguro", "Roles, sessão assinada e permissões separadas por tipo de utilizador."]
            ].map(([title, text], index) => (
              <Reveal key={title} delay={index * 0.06} className="premium-border rounded-xl bg-white/[0.04] p-5">
                <h3 className="font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-titanium">{text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-mint">Prova social</p>
            <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Confiança antes da conversão.</h2>
          </Reveal>
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

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 22, filter: "blur(8px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }} viewport={{ once: true, margin: "-90px" }} transition={{ duration: 0.55, delay, ease: "easeOut" }} className={className}>
      {children}
    </motion.div>
  );
}

function MagneticLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <motion.div whileHover={{ scale: 1.025 }} whileTap={{ scale: 0.98 }}>
      <Link href={href} className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-ink shadow-[0_18px_70px_rgba(255,255,255,0.16)] transition hover:bg-platinum">
        {children}
        <ArrowRight size={18} className="transition group-hover:translate-x-0.5" />
      </Link>
    </motion.div>
  );
}
