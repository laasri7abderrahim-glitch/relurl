import { NextResponse } from "next/server"
import { listingSchema } from "@/MARKETPLACE/src/lib/validations"
import { prisma } from "@/MARKETPLACE/src/lib/prisma"
import { generateListingSlug } from "@/MARKETPLACE/src/lib/utils"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const pageSize = parseInt(searchParams.get("pageSize") || "20")
    const categoryId = searchParams.get("categoryId")
    const city = searchParams.get("city")
    const query = searchParams.get("q")
    const listingType = searchParams.get("listingType")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const sort = searchParams.get("sort") || "date_desc"

    const where: Record<string, unknown> = { status: "ACTIVE" }

    if (categoryId) where.categoryId = categoryId
    if (city) where.city = city
    if (listingType) where.listingType = listingType
    if (minPrice) where.price = { ...(where.price as object || {}), gte: parseFloat(minPrice) }
    if (maxPrice) where.price = { ...(where.price as object || {}), lte: parseFloat(maxPrice) }
    if (query) {
      where.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ]
    }

    const orderBy: Record<string, string> =
      sort === "price_asc" ? { price: "asc" } :
      sort === "price_desc" ? { price: "desc" } :
      sort === "date_asc" ? { createdAt: "asc" } :
      sort === "views" ? { viewsCount: "desc" } :
      { createdAt: "desc" }

    const [listings, total] = await Promise.all([
      prisma.marketplaceListing.findMany({
        where: where as any,
        include: {
          images: { take: 1, orderBy: { order: "asc" } },
          category: true,
          user: { select: { id: true, name: true, image: true } },
          _count: { select: { images: true, favorites: true } },
        },
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.marketplaceListing.count({ where: where as any }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        items: listings,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
        hasMore: page * pageSize < total,
      },
    })
  } catch (error) {
    console.error("Error fetching listings:", error)
    return NextResponse.json({ success: false, error: "Erreur lors de la récupération des annonces" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validated = listingSchema.parse(body)

    const listing = await prisma.marketplaceListing.create({
      data: {
        ...validated,
        slug: generateListingSlug(validated.title, crypto.randomUUID()),
        status: "PENDING",
        images: validated.images
          ? { create: validated.images.map((url: string, i: number) => ({ url, order: i, isPrimary: i === 0 })) }
          : undefined,
      },
      include: {
        images: true,
        category: true,
      },
    })

    return NextResponse.json({ success: true, data: listing }, { status: 201 })
  } catch (error) {
    if (error instanceof Error && "issues" in error) {
      return NextResponse.json({ success: false, error: "Données invalides", details: (error as any).issues }, { status: 400 })
    }
    console.error("Error creating listing:", error)
    return NextResponse.json({ success: false, error: "Erreur lors de la création de l'annonce" }, { status: 500 })
  }
}
