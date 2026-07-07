"use client"

import { useState, useRef, useEffect } from "react"
import { useTranslations } from "next-intl"
import { useSession } from "next-auth/react"
import { MessageCircle, Send, X, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Message {
  role: "user" | "assistant"
  content: string
}

export function AIChat() {
  const t = useTranslations("dashboard.chat")
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: t("welcomeMessage") },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  const handleSend = async () => {
    const text = input.trim()
    if (!text || loading) return

    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: text }])
    setLoading(true)

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: text }),
      })
      const data = await res.json()
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.answer || "Sorry, I couldn't process that." },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Network error. Please try again." },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!session?.user) {
    return null
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
        style={{ backgroundColor: "#0D9488" }}
        aria-label="Open AI Assistant"
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </button>
    )
  }

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col overflow-hidden rounded-xl shadow-2xl animate-scale-in"
      style={{ width: 320, height: 400 }}
    >
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ backgroundColor: "#0D9488" }}
      >
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-white" />
          <span className="font-medium text-white text-sm">{t("title")}</span>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="rounded-full p-1 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto bg-dark-500 p-3 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn(
              "max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed",
              msg.role === "user"
                ? "ml-auto text-white"
                : "mr-auto text-dark-50",
              msg.role === "user"
                ? ""
                : "border border-dark-100 bg-dark-600"
            )}
            style={
              msg.role === "user"
                ? { backgroundColor: "#0D9488" }
                : undefined
            }
          >
            {msg.content.split("\n").map((line, j) => (
              <span key={j}>
                {line}
                {j < msg.content.split("\n").length - 1 && <br />}
              </span>
            ))}
          </div>
        ))}
        {loading && (
          <div className="mr-auto max-w-[85%] rounded-lg border border-dark-100 bg-dark-600 px-3 py-2 text-sm text-dark-100">
            <span className="flex gap-1">
              <span className="animate-pulse">.</span>
              <span className="animate-pulse" style={{ animationDelay: "0.2s" }}>.</span>
              <span className="animate-pulse" style={{ animationDelay: "0.4s" }}>.</span>
            </span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-dark-100 bg-dark-500 p-3">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t("placeholder")}
            disabled={loading}
            className="flex-1 rounded-lg border border-dark-100 bg-dark-600 px-3 py-2 text-sm text-dark-50 placeholder:text-dark-100 outline-none focus:border-accent transition-colors"
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="h-9 w-9 shrink-0"
            style={{ backgroundColor: "#0D9488" }}
          >
            <Send className="h-4 w-4 text-white" />
          </Button>
        </div>
      </div>
    </div>
  )
}
