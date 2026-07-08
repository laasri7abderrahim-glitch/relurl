import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createHmac, timingSafeEqual } from "crypto";

function verifyPaddleWebhook(rawBody: string, signatureHeader: string | null): boolean {
  if (!signatureHeader) return false;
  const webhookSecret = process.env.PADDLE_WEBHOOK_SECRET;
  if (!webhookSecret) return false;

  const parts = signatureHeader.split(";");
  let ts = "";
  let h1 = "";
  for (const part of parts) {
    const [key, value] = part.split("=");
    if (key === "ts") ts = value;
    if (key === "h1") h1 = value;
  }
  if (!ts || !h1) return false;

  const signedPayload = `${ts}:${rawBody}`;
  const expected = createHmac("sha256", webhookSecret)
    .update(signedPayload)
    .digest("hex");

  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(h1));
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("paddle-signature");

    if (!verifyPaddleWebhook(rawBody, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(rawBody);
    const eventType = event.event_type;

    switch (eventType) {
      case "subscription.created":
      case "subscription.updated": {
        const subData = event.data;
        const userId = subData.custom_data?.userId;
        const plan = subData.custom_data?.plan ?? subData.items?.[0]?.price?.name;
        const subscriptionId = subData.id;
        const customerId = subData.customer_id;
        const status = subData.status === "active" ? "ACTIVE" : subData.status === "canceled" ? "CANCELED" : "PAST_DUE";
        const periodStart = subData.current_billing_period?.starts_at
          ? new Date(subData.current_billing_period.starts_at)
          : undefined;
        const periodEnd = subData.current_billing_period?.ends_at
          ? new Date(subData.current_billing_period.ends_at)
          : undefined;

        if (userId) {
          const existingSub = await prisma.subscription.findFirst({
            where: { userId },
          });

          const data = {
            plan: (plan as string) ?? "PRO",
            status,
            gateway: "PADDLE" as const,
            paddleSubscriptionId: subscriptionId,
            paddleCustomerId: customerId,
            currentPeriodStart: periodStart,
            currentPeriodEnd: periodEnd,
          };

          if (existingSub) {
            await prisma.subscription.update({ where: { id: existingSub.id }, data });
          } else {
            await prisma.subscription.create({
              data: { userId, ...data },
            });
          }
        }

        break;
      }

      case "subscription.cancelled": {
        const subData = event.data;
        await prisma.subscription.updateMany({
          where: { paddleSubscriptionId: subData.id },
          data: { status: "CANCELED", canceledAt: new Date() },
        });
        break;
      }

      case "transaction.completed": {
        const txData = event.data;
        const userId = txData.custom_data?.userId;
        const subscriptionId = txData.subscription_id;
        const customerId = txData.customer_id;
        const amount = txData.details?.totals?.total
          ? Math.round(parseFloat(txData.details.totals.total) / 100)
          : 0;
        const currency = txData.currency_code ?? "usd";

        const sub = await prisma.subscription.findFirst({
          where: { paddleSubscriptionId: subscriptionId },
        });

        if (sub && userId) {
          await prisma.payment.create({
            data: {
              userId,
              subscriptionId: sub.id,
              paddleTransactionId: txData.id,
              amount,
              currency,
              status: "SUCCEEDED",
            },
          });

          await prisma.invoice.create({
            data: {
              userId,
              subscriptionId: sub.id,
              paddleInvoiceId: txData.id,
              amount,
              currency,
              status: "PAID",
              paidAt: new Date(),
            },
          });
        }
        break;
      }

      case "transaction.payment_failed": {
        const txData = event.data;
        const subscriptionId = txData.subscription_id;

        if (subscriptionId) {
          await prisma.subscription.updateMany({
            where: { paddleSubscriptionId: subscriptionId },
            data: { status: "PAST_DUE" },
          });
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    );
  }
}
