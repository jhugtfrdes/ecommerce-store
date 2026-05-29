import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getProducts } from "@/lib/catalog";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

type CheckoutRequestItem = {
  id: string;
  quantity: number;
};

export async function POST(request: Request) {
  if (!stripeSecretKey) {
    return NextResponse.json({ error: "STRIPE_SECRET_KEY não está configurada." }, { status: 500 });
  }

  const body = (await request.json()) as { items?: CheckoutRequestItem[] };

  if (!body.items?.length) {
    return NextResponse.json({ error: "O carrinho está vazio." }, { status: 400 });
  }

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  const products = await getProducts();

  for (const item of body.items) {
    const product = products.find((candidate) => candidate.id === item.id);
    const quantity = Number(item.quantity);

    if (!product || !Number.isInteger(quantity) || quantity < 1) {
      return NextResponse.json({ error: "Produto ou quantidade inválida." }, { status: 400 });
    }

    if (product.stripePriceId && !product.stripePriceId.includes("replace")) {
      lineItems.push({
        price: product.stripePriceId,
        quantity
      });
      continue;
    }

    lineItems.push({
      quantity,
      price_data: {
        currency: "eur",
        unit_amount: product.price,
        product_data: {
          name: product.name,
          description: product.shortDescription,
          images: [product.images[0]],
          metadata: {
            productId: product.id,
            slug: product.slug
          }
        }
      }
    });
  }

  const stripe = new Stripe(stripeSecretKey);
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    success_url: `${siteUrl}/checkout/sucesso?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/checkout/cancelado`,
    billing_address_collection: "auto",
    shipping_address_collection: {
      allowed_countries: ["PT", "ES", "FR", "DE", "IT", "NL", "BE", "US"]
    },
    metadata: {
      source: "noir-atelier"
    }
  });

  return NextResponse.json({ url: session.url });
}
