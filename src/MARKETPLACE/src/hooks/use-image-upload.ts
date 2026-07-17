"use client"

import { useState, useCallback } from "react"

interface UploadResult {
  url: string
  publicId: string
  width: number
  height: number
  format: string
  bytes: number
}

interface UseImageUploadOptions {
  folder?: string
  maxFiles?: number
  maxSizeMb?: number
}

export function useImageUpload(options: UseImageUploadOptions = {}) {
  const { folder = "listings", maxFiles = 20, maxSizeMb = 10 } = options
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const upload = useCallback(
    async (files: File[]): Promise<UploadResult[]> => {
      setIsUploading(true)
      setError(null)
      setProgress(0)

      try {
        if (files.length > maxFiles) {
          throw new Error(`Maximum ${maxFiles} images autorisées`)
        }

        for (const file of files) {
          if (file.size > maxSizeMb * 1024 * 1024) {
            throw new Error(`${file.name} dépasse ${maxSizeMb} Mo`)
          }
        }

        const formData = new FormData()
        files.forEach((file) => formData.append("files", file))
        formData.append("folder", folder)

        const response = await fetch("/api/marketplace/upload", {
          method: "POST",
          body: formData,
        })

        const data = await response.json()

        if (!data.success) {
          throw new Error(data.error)
        }

        setProgress(100)
        return data.data
      } catch (err) {
        const message = err instanceof Error ? err.message : "Erreur d'upload"
        setError(message)
        throw err
      } finally {
        setIsUploading(false)
      }
    },
    [folder, maxFiles, maxSizeMb]
  )

  const remove = useCallback(async (publicId: string) => {
    const res = await fetch("/api/marketplace/upload", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publicId }),
    })
    return res.json()
  }, [])

  return { upload, remove, isUploading, progress, error }
}