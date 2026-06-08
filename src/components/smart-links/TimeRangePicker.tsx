"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, X, Clock } from "lucide-react"

export interface TimeRange {
  start: string
  end: string
  days: number[]
}

interface TimeRangePickerProps {
  value: TimeRange[]
  onChange: (ranges: TimeRange[]) => void
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6]
const WEEKDAYS = [1, 2, 3, 4, 5]
const WEEKENDS = [0, 6]

export function TimeRangePicker({ value, onChange }: TimeRangePickerProps) {
  const [showForm, setShowForm] = useState(false)
  const [start, setStart] = useState("09:00")
  const [end, setEnd] = useState("17:00")
  const [selectedDays, setSelectedDays] = useState<number[]>(WEEKDAYS)

  const addRange = () => {
    if (!start || !end || selectedDays.length === 0) return
    onChange([...value, { start, end, days: [...selectedDays] }])
    setShowForm(false)
    setStart("09:00")
    setEnd("17:00")
    setSelectedDays(WEEKDAYS)
  }

  const removeRange = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const toggleDay = (day: number) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    )
  }

  const setPreset = (days: number[]) => {
    setSelectedDays(days)
  }

  return (
    <div className="space-y-3">
      {value.length > 0 && (
        <div className="space-y-2">
          {value.map((range, i) => (
            <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-dark-300/50 border border-dark-100">
              <Clock className="w-4 h-4 text-dark-100 shrink-0" />
              <span className="text-sm font-medium">
                {range.start} – {range.end}
              </span>
              <span className="text-xs text-dark-100">
                {range.days.map((d) => DAY_NAMES[d]).join(", ")}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="ml-auto h-6 w-6"
                onClick={() => removeRange(i)}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {showForm ? (
        <div className="p-3 rounded-lg border border-dark-100 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-dark-100 mb-1 block">Start Time</label>
              <Input
                type="time"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="h-8 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-dark-100 mb-1 block">End Time</label>
              <Input
                type="time"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="h-8 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-dark-100 mb-1 block">Days</label>
            <div className="flex gap-1 mb-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={() => setPreset(WEEKDAYS)}
              >
                Weekdays
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={() => setPreset(WEEKENDS)}
              >
                Weekends
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={() => setPreset(ALL_DAYS)}
              >
                Every Day
              </Button>
            </div>
            <div className="flex gap-1">
              {DAY_NAMES.map((day, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggleDay(i)}
                  className={`w-9 h-9 rounded-lg text-xs font-medium transition-all ${
                    selectedDays.includes(i)
                      ? "bg-primary text-white"
                      : "bg-dark-300 text-dark-100 hover:bg-dark-200"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button size="sm" onClick={addRange} disabled={selectedDays.length === 0}>
              Add Range
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowForm(true)}
          className="text-xs"
        >
          <Plus className="w-3 h-3 mr-1" />
          Add Time Range
        </Button>
      )}
    </div>
  )
}
