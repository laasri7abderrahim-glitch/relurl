import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const updateRoleSchema = z.object({
  role: z.enum(["ADMIN", "MEMBER"]),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; memberId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ data: null, error: "Unauthorized" }, { status: 401 });
    }

    const { id, memberId } = await params;

    const team = await prisma.team.findUnique({
      where: { id },
      include: {
        teamMembers: {
          where: { userId: session.user.id },
        },
      },
    });

    if (!team) {
      return NextResponse.json({ data: null, error: "Team not found" }, { status: 404 });
    }

    const currentMembership = team.teamMembers[0];
    if (!currentMembership || currentMembership.role !== "OWNER") {
      return NextResponse.json(
        { data: null, error: "Only the owner can change roles" },
        { status: 403 }
      );
    }

    const targetMember = await prisma.teamMember.findUnique({ where: { id: memberId } });
    if (!targetMember || targetMember.teamId !== id) {
      return NextResponse.json({ data: null, error: "Member not found" }, { status: 404 });
    }

    if (targetMember.role === "OWNER") {
      return NextResponse.json(
        { data: null, error: "Cannot change the owner's role" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const parsed = updateRoleSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { data: null, error: parsed.error.errors.map((e) => e.message).join(", ") },
        { status: 400 }
      );
    }

    const updated = await prisma.teamMember.update({
      where: { id: memberId },
      data: { role: parsed.data.role },
      include: {
        user: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
    });

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
  { params }: { params: Promise<{ id: string; memberId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ data: null, error: "Unauthorized" }, { status: 401 });
    }

    const { id, memberId } = await params;

    const team = await prisma.team.findUnique({
      where: { id },
      include: {
        teamMembers: {
          where: { userId: session.user.id },
        },
      },
    });

    if (!team) {
      return NextResponse.json({ data: null, error: "Team not found" }, { status: 404 });
    }

    const currentMembership = team.teamMembers[0];
    if (!currentMembership || currentMembership.role !== "OWNER") {
      return NextResponse.json(
        { data: null, error: "Only the owner can remove members" },
        { status: 403 }
      );
    }

    const targetMember = await prisma.teamMember.findUnique({ where: { id: memberId } });
    if (!targetMember || targetMember.teamId !== id) {
      return NextResponse.json({ data: null, error: "Member not found" }, { status: 404 });
    }

    if (targetMember.role === "OWNER") {
      return NextResponse.json(
        { data: null, error: "Cannot remove the owner" },
        { status: 400 }
      );
    }

    if (targetMember.userId === session.user.id) {
      return NextResponse.json(
        { data: null, error: "Cannot remove yourself. Use leave team instead." },
        { status: 400 }
      );
    }

    await prisma.teamMember.delete({ where: { id: memberId } });

    return NextResponse.json({ data: null, error: null });
  } catch (error) {
    return NextResponse.json(
      { data: null, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
