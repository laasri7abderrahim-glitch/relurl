"use client"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

const DESIGN_PRESETS = [
  { name: "Classic Black", fg: "#0b1120", bg: "#ffffff" },
  { name: "Brand Indigo", fg: "#4f46e5", bg: "#ffffff" },
  { name: "Ocean Teal", fg: "#0d9488", bg: "#ffffff" },
  { name: "Midnight Purple", fg: "#7c3aed", bg: "#ffffff" },
  { name: "Sunset Orange", fg: "#ea580c", bg: "#ffffff" },
]

const SIZE_OPTIONS = [
  { label: "Small", value: 128 },
  { label: "Medium", value: 200 },
  { label: "Large", value: 300 },
]

interface QRCodeSettingsProps {
  fgColor: string
  bgColor: string
  size: number
  onFgColorChange: (color: string) => void
  onBgColorChange: (color: string) => void
  onSizeChange: (size: number) => void
  onPresetSelect: (preset: { fg: string; bg: string; name: string }) => void
}

function QRCodeSettings({
  fgColor,
  bgColor,
  size,
  onFgColorChange,
  onBgColorChange,
  onSizeChange,
  onPresetSelect,
}: QRCodeSettingsProps) {
  return (
    <div className="space-y-5">
      <div>
        <Label className="mb-2 block">Design Presets</Label>
        <div className="flex flex-wrap gap-2">
          {DESIGN_PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => onPresetSelect(preset)}
              title={preset.name}
              className={cn(
                "group relative h-8 w-8 rounded-full border-2 transition-all hover:scale-110",
                fgColor === preset.fg && bgColor === preset.bg
                  ? "border-dark-50 ring-2 ring-primary-500/50"
                  : "border-dark-100"
              )}
              style={{ backgroundColor: preset.fg }}
            >
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] text-dark-100 opacity-0 group-hover:opacity-100 transition-opacity">
                {preset.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Foreground</Label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={fgColor}
              onChange={(e) => onFgColorChange(e.target.value)}
              className="h-8 w-8 cursor-pointer rounded border border-dark-100 bg-transparent p-0.5"
            />
            <span className="text-xs text-dark-100 font-mono">{fgColor}</span>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Background</Label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={bgColor}
              onChange={(e) => onBgColorChange(e.target.value)}
              className="h-8 w-8 cursor-pointer rounded border border-dark-100 bg-transparent p-0.5"
            />
            <span className="text-xs text-dark-100 font-mono">{bgColor}</span>
          </div>
        </div>
      </div>

      <div>
        <Label className="mb-2 block">Size</Label>
        <div className="flex gap-2">
          {SIZE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onSizeChange(opt.value)}
              className={cn(
                "flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                size === opt.value
                  ? "border-primary-500 bg-primary-500/10 text-primary-500"
                  : "border-dark-100 text-dark-100 hover:border-dark-50 hover:text-dark-50"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export { QRCodeSettings }
