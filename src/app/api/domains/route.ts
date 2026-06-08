import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const createDomainSchema = z.object({
  domain: z
    .string()
    .min(1, "Domain is required")
    .regex(
      /^(?!:\/\/)([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/,
      "Invalid domain format"
    ),
});

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ data: null, error: "Unauthorized" }, { status: 401 });
    }

    const domains = await prisma.domain.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    const domainsWithCounts = await Promise.all(
      domains.map(async (domain) => {
        const linkCount = await prisma.shortLink.count({
          where: { userId: session.user.id, domain: domain.domain },
        });
        return { ...domain, linkCount };
      })
    );

    return NextResponse.json({ data: domainsWithCounts, error: null });
  } catch (error) {
    return NextResponse.json(
      { data: null, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ data: null, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = createDomainSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { data: null, error: parsed.error.errors.map((e) => e.message).join(", ") },
        { status: 400 }
      );
    }

    const { domain } = parsed.data;

    const existing = await prisma.domain.findUnique({ where: { domain } });
    if (existing) {
      return NextResponse.json({ data: null, error: "Domain already exists" }, { status: 409 });
    }

    const created = await prisma.domain.create({
      data: {
        domain,
        userId: session.user.id,
        isVerified: false,
      },
    });

    return NextResponse.json({ data: { ...created, linkCount: 0 }, error: null }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { data: null, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
