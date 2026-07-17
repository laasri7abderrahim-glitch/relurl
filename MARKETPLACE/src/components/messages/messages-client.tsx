"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { MessageCircle, Send, Search, Phone, BadgeCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRealtimeMessages } from "@/MARKETPLACE/src/hooks/use-realtime-messages"

interface Conversation {
  id: string
  name: string
  avatar?: string
  isVerified?: boolean
  lastMessage: string
  lastMessageAt: string
  unreadCount: number
  listingTitle?: string
  listingImage?: string
}

interface Props {
  locale: string
}

const MOCK_CONVERSATIONS: Conversation[] = []

export function MessagesClient({ locale }: Props) {
  const t = useTranslations("marketplace")
  const isArabic = locale === "ar"
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messageInput, setMessageInput] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const { messages, sendMessage } = useRealtimeMessages(selectedConversation)

  const handleSend = async () => {
    if (!messageInput.trim() || !selectedConversation) return
    await sendMessage(messageInput, "current-user-id", "Utilisateur")
    setMessageInput("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const filteredConversations = MOCK_CONVERSATIONS.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        {isArabic ? "الرسائل" : "Messages"}
      </h1>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden h-[calc(100vh-200px)] flex">
        <div className="w-80 border-r border-gray-200 dark:border-gray-800 flex flex-col">
          <div className="p-3 border-b border-gray-200 dark:border-gray-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isArabic ? "بحث..." : "Rechercher..."}
                className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm border-0 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            {filteredConversations.length === 0 ? (
              <div className="p-6 text-center">
                <MessageCircle className="w-10 h-10 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {isArabic ? "لا توجد محادثات" : "Aucune conversation"}
                </p>
              </div>
            ) : (
              filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv.id)}
                  className={`w-full flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left ${
                    selectedConversation === conv.id ? "bg-primary/5 dark:bg-primary/10" : ""
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    {conv.avatar ? (
                      <img src={conv.avatar} alt="" className="w-11 h-11 rounded-full object-cover" />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-medium text-sm">
                          {conv.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <p className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                        {conv.name}
                      </p>
                      {conv.isVerified && <BadgeCheck className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />}
                    </div>
                    {conv.listingTitle && (
                      <p className="text-xs text-gray-400 truncate">{conv.listingTitle}</p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                      {conv.lastMessage}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] text-gray-400">
                      {new Date(conv.lastMessageAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    {conv.unreadCount > 0 && (
                      <span className="w-5 h-5 bg-primary text-white text-[10px] font-medium rounded-full flex items-center justify-center">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          {!selectedConversation ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 mx-auto text-gray-200 dark:text-gray-700 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  {isArabic ? "اختر محادثة" : "Sélectionnez une conversation"}
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-medium text-sm">U</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                      {isArabic ? "مستخدم" : "Utilisateur"}
                    </p>
                    <p className="text-xs text-green-500">
                      {isArabic ? "متصل" : "En ligne"}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Phone className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex-1 overflow-auto p-4 space-y-3">
                {messages.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-gray-400">
                      {isArabic ? "ابدأ المحادثة" : "Commencez la conversation"}
                    </p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.senderId === "current-user-id" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${
                          msg.senderId === "current-user-id"
                            ? "bg-primary text-white rounded-br-md"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-md"
                        }`}
                      >
                        <p>{msg.content}</p>
                        <p className={`text-[10px] mt-1 ${msg.senderId === "current-user-id" ? "text-white/70" : "text-gray-400"}`}>
                          {new Date(msg.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-3 border-t border-gray-200 dark:border-gray-800">
                <div className="flex items-end gap-2">
                  <textarea
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={isArabic ? "اكتب رسالة..." : "Écrivez un message..."}
                    rows={1}
                    className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm resize-none border-0 focus:outline-none focus:ring-2 focus:ring-primary/50 max-h-24"
                  />
                  <Button
                    size="sm"
                    onClick={handleSend}
                    disabled={!messageInput.trim()}
                    className="rounded-xl"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}