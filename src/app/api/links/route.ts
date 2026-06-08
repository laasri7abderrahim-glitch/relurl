import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateSlug } from "@/lib/nanoid";
import { createAuditLog } from "@/lib/audit";
import { checkLinkLimit, getUpgradeMessage } from "@/lib/plans";

const createLinkSchema = z.object({
  url: z.string().url("Invalid URL"),
  slug: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[a-zA-Z0-9_-]+$/, "Slug must be alphanumeric, hyphens, or underscores")
    .optional(),
  domain: z.string().optional(),
  title: z.string().max(200).optional(),
  tags: z.array(z.string()).optional(),
  password: z.string().min(4).optional(),
  expiresAt: z.string().datetime().optional(),
  utmSource: z.string().max(200).optional(),
  utmMedium: z.string().max(200).optional(),
  utmCampaign: z.string().max(200).optional(),
  utmTerm: z.string().max(200).optional(),
  utmContent: z.string().max(200).optional(),
  languageTargeting: z.string().optional(),
  scheduledAt: z.string().datetime().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ data: null, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20")));
    const search = searchParams.get("search") ?? "";
    const domain = searchParams.get("domain");
    const isActive = searchParams.get("isActive");

    const where: Record<string, unknown> = { userId: session.user.id };
    if (search) {
      where.OR = [
        { url: { contains: search, mode: "insensitive" as const } },
        { slug: { contains: search, mode: "insensitive" as const } },
        { title: { contains: search, mode: "insensitive" as const } },
      ];
    }
    if (domain) where.domain = domain;
    if (isActive !== null) where.isActive = isActive === "true";

    const [links, total] = await Promise.all([
      prisma.shortLink.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.shortLink.count({ where }),
    ]);

    return NextResponse.json({ data: { links, total, page, limit }, error: null });
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

    const linkCheck = await checkLinkLimit(session.user.id);
    if (!linkCheck.allowed) {
      return NextResponse.json(
        {
          data: null,
          error: getUpgradeMessage(linkCheck.plan, "links"),
          upgradeRequired: true,
          current: linkCheck.current,
          max: linkCheck.max,
          plan: linkCheck.plan,
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const parsed = createLinkSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { data: null, error: parsed.error.errors.map((e) => e.message).join(", ") },
        { status: 400 }
      );
    }

    const {
      url,
      slug,
      domain,
      title,
      tags,
      password,
      expiresAt,
      utmSource,
      utmMedium,
      utmCampaign,
      utmTerm,
      utmContent,
      languageTargeting,
      scheduledAt,
    } = parsed.data;

    const finalSlug = slug ?? generateSlug();

    const existing = await prisma.shortLink.findUnique({ where: { slug: finalSlug } });
    if (existing) {
      return NextResponse.json({ data: null, error: "Slug already taken" }, { status: 409 });
    }

    const link = await prisma.shortLink.create({
      data: {
        url,
        slug: finalSlug,
        domain: domain ?? "relurl.com",
        title,
        tags: tags ? JSON.stringify(tags) : null,
        password,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        utmSource,
        utmMedium,
        utmCampaign,
        utmTerm,
        utmContent,
        languageTargeting: languageTargeting || null,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        isActive: scheduledAt ? new Date(scheduledAt) <= new Date() : true,
        userId: session.user.id,
      },
    });

    createAuditLog({ userId: session.user.id, action: "CREATE", entity: "ShortLink", entityId: link.id });

    return NextResponse.json({ data: link, error: null }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { data: null, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
