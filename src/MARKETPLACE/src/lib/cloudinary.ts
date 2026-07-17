import { v2 as cloudinary } from "cloudinary"

if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  })
}

export interface UploadResult {
  url: string
  publicId: string
  width: number
  height: number
  format: string
  bytes: number
}

export async function uploadImage(
  file: File | Buffer,
  options: {
    folder?: string
    width?: number
    height?: number
    quality?: number
  } = {}
): Promise<UploadResult> {
  const { folder = "marocmarket", width = 1200, height = 900, quality = 85 } = options

  const buffer = file instanceof File ? Buffer.from(await file.arrayBuffer()) : file

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        transformation: [
          { width, height, crop: "limit" },
          { quality, fetch_format: "auto" },
        ],
        formats: ["webp", "jpg"],
      },
      (error, result) => {
        if (error || !result) return reject(error || new Error("Upload failed"))
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes,
        })
      }
    )

    uploadStream.end(buffer)
  })
}

export async function uploadMultipleImages(
  files: File[],
  options: {
    folder?: string
    width?: number
    height?: number
    quality?: number
  } = {}
): Promise<UploadResult[]> {
  return Promise.all(files.map((file) => uploadImage(file, options)))
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId)
}

export async function deleteMultipleImages(publicIds: string[]): Promise<void> {
  await Promise.all(publicIds.map((id) => deleteImage(id)))
}

export function getOptimizedUrl(
  publicId: string,
  options: {
    width?: number
    height?: number
    quality?: number
    format?: string
  } = {}
): string {
  const { width = 800, height = 600, quality = 80, format = "auto" } = options

  return cloudinary.url(publicId, {
    transformation: [
      { width, height, crop: "fill" },
      { quality, fetch_format: format as any },
    ],
    secure: true,
  })
}

export default cloudinary