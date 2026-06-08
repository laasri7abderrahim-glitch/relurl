import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const plan = session.metadata?.plan as string | undefined;

        if (!userId || !plan) {
          return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
        }

        const subscriptionId = session.subscription as string;
        const customerId = session.customer as string;

        if (subscriptionId) {
          const sub = await stripe.subscriptions.retrieve(subscriptionId);
          const periodStart = sub.current_period_start ? new Date(sub.current_period_start * 1000) : undefined;
          const periodEnd = sub.current_period_end ? new Date(sub.current_period_end * 1000) : undefined;

          const existingSub = await prisma.subscription.findFirst({ where: { userId } });
          if (existingSub) {
            await prisma.subscription.update({
              where: { id: existingSub.id },
              data: {
                stripeSubscriptionId: subscriptionId,
                stripeCustomerId: customerId,
                plan,
                status: "ACTIVE",
                currentPeriodStart: periodStart,
                currentPeriodEnd: periodEnd,
              },
            });
          } else {
            await prisma.subscription.create({
              data: {
                userId,
                plan,
                stripeSubscriptionId: subscriptionId,
                stripeCustomerId: customerId,
                status: "ACTIVE",
                currentPeriodStart: periodStart,
                currentPeriodEnd: periodEnd,
              },
            });
          }
        }

        await prisma.payment.create({
          data: {
            userId,
            subscriptionId: "",
            stripePaymentIntentId: session.payment_intent as string,
            amount: session.amount_total ?? 0,
            currency: session.currency ?? "usd",
            status: "SUCCEEDED",
          },
        });

        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string;

        if (subscriptionId) {
          const sub = await prisma.subscription.findFirst({
            where: { stripeSubscriptionId: subscriptionId },
          });

          if (sub) {
            await prisma.subscription.update({
              where: { id: sub.id },
              data: { status: "ACTIVE" },
            });

            await prisma.invoice.create({
              data: {
                userId: sub.userId,
                subscriptionId: sub.id,
                stripeInvoiceId: invoice.id,
                amount: invoice.amount_paid,
                currency: invoice.currency,
                status: "PAID",
                pdfUrl: invoice.invoice_pdf,
                dueDate: invoice.due_date ? new Date(invoice.due_date * 1000) : null,
                paidAt: invoice.status_transitions?.paid_at
                  ? new Date(invoice.status_transitions.paid_at * 1000)
                  : new Date(),
              },
            });
          }
        }
        break;
      }

      case "invoice.payment_failed": {
        const failedInvoice = event.data.object as Stripe.Invoice;
        const failedSubId = failedInvoice.subscription as string;

        if (failedSubId) {
          await prisma.subscription.updateMany({
            where: { stripeSubscriptionId: failedSubId },
            data: { status: "PAST_DUE" },
          });

          const sub = await prisma.subscription.findFirst({
            where: { stripeSubscriptionId: failedSubId },
          });

          if (sub) {
            await prisma.invoice.create({
              data: {
                userId: sub.userId,
                subscriptionId: sub.id,
                stripeInvoiceId: failedInvoice.id,
                amount: failedInvoice.amount_due,
                currency: failedInvoice.currency,
                status: "UNPAID",
                dueDate: failedInvoice.due_date
                  ? new Date(failedInvoice.due_date * 1000)
                  : null,
              },
            });
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        const deletedSub = event.data.object as Stripe.Subscription;

        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: deletedSub.id },
          data: { status: "CANCELED", canceledAt: new Date() },
        });
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
