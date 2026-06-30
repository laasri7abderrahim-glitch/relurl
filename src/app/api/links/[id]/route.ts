import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/lib/audit";
import { invalidateCache } from "@/lib/cache";

const updateLinkSchema = z.object({
  url: z.string().url().optional(),
  slug: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[a-zA-Z0-9_-]+$/)
    .optional(),
  domain: z.string().optional(),
  title: z.string().max(200).nullable().optional(),
  tags: z.array(z.string()).optional(),
  password: z.string().min(4).nullable().optional(),
  expiresAt: z.string().datetime().nullable().optional(),
  isActive: z.boolean().optional(),
  utmSource: z.string().max(200).nullable().optional(),
  utmMedium: z.string().max(200).nullable().optional(),
  utmCampaign: z.string().max(200).nullable().optional(),
  utmTerm: z.string().max(200).nullable().optional(),
  utmContent: z.string().max(200).nullable().optional(),
  languageTargeting: z.string().nullable().optional(),
  scheduledAt: z.string().datetime().nullable().optional(),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ data: null, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const link = await prisma.shortLink.findUnique({ where: { id } });
    if (!link || link.userId !== session.user.id) {
      return NextResponse.json({ data: null, error: "Link not found" }, { status: 404 });
    }

    const clickCount = await prisma.linkClick.count({ where: { linkId: id } });

    return NextResponse.json({ data: { ...link, clickCount }, error: null });
  } catch (error) {
    return NextResponse.json(
      { data: null, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ data: null, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const link = await prisma.shortLink.findUnique({ where: { id } });
    if (!link || link.userId !== session.user.id) {
      return NextResponse.json({ data: null, error: "Link not found" }, { status: 404 });
    }

    const body = await req.json();
    const parsed = updateLinkSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { data: null, error: parsed.error.errors.map((e) => e.message).join(", ") },
        { status: 400 }
      );
    }

    const data: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(parsed.data)) {
      if (value !== undefined) {
        if (key === "expiresAt" || key === "scheduledAt") {
          data[key] = value ? new Date(value as string) : null;
        } else {
          data[key] = value;
        }
      }
    }

    if (data.slug && data.slug !== link.slug) {
      const existing = await prisma.shortLink.findUnique({
        where: { slug: data.slug as string },
      });
      if (existing) {
        return NextResponse.json({ data: null, error: "Slug already taken" }, { status: 409 });
      }
    }

    const updated = await prisma.shortLink.update({ where: { id }, data });

    invalidateCache(`link:slug:${link.slug}`).catch(() => {});
    if (data.slug && data.slug !== link.slug) {
      invalidateCache(`link:slug:${data.slug}`).catch(() => {});
    }

    createAuditLog({ userId: session.user.id, action: "UPDATE", entity: "ShortLink", entityId: id });

    return NextResponse.json({ data: updated, error: null });
  } catch (error) {
    return NextResponse.json(
      { data: null, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ data: null, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const link = await prisma.shortLink.findUnique({ where: { id } });
    if (!link || link.userId !== session.user.id) {
      return NextResponse.json({ data: null, error: "Link not found" }, { status: 404 });
    }

    await prisma.shortLink.update({
      where: { id },
      data: { isActive: false },
    });

    invalidateCache(`link:slug:${link.slug}`).catch(() => {});

    createAuditLog({ userId: session.user.id, action: "DELETE", entity: "ShortLink", entityId: id });

    return NextResponse.json({ data: { id, deleted: true }, error: null });
  } catch (error) {
    return NextResponse.json(
      { data: null, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
