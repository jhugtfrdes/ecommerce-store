"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, ShoppingBag, UserRound, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/components/cart-provider";

type AuthUser = {
  email: string;
  role: "user" | "admin";
} | null;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<AuthUser>(null);
  const { count } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((response) => response.json())
      .then((data: { user: AuthUser }) => setUser(data.user))
      .catch(() => setUser(null));
  }, []);

  const links = [
    { href: "/#produtos", label: "Produtos" },
    { href: "/produto/aura-headphones", label: "Destaque" },
    { href: "/checkout", label: "Checkout" },
    ...(user?.role === "admin" ? [{ href: "/admin", label: "Painel Admin" }] : [])
  ];

  return (
    <motion.header
      initial={{ y: -18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "border-b border-white/10 bg-ink/68 shadow-[0_16px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl" : "bg-ink/28 backdrop-blur-xl"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-2 text-base font-semibold text-white">
          <span className="h-2.5 w-2.5 rounded-full bg-mint shadow-[0_0_24px_rgba(99,230,190,0.9)] transition group-hover:scale-125" />
          Noir Atelier
        </Link>
        <div className="hidden items-center gap-7 text-sm text-titanium md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-white">
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={user ? "/account" : "/login"}
            className="hidden h-10 items-center justify-center gap-2 rounded-full border border-white/10 px-4 text-sm font-semibold text-white transition hover:bg-white/10 sm:inline-flex"
          >
            <UserRound size={17} />
            {user ? "Conta" : "Login"}
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
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="border-t border-white/10 bg-ink/92 px-4 py-4 backdrop-blur-2xl md:hidden"
          >
            <div className="mx-auto grid max-w-7xl gap-3 text-sm text-titanium">
              {links.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
                  {link.label}
                </Link>
              ))}
              <Link href={user ? "/account" : "/login"} onClick={() => setOpen(false)}>
                {user ? "Conta" : "Login"}
              </Link>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}
