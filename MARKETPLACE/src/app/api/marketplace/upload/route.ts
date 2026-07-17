import { NextRequest, NextResponse } from "next/server"
import { uploadMultipleImages, deleteImage } from "@/MARKETPLACE/src/lib/cloudinary"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll("files") as File[]
    const folder = (formData.get("folder") as string) || "listings"
    const width = Number(formData.get("width")) || 1200
    const height = Number(formData.get("height")) || 900

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: "Aucun fichier fourni" },
        { status: 400 }
      )
    }

    if (files.length > 20) {
      return NextResponse.json(
        { success: false, error: "Maximum 20 images par envoi" },
        { status: 400 }
      )
    }

    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { success: false, error: `${file.name} dépasse 10 Mo` },
          { status: 400 }
        )
      }
    }

    const results = await uploadMultipleImages(files, { folder, width, height })

    return NextResponse.json({
      success: true,
      data: results,
      message: `${results.length} image(s) uploadée(s) avec succès`,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { success: false, error: "Erreur lors de l'upload des images" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { publicId } = await request.json()
    if (!publicId) {
      return NextResponse.json(
        { success: false, error: "publicId requis" },
        { status: 400 }
      )
    }

    await deleteImage(publicId)
    return NextResponse.json({
      success: true,
      message: "Image supprimée avec succès",
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Erreur lors de la suppression" },
      { status: 500 }
    )
  }
}