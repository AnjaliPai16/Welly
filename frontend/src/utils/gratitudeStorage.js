// Utility functions for gratitude data persistence

const STORAGE_KEY = "gratitudeEntries"
const STORAGE_VERSION = "1.0"
const VERSION_KEY = "gratitudeStorageVersion"

// Error handling wrapper for localStorage operations
const safeLocalStorage = {
  getItem: (key) => {
    try {
      return localStorage.getItem(key)
    } catch (error) {
      console.error("Error reading from localStorage:", error)
      return null
    }
  },
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value)
      return true
    } catch (error) {
      console.error("Error writing to localStorage:", error)
      return false
    }
  },
  removeItem: (key) => {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error("Error removing from localStorage:", error)
      return false
    }
  },
}

// Validate gratitude entry structure
const validateEntry = (entry) => {
  if (!entry || typeof entry !== "object") return false
  if (!entry.text || typeof entry.text !== "string" || entry.text.trim().length === 0) return false
  if (!entry.date || !entry.id) return false
  return true
}

// Load gratitude entries from localStorage
export const loadGratitudeEntries = () => {
  try {
    const savedEntries = safeLocalStorage.getItem(STORAGE_KEY)
    const version = safeLocalStorage.getItem(VERSION_KEY)

    if (!savedEntries) {
      // Initialize storage version for new users
      safeLocalStorage.setItem(VERSION_KEY, STORAGE_VERSION)
      return []
    }

    const entries = JSON.parse(savedEntries)

    // Validate entries array
    if (!Array.isArray(entries)) {
      console.warn("Invalid gratitude entries format, resetting...")
      return []
    }

    // Filter out invalid entries and sort by date (newest first)
    const validEntries = entries.filter(validateEntry).sort((a, b) => new Date(b.date) - new Date(a.date))

    // Update version if needed
    if (version !== STORAGE_VERSION) {
      safeLocalStorage.setItem(VERSION_KEY, STORAGE_VERSION)
    }

    return validEntries
  } catch (error) {
    console.error("Error loading gratitude entries:", error)
    return []
  }
}

// Save gratitude entries to localStorage
export const saveGratitudeEntries = (entries) => {
  try {
    if (!Array.isArray(entries)) {
      console.error("Invalid entries format for saving")
      return false
    }

    // Validate and clean entries before saving
    const validEntries = entries.filter(validateEntry)

    const success = safeLocalStorage.setItem(STORAGE_KEY, JSON.stringify(validEntries))
    if (success) {
      safeLocalStorage.setItem(VERSION_KEY, STORAGE_VERSION)
    }

    return success
  } catch (error) {
    console.error("Error saving gratitude entries:", error)
    return false
  }
}

// Add a new gratitude entry
export const addGratitudeEntry = (text) => {
  try {
    const newEntry = {
      id: Date.now() + Math.random(), // More unique ID
      text: text.trim(),
      date: new Date().toISOString(),
      dateString: new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      createdAt: Date.now(),
    }

    if (!validateEntry(newEntry)) {
      throw new Error("Invalid entry data")
    }

    const existingEntries = loadGratitudeEntries()
    const updatedEntries = [newEntry, ...existingEntries]

    const success = saveGratitudeEntries(updatedEntries)
    return success ? newEntry : null
  } catch (error) {
    console.error("Error adding gratitude entry:", error)
    return null
  }
}

// Update a gratitude entry by ID
export const updateGratitudeEntry = (entryId, newText) => {
  try {
    if (!newText || typeof newText !== "string" || newText.trim().length === 0) {
      throw new Error("Invalid text for update")
    }

    const existingEntries = loadGratitudeEntries()
    const updatedEntries = existingEntries.map((entry) => {
      if (entry.id === entryId) {
        return {
          ...entry,
          text: newText.trim(),
          updatedAt: Date.now(),
        }
      }
      return entry
    })

    return saveGratitudeEntries(updatedEntries)
  } catch (error) {
    console.error("Error updating gratitude entry:", error)
    return false
  }
}

// Delete a gratitude entry by ID
export const deleteGratitudeEntry = (entryId) => {
  try {
    const existingEntries = loadGratitudeEntries()
    const updatedEntries = existingEntries.filter((entry) => entry.id !== entryId)

    return saveGratitudeEntries(updatedEntries)
  } catch (error) {
    console.error("Error deleting gratitude entry:", error)
    return false
  }
}

// Get entries for a specific date
export const getEntriesForDate = (date) => {
  try {
    const entries = loadGratitudeEntries()
    const targetDate = new Date(date).toDateString()

    return entries.filter((entry) => new Date(entry.date).toDateString() === targetDate)
  } catch (error) {
    console.error("Error getting entries for date:", error)
    return []
  }
}

// Check if user has added gratitude today
export const hasAddedToday = () => {
  try {
    const today = new Date().toDateString()
    const entries = loadGratitudeEntries()

    return entries.some((entry) => new Date(entry.date).toDateString() === today)
  } catch (error) {
    console.error("Error checking today's entries:", error)
    return false
  }
}

// Export gratitude data for backup
export const exportGratitudeData = () => {
  try {
    const entries = loadGratitudeEntries()
    const exportData = {
      version: STORAGE_VERSION,
      exportDate: new Date().toISOString(),
      totalEntries: entries.length,
      entries: entries,
    }

    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })

    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `gratitude-backup-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    return true
  } catch (error) {
    console.error("Error exporting gratitude data:", error)
    return false
  }
}

// Import gratitude data from backup
export const importGratitudeData = (file) => {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importData = JSON.parse(e.target.result)

          if (!importData.entries || !Array.isArray(importData.entries)) {
            throw new Error("Invalid backup file format")
          }

          const validEntries = importData.entries.filter(validateEntry)
          const existingEntries = loadGratitudeEntries()

          // Merge entries, avoiding duplicates based on text and date
          const mergedEntries = [...existingEntries]
          validEntries.forEach((newEntry) => {
            const isDuplicate = existingEntries.some(
              (existing) =>
                existing.text === newEntry.text &&
                new Date(existing.date).toDateString() === new Date(newEntry.date).toDateString(),
            )
            if (!isDuplicate) {
              mergedEntries.push(newEntry)
            }
          })

          const success = saveGratitudeEntries(mergedEntries)
          resolve({ success, importedCount: validEntries.length, totalCount: mergedEntries.length })
        } catch (parseError) {
          reject(new Error("Invalid backup file format"))
        }
      }
      reader.onerror = () => reject(new Error("Error reading backup file"))
      reader.readAsText(file)
    } catch (error) {
      reject(error)
    }
  })
}

// Get gratitude statistics
export const getGratitudeStats = () => {
  try {
    const entries = loadGratitudeEntries()
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const recentEntries = entries.filter((entry) => new Date(entry.date) >= thirtyDaysAgo)
    const weeklyEntries = entries.filter((entry) => new Date(entry.date) >= sevenDaysAgo)

    return {
      totalEntries: entries.length,
      thisMonth: recentEntries.length,
      thisWeek: weeklyEntries.length,
      longestStreak: calculateLongestStreak(entries),
      currentStreak: calculateCurrentStreak(entries),
      averageLength:
        entries.length > 0
          ? Math.round(entries.reduce((sum, entry) => sum + entry.text.length, 0) / entries.length)
          : 0,
    }
  } catch (error) {
    console.error("Error calculating gratitude stats:", error)
    return {
      totalEntries: 0,
      thisMonth: 0,
      thisWeek: 0,
      longestStreak: 0,
      currentStreak: 0,
      averageLength: 0,
    }
  }
}

// Calculate longest streak of consecutive days
const calculateLongestStreak = (entries) => {
  if (entries.length === 0) return 0

  const dates = [...new Set(entries.map((entry) => new Date(entry.date).toDateString()))].sort(
    (a, b) => new Date(a) - new Date(b),
  )

  let longestStreak = 1
  let currentStreak = 1

  for (let i = 1; i < dates.length; i++) {
    const prevDate = new Date(dates[i - 1])
    const currentDate = new Date(dates[i])
    const diffTime = currentDate - prevDate
    const diffDays = diffTime / (1000 * 60 * 60 * 24)

    if (diffDays === 1) {
      currentStreak++
      longestStreak = Math.max(longestStreak, currentStreak)
    } else {
      currentStreak = 1
    }
  }

  return longestStreak
}

// Calculate current streak from today backwards
const calculateCurrentStreak = (entries) => {
  if (entries.length === 0) return 0

  const dates = [...new Set(entries.map((entry) => new Date(entry.date).toDateString()))].sort(
    (a, b) => new Date(b) - new Date(a),
  )

  const today = new Date().toDateString()
  let streak = 0
  const checkDate = new Date()

  for (let i = 0; i < dates.length; i++) {
    const entryDate = checkDate.toDateString()
    if (dates.includes(entryDate)) {
      streak++
      checkDate.setDate(checkDate.getDate() - 1)
    } else {
      break
    }
  }

  return streak
}

// Clear all gratitude data (with confirmation)
export const clearAllGratitudeData = () => {
  try {
    const success = safeLocalStorage.removeItem(STORAGE_KEY)
    if (success) {
      safeLocalStorage.removeItem(VERSION_KEY)
    }
    return success
  } catch (error) {
    console.error("Error clearing gratitude data:", error)
    return false
  }
}
