"use client"

import { useState, useEffect } from "react"
import ChatHeader from "./ChatHeader"
import ChatInput from "./ChatInput"
import MessageList from "./MessageList"
import WhatsAppFloatingButton from "../WhatsAppWidget"
import { ChatMessage } from "@/models/chat"
import { shopBotApi } from "@/helpers/mockChatApi"   // <- make sure you point to the new file
import { useCart } from "@/context/CartContext"     // <- import hook
import { BotMessageSquare, Sparkles } from "lucide-react"

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)

  const { addToCart } = useCart() // ✅ get addToCart here

  // Welcome message on first open
  useEffect(() => {
    if (open && messages.length === 0) {
      const welcomeMsg: ChatMessage = {
        id: "welcome",
        sender: "bot",
        text: "👋 Hi there! I'm your AI fashion stylist. I can help you find the perfect outfit, suggest combinations, or answer any questions about our products!",
        timestamp: Date.now(),
      }
      setMessages([welcomeMsg])
    }
  }, [open, messages.length])

  const handleSend = async (text: string) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text,
      timestamp: Date.now(),
    }
    setMessages((prev) => [...prev, userMsg])
    setIsTyping(true)

    // Simulate typing delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // ✅ pass addToCart into shopBotApi
    const reply = await shopBotApi(text, addToCart)

    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      sender: "bot",
      text: reply.text,   // reply is an object now
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, botMsg])
    setIsTyping(false)
  }

  return (
    <>
      {/* WhatsApp Button - Always visible at top */}
      <div className="fixed bottom-45 right-21 ">
        <WhatsAppFloatingButton 
          phoneNumber="1234567890" // Replace with your actual WhatsApp number
          message="Hi! I found your website and I'm interested in your fashion styling services. Can you help me?"
          position="custom"
        />
      </div>

      {/* AI Chat Button */}
      {!open && (
        <div className="fixed bottom-6 right-6 z-[9999]">
          <button
            onClick={() => setOpen(true)}
            className="group relative bg-gradient-to-r from-gray-800 to-gray-900 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 animate-pulse hover:animate-none"
          >
            <div className="relative">
              <BotMessageSquare size={28} className="group-hover:scale-110 transition-transform duration-200" />
              <Sparkles size={12} className="absolute -top-1 -right-1 text-yellow-400 animate-spin" />
            </div>
            
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold animate-bounce">
              !
            </div>
          </button>
        </div>
      )}

      {/* Chat Interface */}
      {open && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-[9998] border border-gray-200 animate-in slide-in-from-bottom-5 duration-300">
          <ChatHeader onClose={() => setOpen(false)} />
          <MessageList messages={messages} isTyping={isTyping} />
          <ChatInput onSend={handleSend} />
        </div>
      )}
    </>
  )
}
