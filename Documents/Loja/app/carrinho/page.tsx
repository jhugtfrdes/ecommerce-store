import type { Metadata } from "next";
import { CartView } from "@/components/cart-view";

export const metadata: Metadata = {
  title: "Carrinho",
  description: "Revê os produtos antes de avançar para checkout."
};

export default function CartPage() {
  return <CartView />;
}
