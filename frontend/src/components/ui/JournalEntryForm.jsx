"use client"

import { useState } from "react"
import { Button } from "./button.jsx"
import { ArrowLeft, MoreHorizontal } from "lucide-react"

const JournalEntryForm = ({ mood, onSave, onCancel }) => {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  const getMoodEmoji = (moodId) => {
    const moodMap = {
      neutral: "😐",
      happy: "😊",
      excited: "😄",
      love: "🥰",
      blissful: "😌",
      worried: "😟",
      angry: "😠",
      sad: "😢",
      "very-sad": "😭",
      crying: "😢",
    }
    return moodMap[moodId] || "😊"
  }

  const handleSave = () => {
    if (title.trim() || content.trim()) {
      onSave({
        title: title.trim() || "Untitled",
        content: content.trim(),
      })
    }
  }

  const formatDate = () => {
    const now = new Date()
    const day = now.getDate()
    const month = now.toLocaleDateString("en-US", { month: "short" })
    const year = now.getFullYear()
    return `${day} ${month} ${year}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2C3B9] via-[#F0DDD6] to-[#D6CBBF]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-12">
        <Button variant="ghost" size="icon" onClick={onCancel} className="text-[#486856]">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <Button variant="ghost" size="icon" className="text-[#486856]">
          <MoreHorizontal className="w-6 h-6" />
        </Button>
        <Button onClick={handleSave} className="bg-[#F2C3B9] hover:bg-[#F2C3B9]/80 text-white px-6 py-2 rounded-full">
          SAVE
        </Button>
      </div>

      {/* Date and Mood */}
      <div className="px-4 mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h2 className="text-4xl font-light text-[#486856]">{new Date().getDate()}</h2>
          <span className="text-lg text-[#97B3AE]">{formatDate().split(" ").slice(1).join(" ")}</span>
        </div>
        <div className="text-3xl">{getMoodEmoji(mood)}</div>
      </div>

      {/* Entry Form */}
      <div className="px-4 space-y-6">
        {/* Title Input */}
        <div>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-xl font-medium text-[#486856] bg-transparent border-none outline-none placeholder-[#97B3AE]/60"
          />
        </div>

        {/* Content Textarea */}
        <div>
          <textarea
            placeholder="Write more here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-96 text-lg text-[#486856] bg-transparent border-none outline-none resize-none placeholder-[#97B3AE]/60 leading-relaxed"
          />
        </div>
      </div>

      {/* Bottom Toolbar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-[#97B3AE]/20">
        <div className="flex items-center justify-center py-4 space-x-6">
          <Button variant="ghost" size="icon" className="text-[#97B3AE]">
            <span className="text-xl">📷</span>
          </Button>
          <Button variant="ghost" size="icon" className="text-[#97B3AE]">
            <span className="text-xl">⭐</span>
          </Button>
          <Button variant="ghost" size="icon" className="text-[#97B3AE]">
            <span className="text-xl">😊</span>
          </Button>
          <Button variant="ghost" size="icon" className="text-[#97B3AE]">
            <span className="text-xl">Tt</span>
          </Button>
          <Button variant="ghost" size="icon" className="text-[#97B3AE]">
            <span className="text-xl">📝</span>
          </Button>
          <Button variant="ghost" size="icon" className="text-[#97B3AE]">
            <span className="text-xl">🏷️</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default JournalEntryForm
