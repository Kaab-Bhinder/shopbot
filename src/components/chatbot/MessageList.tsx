"use client"

import { ChatMessage } from "@/models/chat"
import { Bot, User } from "lucide-react"
import { useEffect, useRef } from "react"

interface MessageListProps {
  messages: ChatMessage[]
  isTyping?: boolean
}

export default function MessageList({ messages, isTyping = false }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white relative">
      {/* Background subtle pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative">
        {messages.map((msg, index) => (
          <div
            key={msg.id}
            className={`flex mb-6 animate-in slide-in-from-bottom-2 duration-300 ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div
              className={`flex max-w-[85%] ${
                msg.sender === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {/* Avatar */}
              <div
                className={`flex-shrink-0 ${
                  msg.sender === "user" ? "ml-3" : "mr-3"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-blue-500 to-purple-600"
                      : "bg-gradient-to-r from-green-500 to-blue-500"
                  }`}
                >
                  {msg.sender === "user" ? (
                    <User size={16} className="text-white" />
                  ) : (
                    <Bot size={16} className="text-white" />
                  )}
                </div>
              </div>

              {/* Bubble + time */}
              <div className="flex flex-col">
                <div
                  className={`relative px-4 py-3 rounded-2xl text-sm shadow-lg ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-md"
                      : "bg-white text-gray-800 border border-gray-200 rounded-bl-md"
                  }`}
                >
                  {/* Tail */}
                  <div
                    className={`absolute top-0 w-0 h-0 ${
                      msg.sender === "user"
                        ? "right-0 border-l-8 border-l-purple-600 border-t-8 border-t-transparent"
                        : "left-0 border-r-8 border-r-white border-t-8 border-t-transparent"
                    }`}
                  />

                  {/* Content */}
                  <p className="whitespace-pre-wrap leading-relaxed">
                    {msg.text}
                  </p>
                </div>

                <div
                  className={`text-xs text-gray-500 mt-1 ${
                    msg.sender === "user" ? "text-right" : "text-left"
                  }`}
                >
                  {formatTime(msg.timestamp)}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Typing dots */}
        {isTyping && (
          <div className="flex justify-start mb-4 animate-in slide-in-from-bottom-2 duration-300">
            <div className="flex">
              <div className="mr-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center shadow-md">
                  <Bot size={16} className="text-white" />
                </div>
              </div>
              <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-bl-md shadow-md">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}
