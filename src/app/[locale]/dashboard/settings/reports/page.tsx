"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/toast"
import { Save, Loader2, Mail, Bell } from "lucide-react"
import { useTranslations } from "next-intl"

export default function ReportsSettingsPage() {
  const t = useTranslations("dashboard.settings.reports")
  const [isActive, setIsActive] = useState(false)
  const [frequency, setFrequency] = useState("daily")
  const [dayOfWeek, setDayOfWeek] = useState(0)
  const [dayOfMonth, setDayOfMonth] = useState(1)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { addToast } = useToast()

  const dayNames: string[] = t.raw("days")

  useEffect(() => {
    fetch("/api/user/report-schedule")
      .then((res) => res.json())
      .then((json) => {
        if (json.data) {
          setIsActive(json.data.isActive)
          setFrequency(json.data.frequency || "daily")
          setDayOfWeek(json.data.dayOfWeek ?? 0)
          setDayOfMonth(json.data.dayOfMonth ?? 1)
        }
      })
      .catch(() => addToast(t("toast.loadFailed"), "error"))
      .finally(() => setLoading(false))
  }, [addToast, t])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/user/report-schedule", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive, frequency, dayOfWeek, dayOfMonth }),
      })
      const json = await res.json()
      if (json.data) {
        addToast(t("toast.saveSuccess"), "success")
      } else {
        addToast(json.error || t("toast.saveFailed"), "error")
      }
    } catch {
      addToast(t("toast.saveFailedGeneric"), "error")
    } finally {
      setSaving(false)
    }
  }

  const ordinalSuffix = (n: number): string => {
    if (n === 1) return t("ordinalFirst")
    if (n === 2) return t("ordinalSecond")
    if (n === 3) return t("ordinalThird")
    return t("ordinalOther")
  }

  if (loading) {
    return (
      <div className="space-y-6 max-w-3xl">
        <div className="animate-pulse space-y-2">
          <div className="h-8 w-48 rounded bg-dark-100/20" />
          <div className="h-4 w-64 rounded bg-dark-100/20" />
        </div>
        <Card>
          <CardContent className="animate-pulse space-y-4 p-6">
            <div className="h-5 w-40 rounded bg-dark-100/20" />
            <div className="h-4 w-56 rounded bg-dark-100/20" />
            <div className="h-10 w-full rounded bg-dark-100/20" />
            <div className="h-10 w-full rounded bg-dark-100/20" />
            <div className="h-10 w-24 rounded bg-dark-100/20" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-dark-50">{t("title")}</h1>
        <p className="mt-1 text-sm text-dark-100">
          {t("description")}
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-dark-100" />
            <div>
              <CardTitle className="text-lg">{t("reportSchedule")}</CardTitle>
              <CardDescription>
                {t("reportScheduleDesc")}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-dark-100" />
              <div>
                <p className="text-sm font-medium text-dark-50">{t("enableReports")}</p>
                <p className="text-xs text-dark-100">{t("enableReportsDesc")}</p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={isActive}
              onClick={() => setIsActive(!isActive)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-700 ${
                isActive ? "bg-primary-500" : "bg-dark-300"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform ${
                  isActive ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="frequency">{t("frequency")}</Label>
            <Select
              id="frequency"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
            >
              <option value="daily">{t("daily")}</option>
              <option value="weekly">{t("weekly")}</option>
              <option value="monthly">{t("monthly")}</option>
            </Select>
          </div>

          {frequency === "weekly" && (
            <div className="space-y-2">
              <Label htmlFor="dayOfWeek">{t("dayOfWeek")}</Label>
              <Select
                id="dayOfWeek"
                value={String(dayOfWeek)}
                onChange={(e) => setDayOfWeek(Number(e.target.value))}
              >
                {dayNames.map((name: string, i: number) => (
                  <option key={i} value={i}>{name}</option>
                ))}
              </Select>
            </div>
          )}

          {frequency === "monthly" && (
            <div className="space-y-2">
              <Label htmlFor="dayOfMonth">{t("dayOfMonth")}</Label>
              <Select
                id="dayOfMonth"
                value={String(dayOfMonth)}
                onChange={(e) => setDayOfMonth(Number(e.target.value))}
              >
                {Array.from({ length: 28 }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </Select>
              <p className="text-xs text-dark-100">{t("monthlyInfo", { day: dayOfMonth, suffix: ordinalSuffix(dayOfMonth) })}</p>
            </div>
          )}

          <Button variant="primary" onClick={handleSave} disabled={saving}>
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {saving ? t("saving") : t("saveSettings")}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}