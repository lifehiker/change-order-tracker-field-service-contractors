import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return new Response("Stripe not configured", { status: 200 });
  }
  try {
    const { Stripe } = await import("stripe");
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const sig = req.headers.get("stripe-signature");
    if (!sig) return NextResponse.json({ error: "No signature" }, { status: 400 });
    const body = await req.text();
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const workspaceId = session.metadata?.workspaceId;
      if (workspaceId && session.subscription) {
        await prisma.subscription.upsert({
          where: { workspaceId },
          create: {
            workspaceId,
            stripeCustomerId: String(session.customer ?? ""),
            stripeSubId: String(session.subscription),
            plan: "SMALL_TEAM",
            status: "ACTIVE",
          },
          update: {
            stripeCustomerId: String(session.customer ?? ""),
            stripeSubId: String(session.subscription),
            status: "ACTIVE",
          },
        });
      }
    }

    if (event.type === "customer.subscription.deleted") {
      const sub = event.data.object;
      await prisma.subscription.updateMany({
        where: { stripeSubId: sub.id },
        data: { status: "CANCELED" },
      });
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[stripe webhook]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
