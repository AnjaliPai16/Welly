"use client"

import { useState } from "react"
import { Button } from "./button"
import { Card, CardContent } from "./card"
import { X, Heart, Calendar, Sparkles, ChevronLeft, ChevronRight, Edit2, Trash2, Check, XIcon } from "lucide-react"

export default function GratitudeNotesModal({ isOpen, onClose, entries, onUpdateEntry, onDeleteEntry }) {
  const [currentPage, setCurrentPage] = useState(0)
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState("")
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)
  const notesPerPage = 6
  const totalPages = Math.ceil(entries.length / notesPerPage)

  const getCurrentPageEntries = () => {
    const startIndex = currentPage * notesPerPage
    return entries.slice(startIndex, startIndex + notesPerPage)
  }

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  const startEdit = (entry) => {
    setEditingId(entry.id)
    setEditText(entry.text)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditText("")
  }

  const saveEdit = () => {
    if (editText.trim() && onUpdateEntry) {
      onUpdateEntry(editingId, editText.trim())
      setEditingId(null)
      setEditText("")
    }
  }

  const confirmDelete = (entryId) => {
    setDeleteConfirmId(entryId)
  }

  const cancelDelete = () => {
    setDeleteConfirmId(null)
  }

  const executeDelete = () => {
    if (deleteConfirmId && onDeleteEntry) {
      onDeleteEntry(deleteConfirmId)
      setDeleteConfirmId(null)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getNoteColor = (index) => {
    const colors = [
      "bg-gradient-to-br from-[#FFB6C1] to-[#FFC0CB]", // Light pink
      "bg-gradient-to-br from-[#DDA0DD] to-[#E6E6FA]", // Plum to lavender
      "bg-gradient-to-br from-[#98FB98] to-[#90EE90]", // Light green
      "bg-gradient-to-br from-[#F0E68C] to-[#FFFFE0]", // Khaki to light yellow
      "bg-gradient-to-br from-[#87CEEB] to-[#B0E0E6]", // Sky blue to powder blue
      "bg-gradient-to-br from-[#DEB887] to-[#F5DEB3]", // Burlywood to wheat
    ]
    return colors[index % colors.length]
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal Content */}
      <Card className="relative w-full max-w-4xl max-h-[90vh] bg-gradient-to-br from-[#F0E6FF] to-[#E6E6FA] border-[#9370DB]/30 shadow-2xl overflow-hidden">
        <CardContent className="p-0">
          {/* Header */}
          <div className="relative p-6 bg-gradient-to-r from-[#DDA0DD] to-[#E6E6FA] border-b border-[#9370DB]/20">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5 text-[#4B0082]" />
            </button>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#9370DB] to-[#8A2BE2] rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-light text-[#4B0082] mb-2">Your Gratitude Collection</h2>
              <p className="text-[#6A5ACD]">
                {entries.length} grateful moment{entries.length !== 1 ? "s" : ""} to cherish
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {entries.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 text-[#9370DB]/40 mx-auto mb-4" />
                <h3 className="text-xl text-[#6A5ACD] mb-2">No gratitude entries yet</h3>
                <p className="text-[#9370DB]/60">Start adding grateful moments to fill your jar!</p>
              </div>
            ) : (
              <>
                {/* Notes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {getCurrentPageEntries().map((entry, index) => (
                    <Card
                      key={entry.id || index}
                      className={`${getNoteColor(
                        index + currentPage * notesPerPage,
                      )} border-none shadow-md hover:shadow-lg transition-all duration-300 ${
                        editingId === entry.id ? "ring-2 ring-[#9370DB]" : "hover:scale-105"
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 text-[#4B0082] mr-2" />
                            <span className="text-sm text-[#4B0082] font-medium">{formatDate(entry.date)}</span>
                          </div>

                          <div className="flex space-x-1">
                            {editingId === entry.id ? (
                              <>
                                <button
                                  onClick={saveEdit}
                                  className="p-1 rounded hover:bg-white/20 transition-colors"
                                  title="Save changes"
                                >
                                  <Check className="w-4 h-4 text-green-600" />
                                </button>
                                <button
                                  onClick={cancelEdit}
                                  className="p-1 rounded hover:bg-white/20 transition-colors"
                                  title="Cancel editing"
                                >
                                  <XIcon className="w-4 h-4 text-gray-600" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => startEdit(entry)}
                                  className="p-1 rounded hover:bg-white/20 transition-colors"
                                  title="Edit entry"
                                >
                                  <Edit2 className="w-4 h-4 text-[#6A5ACD]" />
                                </button>
                                <button
                                  onClick={() => confirmDelete(entry.id)}
                                  className="p-1 rounded hover:bg-white/20 transition-colors"
                                  title="Delete entry"
                                >
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>

                        {editingId === entry.id ? (
                          <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="w-full p-2 text-[#4B0082] bg-white/50 border border-[#9370DB]/30 rounded resize-none focus:outline-none focus:ring-2 focus:ring-[#9370DB] text-sm"
                            rows={3}
                            autoFocus
                          />
                        ) : (
                          <p className="text-[#4B0082] leading-relaxed text-sm mb-3">{entry.text}</p>
                        )}

                        <div className="flex justify-end">
                          <Heart className="w-4 h-4 text-[#9370DB]" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center space-x-4">
                    <Button
                      onClick={prevPage}
                      disabled={currentPage === 0}
                      variant="outline"
                      size="sm"
                      className="border-[#9370DB]/30 text-[#6A5ACD] hover:bg-[#9370DB]/10 disabled:opacity-50 bg-transparent"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Previous
                    </Button>

                    <div className="flex space-x-2">
                      {Array.from({ length: totalPages }, (_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i)}
                          className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                            i === currentPage
                              ? "bg-[#9370DB] text-white"
                              : "bg-white/50 text-[#6A5ACD] hover:bg-[#9370DB]/20"
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>

                    <Button
                      onClick={nextPage}
                      disabled={currentPage === totalPages - 1}
                      variant="outline"
                      size="sm"
                      className="border-[#9370DB]/30 text-[#6A5ACD] hover:bg-[#9370DB]/10 disabled:opacity-50 bg-transparent"
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 bg-gradient-to-r from-[#E6E6FA] to-[#F0E6FF] border-t border-[#9370DB]/20">
            <div className="text-center">
              <p className="text-[#6A5ACD] text-sm mb-4">"Gratitude turns what we have into enough" - Anonymous</p>
              <Button
                onClick={onClose}
                className="bg-gradient-to-r from-[#9370DB] to-[#8A2BE2] hover:from-[#8A2BE2] hover:to-[#9370DB] text-white"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Close
              </Button>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-4 left-4 w-2 h-2 bg-[#DDA0DD]/40 rounded-full"></div>
          <div className="absolute top-12 right-12 w-1 h-1 bg-[#9370DB]/40 rounded-full"></div>
          <div className="absolute bottom-8 left-12 w-1.5 h-1.5 bg-[#E6E6FA]/60 rounded-full"></div>
        </CardContent>
      </Card>

      {deleteConfirmId && (
        <div className="absolute inset-0 z-10 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={cancelDelete}></div>
          <Card className="relative bg-white border-[#9370DB]/30 shadow-xl">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-medium text-[#4B0082] mb-4">Delete Gratitude Entry?</h3>
              <p className="text-[#6A5ACD] mb-6">This action cannot be undone.</p>
              <div className="flex space-x-3 justify-center">
                <Button
                  onClick={cancelDelete}
                  variant="outline"
                  className="border-[#9370DB]/30 text-[#6A5ACD] hover:bg-[#9370DB]/10 bg-transparent"
                >
                  Cancel
                </Button>
                <Button onClick={executeDelete} className="bg-red-500 hover:bg-red-600 text-white">
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
