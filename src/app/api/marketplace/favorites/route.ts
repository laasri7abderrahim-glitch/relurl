import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({ success: true, data: [] })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    return NextResponse.json({ success: true, data: body }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Erreur lors de l'ajout aux favoris" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    return NextResponse.json({ success: true, message: "Favori supprimé" })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Erreur lors de la suppression du favori" }, { status: 500 })
  }
}
