"use client"

import { useEffect, useRef, useState } from "react"
import QRCodeLib from "qrcode"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface QRCodeProps {
  value: string
  size?: number
  className?: string
  bgColor?: string
  fgColor?: string
  showLoader?: boolean
}

function QRCode({
  value,
  size = 200,
  className,
  bgColor = "#ffffff",
  fgColor = "#0b1120",
  showLoader = true,
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

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-xl bg-white",
        className
      )}
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
    </div>
  )
}

export { QRCode }
