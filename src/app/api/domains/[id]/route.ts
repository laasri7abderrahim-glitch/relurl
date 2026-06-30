import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import * as dns from "dns/promises";

async function verifyDomain(domain: string, expectedToken: string): Promise<boolean> {
  try {
    const records = await dns.resolveTxt(domain);
    const txts = records.flat();
    return txts.some(txt => txt.includes(expectedToken));
  } catch {
    return false;
  }
}

const updateDomainSchema = z.object({
  isVerified: z.boolean().optional(),
  verificationMethod: z.string().max(100).nullable().optional(),
  action: z.literal("verify").optional(),
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

    const domain = await prisma.domain.findUnique({ where: { id } });
    if (!domain || domain.userId !== session.user.id) {
      return NextResponse.json({ data: null, error: "Domain not found" }, { status: 404 });
    }

    const linkCount = await prisma.shortLink.count({
      where: { userId: session.user.id, domain: domain.domain },
    });

    return NextResponse.json({ data: { ...domain, linkCount }, error: null });
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

    const domain = await prisma.domain.findUnique({ where: { id } });
    if (!domain || domain.userId !== session.user.id) {
      return NextResponse.json({ data: null, error: "Domain not found" }, { status: 404 });
    }

    const body = await req.json();
    const parsed = updateDomainSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { data: null, error: parsed.error.errors.map((e) => e.message).join(", ") },
        { status: 400 }
      );
    }

    if (parsed.data.action === "verify") {
      const expectedToken = `relurl-verification=${id}`;
      const isVerified = await verifyDomain(domain.domain, expectedToken);
      if (!isVerified) {
        return NextResponse.json(
          {
            data: null,
            error: `DNS verification failed. Add a TXT record with value "${expectedToken}" to the domain "${domain.domain}" and try again.`,
          },
          { status: 400 }
        );
      }
      const updated = await prisma.domain.update({
        where: { id },
        data: { isVerified: true, verificationMethod: "dns_txt" },
      });
      return NextResponse.json({ data: updated, error: null });
    }

    const data: Record<string, unknown> = {};
    if (parsed.data.isVerified !== undefined) data.isVerified = parsed.data.isVerified;
    if (parsed.data.verificationMethod !== undefined) data.verificationMethod = parsed.data.verificationMethod;

    const updated = await prisma.domain.update({ where: { id }, data });

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

    const domain = await prisma.domain.findUnique({ where: { id } });
    if (!domain || domain.userId !== session.user.id) {
      return NextResponse.json({ data: null, error: "Domain not found" }, { status: 404 });
    }

    const activeLinks = await prisma.shortLink.count({
      where: { userId: session.user.id, domain: domain.domain, isActive: true },
    });
    if (activeLinks > 0) {
      return NextResponse.json(
        { data: null, error: "Cannot delete domain with active links. Remove or reassign links first." },
        { status: 409 }
      );
    }

    await prisma.domain.delete({ where: { id } });

    return NextResponse.json({ data: { id, deleted: true }, error: null });
  } catch (error) {
    return NextResponse.json(
      { data: null, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
