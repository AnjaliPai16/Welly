"use client"

import { Button } from "./button"

const JournalEntryViewer = ({ entry, onClose }) => {
  const getMoodEmoji = (mood) => {
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
    return moodMap[mood] || "😊"
  }

  if (!entry) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{getMoodEmoji(entry.mood)}</div>
                <div>
                  <h2 className="text-xl font-semibold text-[#486856]">{entry.title || "Journal Entry"}</h2>
                  <p className="text-sm text-[#97B3AE]">
                    {new Date(entry.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="text-[#97B3AE] hover:text-[#486856]">
                ✕
              </Button>
            </div>
          </div>
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <div className="prose prose-sm max-w-none">
              <p className="text-[#486856] whitespace-pre-wrap leading-relaxed">
                {entry.content || "No content available."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JournalEntryViewer
