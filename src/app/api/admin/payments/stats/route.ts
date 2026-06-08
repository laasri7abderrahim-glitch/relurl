import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ data: null, error: "Forbidden" }, { status: 403 });
    }

    const [totalPayments, pendingPayments, failedPayments, succeededPayments, recentPayments] = await Promise.all([
      prisma.payment.count(),
      prisma.payment.count({ where: { status: "PENDING" } }),
      prisma.payment.count({ where: { status: "FAILED" } }),
      prisma.payment.findMany({
        where: { status: "SUCCEEDED" },
        select: { amount: true },
      }),
      prisma.payment.findMany({
        where: {
          status: "SUCCEEDED",
          createdAt: { gte: new Date(new Date().setMonth(new Date().getMonth() - 12)) },
        },
        select: { amount: true, createdAt: true },
      }),
    ]);

    const totalRevenue = succeededPayments.reduce((sum, p) => sum + p.amount, 0);

    const monthMap = new Map<string, number>();
    for (const p of recentPayments) {
      const key = p.createdAt.toISOString().slice(0, 7);
      monthMap.set(key, (monthMap.get(key) ?? 0) + p.amount);
    }

    const revenueByMonth = Array.from(monthMap.entries())
      .map(([month, revenue]) => ({ month, revenue }))
      .sort((a, b) => a.month.localeCompare(b.month));

    return NextResponse.json({
      data: { totalRevenue, totalPayments, pendingPayments, failedPayments, revenueByMonth },
      error: null,
    });
  } catch (error) {
    return NextResponse.json(
      { data: null, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
