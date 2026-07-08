import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ invoices: [], error: "Unauthorized" }, { status: 401 });
    }

    const invoices = await prisma.invoice.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        amount: true,
        currency: true,
        status: true,
        pdfUrl: true,
        paidAt: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ invoices, error: null });
  } catch (error) {
    return NextResponse.json(
      { invoices: [], error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
