"use client"

import { useState, useEffect } from "react"
import { Button } from "../components/ui/button"
import { Sparkles, Menu, Plus, Heart } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet"
import { Link } from "react-router-dom"
import AddGratitudeModal from "../components/ui/AddGratitudeModal"
import GratitudeJar from "../components/ui/GratitudeJar"
import GratitudeNotesModal from "../components/ui/GratitudeNotesModal"
import {
  loadGratitudeEntries,
  saveGratitudeEntries,
  updateGratitudeEntry,
  deleteGratitudeEntry,
} from "../utils/gratitudeStorage"

export default function GratitudePage() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [gratitudeEntries, setGratitudeEntries] = useState([])
  const [showNotesModal, setShowNotesModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Load gratitude entries using utility function
  useEffect(() => {
    const loadEntries = async () => {
      try {
        const entries = loadGratitudeEntries()
        setGratitudeEntries(entries)
      } catch (error) {
        console.error("Error loading gratitude entries:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadEntries()
  }, [])

  // Save gratitude entries using utility function whenever entries change
  useEffect(() => {
    if (!isLoading && gratitudeEntries.length >= 0) {
      const success = saveGratitudeEntries(gratitudeEntries)
      if (!success) {
        console.error("Failed to save gratitude entries")
      }
    }
  }, [gratitudeEntries, isLoading])

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

  // Handle saving new gratitude entries with better error handling
  const handleSaveGratitude = (newEntry) => {
    try {
      setGratitudeEntries((prev) => {
        const updatedEntries = [newEntry, ...prev]
        return updatedEntries
      })
    } catch (error) {
      console.error("Error saving new gratitude entry:", error)
      // Could show user notification here
    }
  }

  const handleUpdateEntry = (entryId, newText) => {
    try {
      const success = updateGratitudeEntry(entryId, newText)
      if (success) {
        // Reload entries from storage to get the updated data
        const updatedEntries = loadGratitudeEntries()
        setGratitudeEntries(updatedEntries)
      } else {
        console.error("Failed to update gratitude entry")
      }
    } catch (error) {
      console.error("Error updating gratitude entry:", error)
    }
  }

  const handleDeleteEntry = (entryId) => {
    try {
      const success = deleteGratitudeEntry(entryId)
      if (success) {
        // Remove the entry from local state
        setGratitudeEntries((prev) => prev.filter((entry) => entry.id !== entryId))
      } else {
        console.error("Failed to delete gratitude entry")
      }
    } catch (error) {
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
      <div className="min-h-screen bg-gradient-to-br from-[#E6E6FA] via-[#F0E6FF] to-[#DDA0DD] flex items-center justify-center">
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
          <div className="w-8 h-8 bg-[#9370DB]  rounded-full flex items-center justify-center">
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
          <Button className="bg-[#9370DB] hover:bg-[#8A2BE2] text-white border-none">Get Started</Button>
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
              <Button className="bg-[#9370DB] hover:bg-[#8A2BE2] text-white">Get Started</Button>
            </div>
          </SheetContent>
        </Sheet>
      </nav>

      {/* Main Content */}
      <div
        className="relative min-h-[calc(100vh-80px)]"
        style={{
          backgroundImage: "url(gratitude.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Semi-transparent overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#E6E6FA]/60 via-[#F0E6FF]/60 to-[#DDA0DD]/60"></div>

        <div className="relative z-10 p-6 pt-12">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="text-lg text-[#4B0082] mb-2">{getCurrentDate()}</div>
            <h1 className="text-4xl md:text-5xl font-light text-[#4B0082] mb-4">Gratitude Garden</h1>
            <p className="text-lg text-[#6A5ACD] max-w-2xl mx-auto">
              Cultivate appreciation and watch your happiness bloom
            </p>
          </div>

          {/* Add Gratitude Button */}
          {/* Always show add button now */}
          <div className="flex justify-center mb-12">
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-[#9370DB] hover:bg-[#8A2BE2] text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
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
            </div>

            {/* Gratitude Jar Visual */}
            <GratitudeJar entries={gratitudeEntries} onJarClick={handleJarClick} />
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddGratitudeModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onSave={handleSaveGratitude} />
      <GratitudeNotesModal
        isOpen={showNotesModal}
        onClose={() => setShowNotesModal(false)}
        entries={gratitudeEntries}
        onUpdateEntry={handleUpdateEntry}
        onDeleteEntry={handleDeleteEntry}
      />
    </div>
  )
}
