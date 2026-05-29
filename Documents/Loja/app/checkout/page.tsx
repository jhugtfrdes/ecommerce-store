import type { Metadata } from "next";
import { CheckoutView } from "@/components/checkout-view";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Finaliza a tua encomenda com pagamento seguro por Stripe."
};

export default function CheckoutPage() {
  return <CheckoutView />;
}
