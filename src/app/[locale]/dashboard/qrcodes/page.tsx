"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { QRCode } from "@/components/ui/qr-code"
import { QRCodeSettings } from "@/components/ui/qr-code-settings"
import { useToast } from "@/components/ui/toast"
import { SectionHeader } from "@/components/ui/section-header"
import { QrCode as QrCodeIcon, Download, Copy, Check, Link2 } from "lucide-react"

interface QRType {
  id: string
  name: string
  description: string
  fields: Array<{
    key: string
    label: string
    type: string
    required: boolean
    options?: string[]
  }>
}

function generateQRContent(type: string, data: Record<string, string>): string {
  switch (type) {
    case "url":
      return data.url || ""
    case "vcard": {
      const parts = ["BEGIN:VCARD", "VERSION:3.0"]
      if (data.firstName) parts.push(`FN:${data.firstName}${data.lastName ? " " + data.lastName : ""}`)
      if (data.firstName) parts.push(`N:${data.lastName || ""};${data.firstName};;;`)
      if (data.organization) parts.push(`ORG:${data.organization}`)
      if (data.title) parts.push(`TITLE:${data.title}`)
      if (data.phone) parts.push(`TEL:${data.phone}`)
      if (data.email) parts.push(`EMAIL:${data.email}`)
      if (data.website) parts.push(`URL:${data.website}`)
      if (data.address) parts.push(`ADR:;;${data.address}`)
      parts.push("END:VCARD")
      return parts.join("\n")
    }
    case "wifi": {
      const enc = data.encryption || "WPA"
      const hidden = data.hidden === "true" ? "H:true" : ""
      const pass = data.password ? `P:${data.password}` : ""
      return `WIFI:T:${enc};S:${data.ssid};${pass};${hidden};`
    }
    case "text":
      return data.text || ""
    case "email": {
      const params = new URLSearchParams()
      if (data.subject) params.set("subject", data.subject)
      if (data.body) params.set("body", data.body)
      const qs = params.toString()
      return `mailto:${data.to}${qs ? "?" + qs : ""}`
    }
    case "sms": {
      const msg = data.message ? `?body=${encodeURIComponent(data.message)}` : ""
      return `sms:${data.phone}${msg}`
    }
    default:
      return ""
  }
}

const SIZE_OPTIONS = [
  { label: "Small", value: 128 },
  { label: "Medium", value: 200 },
  { label: "Large", value: 300 },
]

export default function QRCodesPage() {
  const [types, setTypes] = useState<QRType[]>([])
  const [selectedType, setSelectedType] = useState("url")
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [activeTab, setActiveTab] = useState<"create" | "design">("create")
  const [qrValue, setQrValue] = useState("")
  const [copied, setCopied] = useState(false)

  // Design settings
  const [fgColor, setFgColor] = useState("#0b1120")
  const [bgColor, setBgColor] = useState("#ffffff")
  const [size, setSize] = useState(200)

  const { addToast } = useToast()

  useEffect(() => {
    fetch("/api/qrcodes/types").then((r) => r.json()).then((json) => {
      setTypes(json.types || [])
    }).catch(() => {})
  }, [])

  useEffect(() => {
    const currentType = types.find((t) => t.id === selectedType)
    if (currentType) {
      const defaults: Record<string, string> = {}
      currentType.fields.forEach((f) => { defaults[f.key] = "" })
      setFormData(defaults)
    }
  }, [selectedType, types])

  useEffect(() => {
    const currentType = types.find((t) => t.id === selectedType)
    if (!currentType) { setQrValue(""); return }
    const hasRequired = currentType.fields.filter((f) => f.required).every((f) => formData[f.key]?.trim())
    if (!hasRequired) { setQrValue(""); return }
    setQrValue(generateQRContent(selectedType, formData))
  }, [selectedType, formData, types])

  const updateField = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const handleDownload = async (format: "png" | "svg") => {
    if (!qrValue) return
    const typeName = types.find((t) => t.id === selectedType)?.name || "qrcode"
    try {
      const QRCodeLib = await import("qrcode")
      const canvas = document.createElement("canvas")
      await QRCodeLib.default.toCanvas(canvas, qrValue, {
        width: size,
        margin: 2,
        color: { dark: fgColor, light: bgColor },
      })
      const link = document.createElement("a")
      link.download = `${typeName.toLowerCase()}-${Date.now()}.png`
      link.href = canvas.toDataURL("image/png")
      link.click()
      addToast("QR code downloaded", "success")
    } catch {
      addToast("Failed to generate QR code", "error")
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(qrValue)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    addToast("QR code content copied", "success")
  }

  const currentType = types.find((t) => t.id === selectedType)

  return (
    <div className="space-y-6">
      <SectionHeader
        title="QR Code Generator"
        description="Create QR codes for URLs, vCards, WiFi, and more"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-dark-100">
          <CardHeader>
            <CardTitle className="text-lg">Content</CardTitle>
            <CardDescription>Choose the type of QR code to create.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Type</Label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full rounded-lg border border-dark-100 bg-dark-500 px-3 py-2 text-sm text-dark-50"
              >
                {types.map((t) => (
                  <option key={t.id} value={t.id}>{t.name} — {t.description}</option>
                ))}
              </select>
            </div>

            {currentType?.fields.map((field) => (
              <div key={field.key}>
                <Label>
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                {field.type === "textarea" ? (
                  <Textarea
                    value={formData[field.key] || ""}
                    onChange={(e) => updateField(field.key, e.target.value)}
                    placeholder={`Enter ${field.label.toLowerCase()}...`}
                    rows={3}
                  />
                ) : field.type === "select" ? (
                  <select
                    value={formData[field.key] || ""}
                    onChange={(e) => updateField(field.key, e.target.value)}
                    className="w-full rounded-lg border border-dark-100 bg-dark-500 px-3 py-2 text-sm text-dark-50 mt-1"
                  >
                    {field.options?.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : field.type === "boolean" ? (
                  <div className="flex gap-2 mt-1">
                    <button
                      type="button"
                      onClick={() => updateField(field.key, "true")}
                      className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                        formData[field.key] === "true"
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-dark-100 text-dark-100"
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => updateField(field.key, "false")}
                      className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                        formData[field.key] === "false"
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-dark-100 text-dark-100"
                      }`}
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <Input
                    type={field.type}
                    value={formData[field.key] || ""}
                    onChange={(e) => updateField(field.key, e.target.value)}
                    placeholder={`Enter ${field.label.toLowerCase()}...`}
                  />
                )}
              </div>
            ))}

            {qrValue && (
              <div className="flex items-center gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  {copied ? <Check className="mr-1 h-4 w-4" /> : <Copy className="mr-1 h-4 w-4" />}
                  {copied ? "Copied" : "Copy Content"}
                </Button>
                <Button size="sm" onClick={() => handleDownload("png")}>
                  <Download className="mr-1 h-4 w-4" /> Download PNG
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="border-dark-100">
            <CardHeader>
              <CardTitle className="text-lg">Preview</CardTitle>
              <CardDescription>Your QR code will appear here.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              {qrValue ? (
                <QRCode
                  value={qrValue}
                  size={size}
                  fgColor={fgColor}
                  bgColor={bgColor}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px] text-dark-100">
                  <QrCodeIcon className="w-12 h-12 mb-3 opacity-30" />
                  <p className="text-sm">Fill in the required fields to generate your QR code</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-dark-100">
            <CardHeader>
              <CardTitle className="text-lg">Design</CardTitle>
              <CardDescription>Customize colors and size.</CardDescription>
            </CardHeader>
            <CardContent>
              <QRCodeSettings
                fgColor={fgColor}
                bgColor={bgColor}
                size={size}
                onFgColorChange={setFgColor}
                onBgColorChange={setBgColor}
                onSizeChange={setSize}
                onPresetSelect={(preset) => { setFgColor(preset.fg); setBgColor(preset.bg) }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
