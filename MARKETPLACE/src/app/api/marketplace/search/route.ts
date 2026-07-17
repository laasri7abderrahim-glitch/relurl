import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || ""
    const city = searchParams.get("city") || ""
    const category = searchParams.get("category") || ""
    const page = parseInt(searchParams.get("page") || "1")
    const pageSize = parseInt(searchParams.get("pageSize") || "20")

    const filters: string[] = []
    if (query) filters.push(`query="${query}"`)
    if (city) filters.push(`city="${city}"`)
    if (category) filters.push(`category="${category}"`)

    return NextResponse.json({
      success: true,
      data: {
        items: [],
        total: 0,
        page,
        pageSize,
        totalPages: 0,
        hasMore: false,
        query,
        filters: filters.join(", "),
      },
    })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json({ success: false, error: "Erreur de recherche" }, { status: 500 })
  }
}
