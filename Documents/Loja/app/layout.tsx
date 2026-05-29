import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { CartProvider } from "@/components/cart-provider";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Noir Atelier | Loja premium",
    template: "%s | Noir Atelier"
  },
  description:
    "Loja ecommerce premium com produtos selecionados, checkout Stripe e experiência mobile first.",
  keywords: ["ecommerce", "loja premium", "Next.js", "Stripe", "produtos tech"],
  openGraph: {
    title: "Noir Atelier",
    description: "Tecnologia e acessórios premium com uma experiência de compra rápida.",
    url: siteUrl,
    siteName: "Noir Atelier",
    locale: "pt_PT",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Noir Atelier",
    description: "Uma loja premium dark, rápida e preparada para vender."
  },
  robots: {
    index: true,
    follow: true
  }
};

export const viewport: Viewport = {
  themeColor: "#07080A",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-PT" className={geistSans.variable}>
      <body>
        <CartProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
