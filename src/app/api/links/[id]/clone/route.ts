import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateSlug } from "@/lib/nanoid";
import { createAuditLog } from "@/lib/audit";
import { invalidateCache } from "@/lib/cache";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ data: null, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const original = await prisma.shortLink.findUnique({ where: { id } });
    if (!original || original.userId !== session.user.id) {
      return NextResponse.json({ data: null, error: "Link not found" }, { status: 404 });
    }

    const newSlug = generateSlug();
    const existing = await prisma.shortLink.findUnique({ where: { slug: newSlug } });
    if (existing) {
      return NextResponse.json({ data: null, error: "Slug already taken" }, { status: 409 });
    }

    const cloned = await prisma.shortLink.create({
      data: {
        url: original.url,
        slug: newSlug,
        domain: original.domain,
        title: original.title,
        tags: original.tags,
        password: null,
        expiresAt: null,
        isActive: true,
        utmSource: original.utmSource,
        utmMedium: original.utmMedium,
        utmCampaign: original.utmCampaign,
        utmTerm: original.utmTerm,
        utmContent: original.utmContent,
        geoTargeting: original.geoTargeting,
        deviceTargeting: original.deviceTargeting,
        languageTargeting: original.languageTargeting,
        userId: session.user.id,
      },
    });

    createAuditLog({ userId: session.user.id, action: "CLONE", entity: "ShortLink", entityId: cloned.id });

    invalidateCache(`link:slug:${newSlug}`).catch(() => {});

    return NextResponse.json({ data: cloned, error: null }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { data: null, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
