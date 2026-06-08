import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createHash } from "crypto";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateApiKey } from "@/lib/nanoid";

const createKeySchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
});

const updateKeySchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
});

function hashKey(key: string): string {
  return createHash("sha256").update(key).digest("hex");
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ data: null, error: "Unauthorized" }, { status: 401 });
    }

    const keys = await prisma.apiKey.findMany({
      where: { userId: session.user.id },
      select: { id: true, name: true, isActive: true, lastUsedAt: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: keys, error: null });
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
    const parsed = createKeySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { data: null, error: parsed.error.errors.map((e) => e.message).join(", ") },
        { status: 400 }
      );
    }

    const rawKey = generateApiKey();
    const hashed = hashKey(rawKey);

    const apiKey = await prisma.apiKey.create({
      data: {
        name: parsed.data.name,
        key: hashed,
        userId: session.user.id,
      },
    });

    return NextResponse.json(
      {
        data: {
          id: apiKey.id,
          name: apiKey.name,
          key: rawKey,
          createdAt: apiKey.createdAt,
        },
        error: null,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { data: null, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ data: null, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ data: null, error: "API key ID is required" }, { status: 400 });
    }

    const body = await req.json();
    const parsed = updateKeySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { data: null, error: parsed.error.errors.map((e) => e.message).join(", ") },
        { status: 400 }
      );
    }

    const key = await prisma.apiKey.findFirst({
      where: { id, userId: session.user.id },
    });
    if (!key) {
      return NextResponse.json({ data: null, error: "API key not found" }, { status: 404 });
    }

    const updated = await prisma.apiKey.update({
      where: { id },
      data: { name: parsed.data.name },
      select: { id: true, name: true, isActive: true, lastUsedAt: true, createdAt: true },
    });

    return NextResponse.json({ data: updated, error: null });
  } catch (error) {
    return NextResponse.json(
      { data: null, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ data: null, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ data: null, error: "API key ID is required" }, { status: 400 });
    }

    const key = await prisma.apiKey.findFirst({
      where: { id, userId: session.user.id },
    });
    if (!key) {
      return NextResponse.json({ data: null, error: "API key not found" }, { status: 404 });
    }

    await prisma.apiKey.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({ data: { id, revoked: true }, error: null });
  } catch (error) {
    return NextResponse.json(
      { data: null, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
