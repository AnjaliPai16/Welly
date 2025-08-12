"use client"

import { useState } from "react"
import { Button } from "./button"
import { Card, CardContent } from "./card"
import { X, Heart, Sparkles } from "lucide-react"

export default function AddGratitudeModal({ isOpen, onClose, onSave }) {
  const [gratitudeText, setGratitudeText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!gratitudeText.trim()) return

    setIsSubmitting(true)

    const newEntry = {
      id: Date.now(),
      text: gratitudeText.trim(),
      date: new Date().toISOString(),
      dateString: new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    }

    // Save the entry
    onSave(newEntry)

    // Reset form and close modal
    setGratitudeText("")
    setIsSubmitting(false)
    onClose()
  }

  const handleClose = () => {
    setGratitudeText("")
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose}></div>

      {/* Modal Content */}
      <Card className="relative w-full max-w-lg bg-gradient-to-br from-[#F0E6FF] to-[#E6E6FA] border-[#9370DB]/30 shadow-2xl">
        <CardContent className="p-0">
          {/* Header */}
          <div className="relative p-6 pb-4 bg-gradient-to-r from-[#DDA0DD] to-[#E6E6FA]">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5 text-[#4B0082]" />
            </button>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#9370DB] to-[#8A2BE2] rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-light text-[#4B0082] mb-2">Daily Gratitude</h2>
              <p className="text-[#6A5ACD] text-sm">What are you grateful for today?</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="mb-6">
              <label className="block text-[#4B0082] text-sm font-medium mb-3">
                Share something positive that happened today
              </label>
              <textarea
                value={gratitudeText}
                onChange={(e) => setGratitudeText(e.target.value)}
                placeholder="I'm grateful for..."
                className="w-full h-32 p-4 border-2 border-[#DDA0DD]/30 rounded-lg bg-white/50 backdrop-blur-sm text-[#4B0082] placeholder-[#9370DB]/60 focus:border-[#9370DB] focus:outline-none focus:ring-2 focus:ring-[#9370DB]/20 resize-none"
                required
              />
            </div>

            {/* Character count */}
            <div className="text-right mb-4">
              <span className="text-xs text-[#6A5ACD]">{gratitudeText.length}/500 characters</span>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1 border-[#9370DB]/30 text-[#6A5ACD] hover:bg-[#9370DB]/10 bg-transparent"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!gratitudeText.trim() || isSubmitting}
                className="flex-1 bg-gradient-to-r from-[#9370DB] to-[#8A2BE2] hover:from-[#8A2BE2] hover:to-[#9370DB] text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Saving...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Add to Jar
                  </div>
                )}
              </Button>
            </div>
          </form>

          {/* Decorative elements */}
          <div className="absolute top-2 left-4 w-2 h-2 bg-[#DDA0DD]/40 rounded-full"></div>
          <div className="absolute top-8 right-8 w-1 h-1 bg-[#9370DB]/40 rounded-full"></div>
          <div className="absolute bottom-4 left-8 w-1.5 h-1.5 bg-[#E6E6FA]/60 rounded-full"></div>
        </CardContent>
      </Card>
    </div>
  )
}
