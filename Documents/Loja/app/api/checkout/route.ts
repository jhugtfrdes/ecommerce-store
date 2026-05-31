import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getProducts } from "@/lib/catalog";
import { getCurrentSession } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

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
  const selectedProducts: Array<{ id: string; quantity: number; price: number; name: string; slug: string }> = [];

  if (!products.length) {
    return NextResponse.json({ error: "Catálogo indisponível. Verifica a configuração Supabase." }, { status: 503 });
  }

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
      selectedProducts.push({ id: product.id, quantity, price: product.price, name: product.name, slug: product.slug });
      continue;
    }

    selectedProducts.push({ id: product.id, quantity, price: product.price, name: product.name, slug: product.slug });
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

  const total = selectedProducts.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const orderId = await createPendingOrder(selectedProducts, total);
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
      source: "noir-atelier",
      orderId: orderId ?? ""
    }
  });

  return NextResponse.json({ url: session.url });
}

async function createPendingOrder(
  items: Array<{ id: string; quantity: number; price: number; name: string; slug: string }>,
  total: number
) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return null;
  }

  const session = await getCurrentSession();
  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      user_id: session?.sub ?? null,
      email: session?.email ?? null,
      status: "pending",
      total,
      currency: "eur"
    })
    .select("id")
    .single();

  if (error || !order) {
    console.error("Order creation failed:", error?.message);
    return null;
  }

  const { error: itemsError } = await supabase.from("order_items").insert(
    items.map((item) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      unit_price: item.price,
      product_snapshot: {
        name: item.name,
        slug: item.slug
      }
    }))
  );

  if (itemsError) {
    console.error("Order items creation failed:", itemsError.message);
  }

  return order.id as string;
}
