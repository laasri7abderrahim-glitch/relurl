import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({ success: true, data: [] })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    return NextResponse.json({ success: true, data: body }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Erreur lors de l'ajout de l'avis" }, { status: 500 })
  }
}
