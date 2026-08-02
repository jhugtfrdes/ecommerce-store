import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[linear-gradient(180deg,#07080a,#0d1117)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 text-sm text-titanium sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href="/" className="font-semibold text-white">
            Noir Atelier
          </Link>
          <p className="mt-2">Ecommerce premium em Next.js, TailwindCSS e Stripe.</p>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-3">
          <Link href="/#produtos" className="transition hover:text-white">
            Produtos
          </Link>
          <Link href="/carrinho" className="transition hover:text-white">
            Carrinho
          </Link>
          <Link href="/checkout" className="transition hover:text-white">
            Checkout
          </Link>
          <Link href="/admin" className="transition hover:text-white">
            Admin
          </Link>
          <Link href="/privacy" className="transition hover:text-white">
            Privacy Policy
          </Link>
          <Link href="/terms" className="transition hover:text-white">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
