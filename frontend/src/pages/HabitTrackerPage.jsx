"use client"

import { useState, useEffect } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { ArrowLeft, Plus, MoreHorizontal, Calendar, CheckCircle2, Circle, BarChart3, Trash2 } from "lucide-react"
import { Link } from "react-router-dom"
import CreateHabitModal from "../components/ui/CreateHabitModal"
import MonthlyStatsModal from "../components/ui/MonthlyStatsModal"

const HabitTrackerPage = () => {
  const [habits, setHabits] = useState([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showStatsModal, setShowStatsModal] = useState(false)
  const [selectedHabitForStats, setSelectedHabitForStats] = useState(null)

  // Load habits from localStorage on component mount
  useEffect(() => {
    const savedHabits = localStorage.getItem("habits")
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits))
    }
  }, [])

  // Save habits to localStorage whenever habits change
  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits))
  }, [habits])

  // Get current week days
  const getCurrentWeekDays = () => {
    const today = new Date()
    const currentDay = today.getDay()
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - currentDay)

    const weekDays = []
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      weekDays.push({
        date: day,
        dayName: day.toLocaleDateString("en-US", { weekday: "short" }).charAt(0),
        dayNumber: day.getDate(),
        isToday: day.toDateString() === today.toDateString(),
      })
    }
    return weekDays
  }

  const weekDays = getCurrentWeekDays()

  const handleCreateHabit = () => {
    setShowCreateModal(true)
  }

  const handleSaveHabit = (habitData) => {
    setHabits((prev) => [habitData, ...prev])
    setShowCreateModal(false)
  }

  // Added function to delete a habit
  const deleteHabit = (habitId) => {
    setHabits((prev) => prev.filter((habit) => habit.id !== habitId))
  }

  const toggleHabitCompletion = (habitId) => {
    const today = new Date().toDateString()
    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id === habitId) {
          const completedDates = habit.completedDates || []
          const isCompleted = completedDates.includes(today)

          return {
            ...habit,
            completedDates: isCompleted ? completedDates.filter((date) => date !== today) : [...completedDates, today],
          }
        }
        return habit
      }),
    )
  }

  const isHabitCompletedToday = (habit) => {
    const today = new Date().toDateString()
    return habit.completedDates?.includes(today) || false
  }

  // Added function to show stats for a specific habit
  const showHabitStats = (habit) => {
    setSelectedHabitForStats(habit)
    setShowStatsModal(true)
  }

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-br from-[#A8C8EC] via-[#B8D4F0] to-[#C8E0F4] flex items-center justify-between p-4 pt-12 relative z-10">
        <Link to="/">
          <Button variant="ghost" size="icon" className="text-[#2C5282]">
            <ArrowLeft className="w-6 h-6" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold text-[#2C5282]">Habits</h1>
        <Button variant="ghost" size="icon" className="text-[#2C5282]">
          <MoreHorizontal className="w-6 h-6" />
        </Button>
      </div>

      <div
        className="min-h-[calc(100vh-80px)] relative"
        style={{
          backgroundImage: "url(/habit1.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-white/20 backdrop-blur-[0.5px]"></div>
        <div className="relative z-10">
          <div className="px-4 mb-6 pt-6"></div>

          <div className="px-4 mb-6">
            <div className="flex justify-center space-x-2">
              {weekDays.map((day, index) => (
                <div
                  key={index}
                  className={`flex flex-col items-center p-3 rounded-xl min-w-[50px] ${
                    day.isToday ? "bg-[#4A90E2] text-white shadow-lg" : "bg-white/50 text-[#2C5282]"
                  }`}
                >
                  <span className="text-sm font-medium">{day.dayName}</span>
                  <span className="text-lg font-semibold">{day.dayNumber}</span>
                  {day.isToday && <div className="w-1 h-1 bg-white rounded-full mt-1"></div>}
                </div>
              ))}
            </div>
          </div>

          <div className="px-4 mb-4">
            <h2 className="text-2xl font-light text-[#2C5282] mb-4">Habits to Do</h2>

            {habits.length === 0 ? (
              <div className="text-center py-12">
                <Circle className="w-16 h-16 text-[#4A90E2] mx-auto mb-4 opacity-50" />
                <p className="text-[#4A90E2] text-lg">No habits yet</p>
                <p className="text-[#4A90E2]/70 text-sm">Tap the + button to create your first habit</p>
              </div>
            ) : (
              <div className="space-y-4">
                {habits.map((habit) => {
                  const isCompleted = isHabitCompletedToday(habit)
                  return (
                    <Card key={habit.id} className="bg-white/70 backdrop-blur-sm border-none shadow-md">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div
                              className="w-12 h-12 rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
                              style={{ backgroundColor: habit.color }}
                              onClick={() => showHabitStats(habit)}
                            >
                              <span className="text-white text-lg">{habit.icon}</span>
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-[#2C5282]">{habit.name}</h3>
                              <div className="flex items-center space-x-2 text-sm text-[#4A90E2]">
                                <Calendar className="w-4 h-4" />
                                <span>{habit.frequency || "Daily"}</span>
                              </div>
                              <p className="text-sm text-[#4A90E2]/70">
                                {habit.goalCount}/{habit.goalCount} {habit.goalUnit}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              onClick={() => deleteHabit(habit.id)}
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => toggleHabitCompletion(habit.id)}
                              className={`rounded-full px-6 py-2 ${
                                isCompleted
                                  ? "bg-green-500 hover:bg-green-600 text-white"
                                  : "bg-[#4A90E2] hover:bg-[#3A7BC8] text-white border-2 border-[#4A90E2]"
                              }`}
                            >
                              {isCompleted ? (
                                <>
                                  <CheckCircle2 className="w-4 h-4 mr-1" />
                                  Finished
                                </>
                              ) : (
                                "Finish"
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-[#4A90E2]/20">
        <div className="flex items-center justify-center py-4">
          <div className="flex items-center space-x-8">
            <Button variant="ghost" size="icon" className="text-[#4A90E2] bg-[#4A90E2]/10 rounded-full w-12 h-12">
              <Calendar className="w-6 h-6" />
            </Button>
            <Button
              onClick={handleCreateHabit}
              className="bg-[#4A90E2] hover:bg-[#3A7BC8] text-white rounded-full w-16 h-16 shadow-lg"
            >
              <Plus className="w-8 h-8" />
            </Button>
            <Button variant="ghost" size="icon" className="text-[#4A90E2] bg-[#4A90E2]/10 rounded-full w-12 h-12">
              <BarChart3 className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>

      <CreateHabitModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} onSave={handleSaveHabit} />

      {/* Added MonthlyStatsModal component */}
      <MonthlyStatsModal
        isOpen={showStatsModal}
        onClose={() => setShowStatsModal(false)}
        habits={habits}
        selectedHabit={selectedHabitForStats}
      />
    </div>
  )
}

export default HabitTrackerPage
