import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { password } = await req.json();

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { success: false, error: "Password is required" },
        { status: 400 }
      );
    }

    const link = await prisma.shortLink.findUnique({ where: { slug } });

    if (!link || !link.isActive) {
      return NextResponse.json(
        { success: false, error: "Link not found" },
        { status: 404 }
      );
    }

    if (!link.password) {
      return NextResponse.json(
        { success: false, error: "This link is not password protected" },
        { status: 404 }
      );
    }

    const isValid = await compare(password, link.password).catch(() => false)
    const isPlaintext = !isValid && link.password === password

    if (!isValid && !isPlaintext) {
      return NextResponse.json(
        { success: false, error: "Invalid password" },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true, url: link.url });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
