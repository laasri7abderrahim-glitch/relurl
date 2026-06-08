import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { subscription: null, linkCount: 0, clickCount: 0, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const subscription = await prisma.subscription.findFirst({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        plan: true,
        status: true,
        currentPeriodEnd: true,
        currentPeriodStart: true,
        stripeCustomerId: true,
        canceledAt: true,
      },
    });

    const linkCount = await prisma.shortLink.count({
      where: { userId: session.user.id },
    });

    const clickCount = await prisma.linkClick.count({
      where: {
        link: { userId: session.user.id },
      },
    });

    return NextResponse.json({ subscription, linkCount, clickCount, error: null });
  } catch (error) {
    return NextResponse.json(
      {
        subscription: null,
        linkCount: 0,
        clickCount: 0,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
