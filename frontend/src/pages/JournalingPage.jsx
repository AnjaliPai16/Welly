"use client"

import { useState, useEffect } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { ArrowLeft, Plus, MoreHorizontal, Calendar, FileText } from "lucide-react"
import { Link } from "react-router-dom"
import MoodSelector from "../components/ui/MoodSelector.jsx"
import JournalEntryForm from "../components/ui/JournalEntryForm.jsx"

const JournalingPage = () => {
  const [entries, setEntries] = useState([])
  const [showMoodSelector, setShowMoodSelector] = useState(false)
  const [showEntryForm, setShowEntryForm] = useState(false)
  const [selectedMood, setSelectedMood] = useState(null)

  // Load entries from localStorage on component mount
  useEffect(() => {
    const savedEntries = localStorage.getItem("journalEntries")
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries))
    }
  }, [])

  // Save entries to localStorage whenever entries change
  useEffect(() => {
    localStorage.setItem("journalEntries", JSON.stringify(entries))
  }, [entries])

  const handleNewEntry = () => {
    setShowMoodSelector(true)
  }

  const handleMoodSelected = (mood) => {
    setSelectedMood(mood)
    setShowMoodSelector(false)
    setShowEntryForm(true)
  }

  const handleSaveEntry = (entryData) => {
    const newEntry = {
      id: Date.now(),
      ...entryData,
      mood: selectedMood,
      date: new Date().toISOString(),
      status: "saved",
    }
    setEntries((prev) => [newEntry, ...prev])
    setShowEntryForm(false)
    setSelectedMood(null)
  }

  const handleCancelEntry = () => {
    setShowEntryForm(false)
    setSelectedMood(null)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const day = date.getDate()
    const month = date.toLocaleDateString("en-US", { month: "short" })
    return { day, month }
  }

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

  if (showEntryForm) {
    return <JournalEntryForm mood={selectedMood} onSave={handleSaveEntry} onCancel={handleCancelEntry} />
  }

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-br from-[#F2C3B9] via-[#F0DDD6] to-[#D6CBBF] flex items-center justify-between p-4 pt-12 relative z-10">
        <Link to="/">
          <Button variant="ghost" size="icon" className="text-[#486856]">
            <ArrowLeft className="w-6 h-6" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold text-[#486856]">Journal</h1>
        <Button variant="ghost" size="icon" className="text-[#486856]">
          <MoreHorizontal className="w-6 h-6" />
        </Button>
      </div>

      <div
        className="min-h-[calc(100vh-80px)] bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: "url(journalbg.jpg)" }}
      >
        <div className="absolute inset-0 bg-white/30 backdrop-blur-[0.5px]"></div>

        {/* Content container with relative positioning */}
        <div className="relative z-10">
          {/* Challenge Banner */}
          <div className="mx-4 mb-6 pt-6">
            <Card className="bg-gradient-to-r from-[#97B3AE] to-[#D2E0D3] border-none shadow-lg">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg mb-1">3-Day Habit Challenge</h3>
                  <p className="text-white/90 text-sm">Build diary habit to get a Pro sticker pack! Write diary now!</p>
                </div>
                <div className="text-4xl">🎁</div>
              </CardContent>
            </Card>
          </div>

          {/* Year Header */}
          <div className="px-4 mb-4">
            <h2 className="text-2xl font-light text-[#486856]">{new Date().getFullYear()}</h2>
          </div>

          {/* Journal Entries */}
          <div className="px-4 space-y-4 pb-24">
            {entries.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-[#97B3AE] mx-auto mb-4 opacity-50" />
                <p className="text-[#97B3AE] text-lg">No entries yet</p>
                <p className="text-[#97B3AE]/70 text-sm">Tap the + button to start journaling</p>
              </div>
            ) : (
              entries.map((entry) => {
                const { day, month } = formatDate(entry.date)
                return (
                  <Card key={entry.id} className="bg-white/70 backdrop-blur-sm border-none shadow-md">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="text-3xl font-light text-[#486856]">{day}</div>
                          <div className="text-sm text-[#97B3AE]">{month}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-[#97B3AE]" />
                          <span className="text-sm text-[#97B3AE]">{entry.status}</span>
                        </div>
                      </div>
                      <div className="text-2xl">{getMoodEmoji(entry.mood)}</div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-[#97B3AE]/20">
        <div className="flex items-center justify-center py-4">
          <div className="flex items-center space-x-8">
            <Button variant="ghost" size="icon" className="text-[#97B3AE] bg-[#97B3AE]/10 rounded-full w-12 h-12">
              <Calendar className="w-6 h-6" />
            </Button>
            <Button
              onClick={handleNewEntry}
              className="bg-[#F2C3B9] hover:bg-[#F2C3B9]/80 text-white rounded-full w-16 h-16 shadow-lg"
            >
              <Plus className="w-8 h-8" />
            </Button>
            <Button variant="ghost" size="icon" className="text-[#97B3AE] bg-[#97B3AE]/10 rounded-full w-12 h-12">
              <FileText className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mood Selector Modal */}
      {showMoodSelector && (
        <MoodSelector onMoodSelect={handleMoodSelected} onClose={() => setShowMoodSelector(false)} />
      )}
    </div>
  )
}

export default JournalingPage
