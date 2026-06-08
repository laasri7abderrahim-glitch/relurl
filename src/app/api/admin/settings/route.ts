import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

let currentSettings = {
  siteName: "RELURL",
  siteDescription: "URL Shortener",
  allowRegistration: true,
  defaultPlan: "FREE",
  maxLinksPerUser: { FREE: 50, PRO: 1000, BUSINESS: 10000, ENTERPRISE: -1 },
  maintenanceMode: false,
};

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ data: null, error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ data: currentSettings, error: null });
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
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ data: null, error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    currentSettings = { ...currentSettings, ...body };

    return NextResponse.json({ data: currentSettings, error: null });
  } catch (error) {
    return NextResponse.json(
      { data: null, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
