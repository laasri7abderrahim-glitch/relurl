import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPaddleCustomerPortalLink } from "@/lib/paddle";

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sub = await prisma.subscription.findFirst({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    if (!sub?.paddleCustomerId) {
      return NextResponse.json({ error: "No Paddle subscription found" }, { status: 400 });
    }

    const origin = process.env.APP_URL ?? "https://relurl.com";
    const result = await getPaddleCustomerPortalLink(sub.paddleCustomerId);
    const url = result.data.url;

    return NextResponse.json({ url });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    );
  }
}
