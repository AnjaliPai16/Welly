"use client"

import { useState, useEffect } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Sparkles, Menu, Plus, Calendar, CheckCircle2, Circle, BarChart3, Trash2 } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet"
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
  const getCurrentDate = () => {
    const today = new Date()
    return today.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
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
  const showGeneralStats = () => {
    setSelectedHabitForStats(null)
    setShowStatsModal(true)
  }


  return (
    <div className="min-h-screen">
      <nav className="flex items-center justify-between p-6 lg:px-12 backdrop-blur-sm shadow-sm bg-gradient-to-r from-[#A8C8EC] to-[#B8D4F0]">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-[#2C5282] to-[#4A90E2] rounded-full flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-2xl font-bold text-[#2C5282]">Welly</span>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-[#2C5282] hover:text-[#4A90E2] transition-colors">
            Home
          </Link>
          <Link to="/journaling" className="text-[#2C5282] hover:text-[#4A90E2] transition-colors">
            Journal
          </Link>
          <Link to="/gratitude" className="text-[#2C5282] hover:text-[#4A90E2] transition-colors">
            Gratitude
        </Link>
        <Button className="bg-[#2C5282] hover:bg-[#4A90E2] text-white border-none">Get Started</Button>
      </div>
      <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden text-[#2C5282]">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent className="bg-[#B8D4F0]">
            <div className="flex flex-col space-y-6 mt-8">
              <Link to="/" className="text-[#2C5282] text-lg">
                Home
              </Link>
              <Link to="/journaling" className="text-[#2C5282] text-lg">
                Journal
              </Link>
              <Link to="/gratitude" className="text-[#2C5282] text-lg">
                Gratitude
              </Link>
              <Button className="bg-[#2C5282] hover:bg-[#4A90E2] text-white">Get Started</Button>
            </div>
          </SheetContent>
        </Sheet>
      </nav>

      <div
        className="min-h-[calc(100vh-80px)] relative"
        style={{
          backgroundImage: "url(/h1.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-white/20 backdrop-blur-[0.5px]"></div>
        <div className="relative z-10">
          
          <div className="px-4 mb-6 pt-6">
            <div className="text-center">
              <p className="text-[#2C5282] text-lg font-medium">{getCurrentDate()}</p>
            </div>
          </div>


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

            <Button
              onClick={showGeneralStats}
              variant="ghost"
              size="icon"
              className="text-[#4A90E2] bg-[#4A90E2]/10 rounded-full w-12 h-12"
            >
              <Calendar className="w-6 h-6" />
            </Button>
            <Button
              onClick={handleCreateHabit}
              className="bg-[#4A90E2] hover:bg-[#3A7BC8] text-white rounded-full w-16 h-16 shadow-lg"
            >
              <Plus className="w-8 h-8" />
            </Button>

            <Button
              onClick={showGeneralStats}
              variant="ghost"
              size="icon"
              className="text-[#4A90E2] bg-[#4A90E2]/10 rounded-full w-12 h-12"
            >
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
