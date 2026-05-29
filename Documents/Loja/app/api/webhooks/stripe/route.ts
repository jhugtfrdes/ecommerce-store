import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: Request) {
  if (!stripeSecretKey || !webhookSecret) {
    return NextResponse.json({ error: "Stripe webhook não configurado." }, { status: 500 });
  }

  const payload = await request.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Assinatura Stripe ausente." }, { status: 400 });
  }

  const stripe = new Stripe(stripeSecretKey);

  try {
    const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      console.log("Checkout concluído:", session.id);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook inválido.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
