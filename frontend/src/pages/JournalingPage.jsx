"use client"

import { useState, useEffect } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Sparkles, Menu, Plus, Calendar, FileText } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet"
import { Link } from "react-router-dom"
import MoodSelector from "../components/ui/MoodSelector.jsx"
import JournalEntryForm from "../components/ui/JournalEntryForm.jsx"

const JournalingPage = () => {
  const [entries, setEntries] = useState([])
  const [showMoodSelector, setShowMoodSelector] = useState(false)
  const [showEntryForm, setShowEntryForm] = useState(false)
  const [selectedMood, setSelectedMood] = useState(null)
  const [selectedEntry, setSelectedEntry] = useState(null)
  const [showEntryViewer, setShowEntryViewer] = useState(false)

  useEffect(() => {
    const savedEntries = localStorage.getItem("journalEntries")
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries))
    }
  }, [])

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

  const handleOpenEntry = (entry) => {
    setSelectedEntry(entry)
    setShowEntryViewer(true)
  }

  const handleCloseEntryViewer = () => {
    setSelectedEntry(null)
    setShowEntryViewer(false)
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

  return (
    <div className="min-h-screen">
      <nav className="flex items-center justify-between p-6 lg:px-12 backdrop-blur-sm shadow-sm bg-gradient-to-r from-[#F2C3B9] to-[#F0DDD6]">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-[#486856] to-[#97B3AE] rounded-full flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-2xl font-bold text-[#486856]">Welly</span>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-[#486856] hover:text-[#97B3AE] transition-colors">
            Home
          </Link>
          <Link to="/journaling" className="text-[#486856] hover:text-[#97B3AE] transition-colors font-semibold">
            Journal
          </Link>
          <Link to="/habits" className="text-[#486856] hover:text-[#97B3AE] transition-colors">
            Habits
          </Link>
          <Link to="/gratitude" className="text-[#486856] hover:text-[#97B3AE] transition-colors">
            Gratitude
          </Link>
          <Link to="/memory" className="text-[#486856] hover:text-[#97B3AE] transition-colors">
            Memory
          </Link>
          <Link to="/playlist" className="text-[#486856] hover:text-[#97B3AE] transition-colors">
            Playlist
          </Link>
          <Button className="bg-[#486856] hover:bg-[#97B3AE] text-white border-none">Get Started</Button>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden text-[#486856]">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent className="bg-[#F0DDD6]">
            <div className="flex flex-col space-y-6 mt-8">
              <Link to="/" className="text-[#486856] text-lg">
                Home
              </Link>
              <Link to="/journaling" className="text-[#486856] text-lg font-semibold">
                Journal
              </Link>
              <Link to="/habits" className="text-[#486856] text-lg">
                Habits
              </Link>
              <Link to="/gratitude" className="text-[#486856] text-lg">
                Gratitude
              </Link>
              <Link to="/memory" className="text-[#486856] text-lg">
                Memory
              </Link>
              <Link to="/playlist" className="text-[#486856] text-lg">
                Playlist
              </Link>
              <Button className="bg-[#486856] hover:bg-[#97B3AE] text-white">Get Started</Button>
            </div>
          </SheetContent>
        </Sheet>
      </nav>

      <div
        className="min-h-[calc(100vh-80px)] bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: "url(journalbg.jpg)" }}
      >
        <div className="absolute inset-0 bg-white/30 backdrop-blur-[0.5px]"></div>

        <div className="relative z-10">
          

          <div className="px-4 mb-4">
            <h2 className="text-2xl font-light text-[#486856]">{new Date().getFullYear()}</h2>
          </div>

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
                  <Card
                    key={entry.id}
                    className="bg-white/70 backdrop-blur-sm border-none shadow-md cursor-pointer hover:bg-white/80 transition-colors"
                    onClick={() => handleOpenEntry(entry)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
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
                      </div>
                      {entry.title && (
                        <div className="mt-2">
                          <h3 className="text-[#486856] font-medium text-sm line-clamp-1">{entry.title}</h3>
                        </div>
                      )}
                      {entry.content && (
                        <div className="mt-1">
                          <p className="text-[#97B3AE] text-xs line-clamp-2">{entry.content}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </div>
      </div>

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

      {showMoodSelector && (
        <MoodSelector onMoodSelect={handleMoodSelected} onClose={() => setShowMoodSelector(false)} />
      )}

      {showEntryForm && (
        <div className="fixed inset-0 z-50">
          <JournalEntryForm mood={selectedMood} onSave={handleSaveEntry} onCancel={handleCancelEntry} />
        </div>
      )}

      {showEntryViewer && selectedEntry && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{getMoodEmoji(selectedEntry.mood)}</div>
                    <div>
                      <h2 className="text-xl font-semibold text-[#486856]">{selectedEntry.title || "Journal Entry"}</h2>
                      <p className="text-sm text-[#97B3AE]">
                        {new Date(selectedEntry.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCloseEntryViewer}
                    className="text-[#97B3AE] hover:text-[#486856]"
                  >
                    ✕
                  </Button>
                </div>
              </div>
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="prose prose-sm max-w-none">
                  <p className="text-[#486856] whitespace-pre-wrap leading-relaxed">
                    {selectedEntry.content || "No content available."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default JournalingPage
