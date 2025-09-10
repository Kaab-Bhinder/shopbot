"use client"

import { X, Bot } from "lucide-react"

export default function ChatHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white px-4 py-4 rounded-t-2xl shadow-lg relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
      
      <div className="relative flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <Bot size={20} className="text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
          </div>
          
          <div>
            <h2 className="font-bold text-lg tracking-wide">SHOP BOT - Your AI Stylist</h2>
            <div className="text-xs text-gray-300 flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Online now</span>
            </div>
          </div>
        </div>

        <button 
          onClick={onClose} 
          className="p-2 hover:bg-red-500/20 rounded-full transition-colors duration-200 group cursor-pointer"
          title="Close chat"
        >
          <X size={18} className="group-hover:scale-110 transition-transform group-hover:text-red-400" />
        </button>
      </div>
    </div>
  )
}