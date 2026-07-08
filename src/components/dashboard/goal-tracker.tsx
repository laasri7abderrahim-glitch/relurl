"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Target, TrendingUp, Sparkles } from "lucide-react"

const STORAGE_KEY = "dashboard_click_goal"
const DEFAULT_GOAL = 100

function getTodayClicks(clicksByDay?: { date: string; clicks: number }[]): number {
  if (!clicksByDay?.length) return 0
  const today = new Date().toISOString().slice(0, 10)
  return clicksByDay.find((d) => d.date === today)?.clicks ?? 0
}

export default function GoalTracker({ clicksByDay }: { clicksByDay?: { date: string; clicks: number }[] }) {
  const [goal, setGoal] = useState(DEFAULT_GOAL)
  const [editing, setEditing] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = parseInt(saved, 10)
      if (!isNaN(parsed) && parsed > 0) {
        setGoal(parsed)
      }
    }
    setMounted(true)
  }, [])

  const todayClicks = getTodayClicks(clicksByDay)
  const progress = Math.min(todayClicks / goal, 1)
  const isReached = todayClicks >= goal
  const percentage = Math.round(progress * 100)

  const handleSave = () => {
    const val = parseInt(inputValue, 10)
    if (!isNaN(val) && val > 0) {
      setGoal(val)
      localStorage.setItem(STORAGE_KEY, val.toString())
    }
    setEditing(false)
  }

  const handleOpen = () => {
    setInputValue(goal.toString())
    setEditing(true)
  }

  if (!mounted) return null

  return (
    <>
      <Card className="border-dark-100">
        <CardHeader className="flex flex-row items-center justify-between pb-1">
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="h-4 w-4 text-accent" />
            Daily Goal
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={handleOpen} className="text-xs h-auto px-2 py-1">
            Edit
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between mb-2">
            <div>
              <span className="text-2xl font-bold text-dark-50">{todayClicks}</span>
              <span className="text-sm text-dark-100 mx-1">/</span>
              <span className="text-sm text-dark-100">{goal}</span>
            </div>
            {isReached && (
              <span className="flex items-center gap-1 text-xs text-emerald-500 font-medium">
                <Sparkles className="h-3 w-3" />
                Goal reached!
              </span>
            )}
          </div>
          <div className="h-2 rounded-full bg-dark-300 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isReached ? "bg-emerald-500" : "bg-accent"
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-dark-100">{percentage}%</span>
            <span className="text-xs text-dark-100">{goal - todayClicks > 0 ? `${goal - todayClicks} remaining` : "Complete!"}</span>
          </div>
        </CardContent>
      </Card>

      <Dialog open={editing} onOpenChange={setEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Daily Click Goal</DialogTitle>
            <DialogDescription>Set the number of clicks you want to achieve each day.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <Input
              type="number"
              min={1}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              placeholder="Enter goal..."
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
              <Button onClick={handleSave}>Save Goal</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
