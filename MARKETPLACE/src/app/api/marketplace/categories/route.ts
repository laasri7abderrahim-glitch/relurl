import { NextResponse } from "next/server"
import { marketplaceCategories } from "@/MARKETPLACE/src/data/categories"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const parentId = searchParams.get("parentId")

  let categories = marketplaceCategories

  if (parentId) {
    const parent = findCategory(parentId)
    categories = parent?.children || []
  }

  const formatted = categories.map((cat) => ({
    id: cat.slug,
    slug: cat.slug,
    nameFr: cat.nameFr,
    nameAr: cat.nameAr,
    descriptionFr: cat.descriptionFr || null,
    descriptionAr: cat.descriptionAr || null,
    icon: cat.icon || null,
    color: cat.color || null,
    parentId: parentId || null,
    order: cat.order,
    children: cat.children?.map((child) => ({
      id: child.slug,
      slug: child.slug,
      nameFr: child.nameFr,
      nameAr: child.nameAr,
      parentId: cat.slug,
      order: child.order,
    })) || [],
  }))

  return NextResponse.json({ success: true, data: formatted })
}

function findCategory(slug: string) {
  for (const cat of marketplaceCategories) {
    if (cat.slug === slug) return cat
    const child = cat.children?.find((c) => c.slug === slug)
    if (child) return child
  }
  return null
}
