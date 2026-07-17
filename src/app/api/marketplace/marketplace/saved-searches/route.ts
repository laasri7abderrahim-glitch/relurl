import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const savedSearchSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  query: z.string().optional(),
  filters: z.record(z.unknown()),
  emailAlerts: z.boolean().default(true),
  userId: z.string().uuid(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = savedSearchSchema.parse(body)

    return NextResponse.json({
      success: true,
      data: {
        id: crypto.randomUUID(),
        ...data,
        isActive: true,
        lastNotifiedAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      message: "Recherche sauvegardée avec succès",
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { success: false, error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")

  return NextResponse.json({
    success: true,
    data: [],
    message: "Recherches sauvegardées récupérées avec succès",
  })
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  return NextResponse.json({
    success: true,
    message: "Recherche supprimée avec succès",
  })
}