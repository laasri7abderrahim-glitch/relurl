import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      stats: {
        totalListings: 0,
        activeListings: 0,
        pendingListings: 0,
        rejectedListings: 0,
        totalUsers: 0,
        totalViews: 0,
      },
      recentListings: [],
    },
  })
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    return NextResponse.json({ success: true, data: body })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Erreur" }, { status: 500 })
  }
}
