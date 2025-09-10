"use client"

import { useState } from "react"
import { Send } from "lucide-react"

interface ChatInputProps {
  onSend: (msg: string) => void
  disabled?: boolean
}

export default function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const [text, setText] = useState("")

  const handleSend = () => {
    if (text.trim() === "" || disabled) return
    onSend(text.trim())
    setText("")
  }

  const quickSuggestions = [
    "Show me trending items",
    "Help me find a dress", 
    "What's on sale?",
    "Style advice"
  ]

  return (
    <div className="bg-white border-t border-gray-100 rounded-b-2xl">
      {/* Quick suggestions - Only show when input is empty */}
      {text === "" && !disabled && (
        <div className="px-4 pt-4 pb-2">
          <div className="flex flex-wrap gap-2">
            {quickSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setText(suggestion)}
                className="px-3 py-2 text-xs font-medium bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main input area */}
      <div className="p-4">
        <div className="flex items-center gap-3 bg-gray-50 rounded-2xl px-4 py-3 border border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all duration-200">
          {/* Input field */}
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Ask me anything about fashion, products, or styling..."
            className="flex-1 bg-transparent text-sm placeholder-gray-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                handleSend()
              }
            }}
            disabled={disabled}
            maxLength={500}
          />

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={disabled || text.trim() === ""}
            className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white flex items-center justify-center hover:shadow-lg hover:scale-110 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
            title="Send message"
          >
            <Send size={14} />
          </button>
        </div>

        {/* Character count - only show when approaching limit */}
        {text.length > 400 && (
          <div className="mt-2 text-right">
            <span className={`text-xs ${text.length > 480 ? 'text-red-500' : 'text-gray-400'}`}>
              {text.length}/500
            </span>
          </div>
        )}
      </div>

      {/* Status indicator */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>AI Stylist is online and ready to help</span>
          </div>
        </div>
      </div>
    </div>
  )
}