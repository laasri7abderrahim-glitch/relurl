"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import QRCodeLib from "qrcode"
import { cn } from "@/lib/utils"
import { Loader2, Download, Image as ImageIcon } from "lucide-react"

const SIZE_OPTIONS = [
  { label: "Small", value: 128 },
  { label: "Medium", value: 200 },
  { label: "Large", value: 300 },
] as const

const FORMAT_OPTIONS = ["png", "svg"] as const

interface QRCodeProps {
  value: string
  size?: number
  className?: string
  bgColor?: string
  fgColor?: string
  showLoader?: boolean
  logo?: string | null
  format?: "png" | "svg"
}

function QRCode({
  value,
  size = 200,
  className,
  bgColor = "#ffffff",
  fgColor = "#0b1120",
  showLoader = true,
  logo = null,
  format = "png",
}: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!canvasRef.current || !value) return
    setLoading(true)
    setError(false)

    QRCodeLib.toCanvas(
      canvasRef.current,
      value,
      {
        width: size,
        margin: 2,
        color: { dark: fgColor, light: bgColor },
      },
      (err) => {
        if (err) {
          setError(true)
        }
        setLoading(false)
      }
    )
  }, [value, size, bgColor, fgColor])

  const handleDownload = useCallback(async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    if (format === "svg") {
      return
    }

    const link = document.createElement("a")
    link.download = `qrcode-${Date.now()}.png`
    link.href = canvas.toDataURL("image/png")
    link.click()
  }, [format])

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div
        className="relative flex items-center justify-center overflow-hidden rounded-xl bg-white"
        style={{ width: size, height: size }}
      >
        {loading && showLoader && (
          <Loader2 className="h-6 w-6 animate-spin text-dark-700" />
        )}
        {error && (
          <p className="text-xs text-red-500">Failed to generate QR code</p>
        )}
        <canvas
          ref={canvasRef}
          className={cn("", (loading || error) && "hidden")}
        />
        {logo && !loading && !error && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="h-8 w-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm">
              <ImageIcon className="h-5 w-5 text-dark-700" />
            </div>
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={handleDownload}
        disabled={loading || error || format === "svg"}
        className="inline-flex items-center gap-2 rounded-lg border border-dark-100 bg-dark-500 px-4 py-2 text-sm text-dark-50 hover:bg-dark-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Download className="h-4 w-4" />
        Download {format.toUpperCase()}
      </button>
    </div>
  )
}

export { QRCode, SIZE_OPTIONS, FORMAT_OPTIONS }
