"use client"

import { useState, useEffect } from "react"
import { Button } from "../components/ui/button"
import { Sparkles, Menu, Plus, Heart } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet"
import { Link } from "react-router-dom"
import AddGratitudeModal from "../components/ui/AddGratitudeModal"
import GratitudeJar from "../components/ui/GratitudeJar"
import GratitudeNotesModal from "../components/ui/GratitudeNotesModal"
import { gratitudeAPI } from "../services/api"

export default function GratitudePage() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [gratitudeEntries, setGratitudeEntries] = useState([])
  const [showNotesModal, setShowNotesModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  
  // Stats states from backend integration
  const [stats, setStats] = useState({
    totalEntries: 0,
    monthlyEntries: 0,
    currentStreak: 0,
    longestStreak: 0
  })

  // Load gratitude entries from backend
  useEffect(() => {
    loadEntries()
    loadStats()
  }, [])

  const loadEntries = async () => {
    setIsLoading(true)
    setError("")
    
    try {
      const response = await gratitudeAPI.getEntries()
      console.log('Gratitude entries response:', response)
      
      if (response.success) {
        // Normalize and sort entries by date (newest first)
        const normalizedEntries = (response.data || []).map((entry) => ({
          ...entry,
          id: entry._id,
          text: entry.note,
          date: entry.createdAt,
        }))
        const sortedEntries = normalizedEntries.sort((a, b) => new Date(b.date) - new Date(a.date))
        console.log('Normalized and sorted gratitude entries:', sortedEntries)
        setGratitudeEntries(sortedEntries)
      } else {
        setError(response.message || 'Failed to load gratitude entries')
      }
    } catch (error) {
      setError(error.message || 'Failed to load gratitude entries')
      console.error("Error loading gratitude entries:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const currentDate = new Date()
      const response = await gratitudeAPI.getStats(
        currentDate.getMonth() + 1,
        currentDate.getFullYear()
      )
      if (response.success) {
        const data = response.data || {}
        setStats({
          totalEntries: data.totalEntries || 0,
          monthlyEntries: data.monthlyEntries || 0,
          currentStreak: data.streaks?.current || 0,
          longestStreak: data.streaks?.longest || 0,
        })
      }
    } catch (error) {
      console.error('Failed to load stats:', error)
    }
  }

  // Get current date in a readable format
  const getCurrentDate = () => {
    const today = new Date()
    return today.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Always show the add button now
  const canAddGratitude = true

  // Handle saving new gratitude entries with backend integration
  const handleSaveGratitude = async (newEntry) => {
    try {
      const entryData = {
        note: newEntry.text || newEntry.note || "",
        tags: newEntry.tags ? 
          (Array.isArray(newEntry.tags) ? newEntry.tags : 
           newEntry.tags.split(',').map(tag => tag.trim()).filter(tag => tag)) : 
          []
      }

      console.log('Saving gratitude entry:', entryData)

      const response = await gratitudeAPI.createEntry(entryData)
      console.log('Gratitude save response:', response)
      
      if (response.success) {
        // Reload entries from backend to get updated data
        await loadEntries()
        await loadStats()
        return response.data // Return the saved entry
      } else {
        throw new Error(response.message || 'Failed to save gratitude entry')
      }
    } catch (error) {
      console.error("Error saving gratitude entry:", error)
      setError(error.message || 'Failed to save gratitude entry')
      throw error // Re-throw to let the modal handle the error
    }
  }

  const handleUpdateEntry = async (entryId, newText, newTags = []) => {
    try {
      const entryData = {
        note: newText,
        tags: Array.isArray(newTags) ? newTags : 
              newTags ? newTags.split(',').map(tag => tag.trim()).filter(tag => tag) : []
      }

      const response = await gratitudeAPI.updateEntry(entryId, entryData)
      if (response.success) {
        // Reload entries from backend to get updated data
        loadEntries()
        loadStats()
      } else {
        setError('Failed to update gratitude entry')
        console.error("Failed to update gratitude entry")
      }
    } catch (error) {
      setError(error.message || 'Failed to update gratitude entry')
      console.error("Error updating gratitude entry:", error)
    }
  }

  const handleDeleteEntry = async (entryId) => {
    if (!window.confirm('Are you sure you want to delete this gratitude entry?')) {
      return
    }

    try {
      const response = await gratitudeAPI.deleteEntry(entryId)
      if (response.success) {
        // Reload entries from backend
        loadEntries()
        loadStats()
      } else {
        setError('Failed to delete gratitude entry')
        console.error("Failed to delete gratitude entry")
      }
    } catch (error) {
      setError(error.message || 'Failed to delete gratitude entry')
      console.error("Error deleting gratitude entry:", error)
    }
  }

  // Handle jar click to show notes
  const handleJarClick = () => {
    if (gratitudeEntries.length > 0) {
      setShowNotesModal(true)
    }
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen  flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-[#9370DB] to-[#8A2BE2] rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <p className="text-[#6A5ACD]">Loading your gratitude collection...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E6E6FA] via-[#F0E6FF] to-[#DDA0DD]">
      <nav className="flex items-center justify-between p-6 lg:px-12 backdrop-blur-sm shadow-sm bg-[#7e4d8e]">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-[#9370DB] rounded-full flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-2xl font-bold text-[#f6f2f8]">Welly</span>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-[#f4f2f6] hover:text-[#6A5ACD] transition-colors">
            Home
          </Link>
          <Link to="/journaling" className="text-[#f7f5f8] hover:text-[#6A5ACD] transition-colors">
            Journal
          </Link>
          <Link to="/habits" className="text-[#f1eef4] hover:text-[#6A5ACD] transition-colors">
            Habits
          </Link>
         
          <Link to="/memory" className="text-[#f1eef4] hover:text-[#6A5ACD] transition-colors">
            Memory
          </Link>
          <Link to="/breathing" className="text-[#f1eef4] hover:text-[#6A5ACD] transition-colors ">
            Meditation
          </Link>
          <Link to="/playlist" className="text-[#f1eef4] hover:text-[#6A5ACD] transition-colors">
            Playlist
          </Link>
  
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden text-[#9370DB]">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent className="bg-[#F0E6FF]">
            <div className="flex flex-col space-y-6 mt-8">
              <Link to="/" className="text-[#9370DB] text-lg">
                Home
              </Link>
              <Link to="/journaling" className="text-[#9370DB] text-lg">
                Journal
              </Link>
              <Link to="/habits" className="text-[#9370DB] text-lg">
                Habits
              </Link>
              
              <Link to="/memory" className="text-[#9370DB] text-lg">
                Memory
              </Link>
              <Link to="/breathing" className="text-[#9370DB] text-lg ">
                Meditation
              </Link>
              <Link to="/playlist" className="text-[#9370DB] text-lg">
                Playlist
              </Link>

            </div>
          </SheetContent>
        </Sheet>
      </nav>

      {/* Main Content */}
      <div
        className="relative min-h-[calc(100vh-80px)]"
        style={{
          backgroundImage: "url(gratitude1.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Semi-transparent overlay for better text readabilit        y */}
{/* <div className="absolute inset-0 bg-gradient-to-br from-[#E6E6FA]/60 via-[#F0E6FF]/60 to-[#DDA0DD]/60"></div> */}

        <div className="relative z-10 p-6 pt-12">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="text-lg text-[#4B0082] mb-2">{getCurrentDate()}</div>
            <h1 className="text-4xl md:text-5xl font-light text-[#4B0082] mb-4">Gratitude Garden</h1>
            <p className="text-lg text-[#6A5ACD] max-w-2xl mx-auto">
              Cultivate appreciation and watch your happiness bloom
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="max-w-2xl mx-auto mb-8">
              <div className="p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg text-center">
                {error}
                <Button 
                  onClick={() => setError("")}
                  variant="ghost"
                  size="sm"
                  className="ml-2 text-red-600 hover:text-red-800"
                >
                  ×
                </Button>
              </div>
            </div>
          )}

          {/* Add Gratitude Button */}
          <div className="flex justify-center mb-12">
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-[#9370DB] hover:bg-[#8A2BE2] text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              disabled={isLoading}
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Gratitude
            </Button>
          </div>

          {/* Gratitude Jar Section */}
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-light text-[#4B0082] mb-4">Your Gratitude Jar</h2>
              <p className="text-[#6A5ACD]">{gratitudeEntries.length} grateful moments collected</p>
              
              {/* Stats Display (Optional - can be shown or hidden) */}
              {stats.totalEntries > 0 && (
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                    <div className="text-2xl font-bold text-[#4B0082]">{stats.totalEntries}</div>
                    <div className="text-xs text-[#6A5ACD]">Total</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                    <div className="text-2xl font-bold text-[#4B0082]">{stats.monthlyEntries}</div>
                    <div className="text-xs text-[#6A5ACD]">This Month</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                    <div className="text-2xl font-bold text-[#4B0082]">{stats.currentStreak}</div>
                    <div className="text-xs text-[#6A5ACD]">Current Streak</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                    <div className="text-2xl font-bold text-[#4B0082]">{stats.longestStreak}</div>
                    <div className="text-xs text-[#6A5ACD]">Longest Streak</div>
                  </div>
                </div>
              )}
            </div>

            {/* Gratitude Jar Visual */}
            <GratitudeJar entries={gratitudeEntries} onJarClick={handleJarClick} />
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddGratitudeModal 
        isOpen={showAddModal} 
        onClose={() => {
          setShowAddModal(false)
          // Clear any errors when closing modal
          if (error) setError("")
        }} 
        onSave={handleSaveGratitude}
        loading={isLoading}
      />
      <GratitudeNotesModal
        isOpen={showNotesModal}
        onClose={() => {
          setShowNotesModal(false)
          // Clear any errors when closing modal
          if (error) setError("")
        }}
        entries={gratitudeEntries}
        onUpdateEntry={handleUpdateEntry}
        onDeleteEntry={handleDeleteEntry}
        loading={isLoading}
      />
    </div>
  )
}