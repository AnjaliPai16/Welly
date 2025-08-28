"use client"

import { useState, useEffect } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog"
import { 
  Sparkles, 
  Menu, 
  Plus, 
  Calendar, 
  CheckCircle2, 
  Circle, 
  BarChart3, 
  Trash2,
  Edit,
  Target,
  ArrowLeft,
  ArrowRight
} from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet"
import { habitAPI } from "../services/api"

const HabitTrackerPage = () => {
  const [habits, setHabits] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  
  // Form states
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingHabit, setEditingHabit] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    frequency: "daily",
    icon: "📝",
    color: "#4A90E2",
    goalCount: 1,
    goalUnit: "time"
  })

  // Stats states
  const [stats, setStats] = useState({
    totalHabits: 0,
    activeHabits: 0,
    averageCompletion: 0
  })
  
  // UI states
  const [showCalendar, setShowCalendar] = useState(false)
  const [showStats, setShowStats] = useState(false)

  // Load habits and stats on component mount
  useEffect(() => {
    loadHabits()
    loadStats()
  }, [])

  const loadHabits = async () => {
    setLoading(true)
    setError("")
    
    try {
      const response = await habitAPI.getHabits()
      console.log('Habits response:', response)
      if (response.success) {
        setHabits(response.data)
      } else {
        setError(response.message || 'Failed to load habits')
      }
    } catch (error) {
      setError(error.message || 'Failed to load habits')
      console.error('Error loading habits:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const currentDate = new Date()
      const response = await habitAPI.getStats(
        currentDate.getMonth() + 1,
        currentDate.getFullYear()
      )
      console.log('Stats response:', response)
      if (response.success) {
        const totalHabits = response.data.habits.length
        const activeHabits = response.data.habits.filter(h => h.completionRate > 0).length
        const averageCompletion = totalHabits > 0 
          ? Math.round(response.data.habits.reduce((sum, h) => sum + h.completionRate, 0) / totalHabits)
          : 0

        setStats({
          totalHabits,
          activeHabits,
          averageCompletion
        })
      } else {
        console.error('Failed to load stats:', response.message)
      }
    } catch (error) {
      console.error('Failed to load stats:', error)
    }
  }

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

  const handleInputChange = (e) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }))
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      frequency: "daily",
      icon: "📝",
      color: "#4A90E2",
      goalCount: 1,
      goalUnit: "time"
    })
    setEditingHabit(null)
  }

  const handleCreateHabit = () => {
    resetForm()
    setShowCreateModal(true)
  }

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      setError("Habit name is required")
      return
    }

    setLoading(true)
    setError("")

    try {
      let response
      if (editingHabit) {
        response = await habitAPI.updateHabit(editingHabit._id, formData)
      } else {
        response = await habitAPI.createHabit(formData)
      }

      console.log('Save habit response:', response)

      if (response.success) {
        setShowCreateModal(false)
        resetForm()
        loadHabits()
        loadStats()
      } else {
        setError(response.message || 'Failed to save habit')
      }
    } catch (error) {
      console.error('Error saving habit:', error)
      setError(error.message || 'Failed to save habit')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (habit) => {
    setEditingHabit(habit)
    setFormData({
      name: habit.name || "",
      description: habit.description || "",
      frequency: habit.frequency || "daily",
      icon: habit.icon || "📝",
      color: habit.color || "#4A90E2",
      goalCount: habit.goalCount || 1,
      goalUnit: habit.goalUnit || "time"
    })
    setShowCreateModal(true)
  }

  const deleteHabit = async (habitId) => {
    if (!window.confirm('Are you sure you want to delete this habit?')) {
      return
    }

    try {
      const response = await habitAPI.deleteHabit(habitId)
      if (response.success) {
        loadHabits()
        loadStats()
      }
    } catch (error) {
      setError(error.message || 'Failed to delete habit')
    }
  }

  const toggleHabitCompletion = async (habit) => {
    try {
      const today = new Date().toISOString().split('T')[0]
      const response = await habitAPI.toggleCompletion(habit._id, today)
      if (response.success) {
        loadHabits()
        loadStats()
      }
    } catch (error) {
      setError(error.message || 'Failed to update habit completion')
    }
  }

  const isHabitCompletedToday = (habit) => {
    const today = new Date().toISOString().split('T')[0]
    return habit.completedDates?.includes(today) || false
  }

  const getGoalLabel = (habit) => {
    if (habit.goalUnit === 'time') {
      return `${habit.goalCount} ${habit.goalCount === 1 ? 'time' : 'times'}`
    }
    return `${habit.goalCount} ${habit.goalUnit}`
  }

  const getFrequencyLabel = (frequency) => {
    const labels = {
      'daily': 'Daily',
      'weekly': 'Weekly',
      'monthly': 'Monthly'
    }
    return labels[frequency] || frequency
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
          <a href="/" className="text-[#2C5282] hover:text-[#4A90E2] transition-colors">
            Home
          </a>
          <a href="/journaling" className="text-[#2C5282] hover:text-[#4A90E2] transition-colors">
            Journal
          </a>
          <a href="/gratitude" className="text-[#2C5282] hover:text-[#4A90E2] transition-colors">
            Gratitude
          </a>
          
          <a href="/memory" className="text-[#2C5282] hover:text-[#4A90E2] transition-colors">
            Memory
          </a>
          <a href="/breathing" className="text-[#2C5282] hover:text-[#4A90E2] transition-colors">
            Meditation
          </a>
          <a href="/playlist" className="text-[#2C5282] hover:text-[#4A90E2] transition-colors">
            Playlist
          </a>
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
              <a href="/" className="text-[#2C5282] text-lg">Home</a>
              <a href="/journaling" className="text-[#2C5282] text-lg">Journal</a>
              <a href="/gratitude" className="text-[#2C5282] text-lg">Gratitude</a>
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
          
          {/* Error Display */}
          {error && (
            <div className="mx-4 mt-4 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          
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

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4A90E2] mx-auto"></div>
                <p className="text-[#2C5282] mt-4">Loading habits...</p>
              </div>
            ) : habits.length === 0 ? (
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
                    <Card key={habit._id} className="bg-white/70 backdrop-blur-sm border-none shadow-md">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div
                              className="w-12 h-12 rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
                              style={{ backgroundColor: habit.color }}
                            >
                              <span className="text-white text-lg">{habit.icon}</span>
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-[#2C5282]">{habit.name}</h3>
                              <div className="flex items-center space-x-2 text-sm text-[#4A90E2]">
                                <Calendar className="w-4 h-4" />
                                <span>{getFrequencyLabel(habit.frequency)}</span>
                              </div>
                              <p className="text-sm text-[#4A90E2]/70">
                                Goal: {getGoalLabel(habit)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              onClick={() => handleEdit(habit)}
                              variant="ghost"
                              size="icon"
                              className="text-[#4A90E2] hover:text-[#2C5282] hover:bg-white/50"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => deleteHabit(habit._id)}
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => toggleHabitCompletion(habit)}
                              disabled={loading}
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

      {/* Calendar View */}
      {showCalendar && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-[#4A90E2] to-[#3A7BC8] p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Habit Calendar</h2>
                <Button
                  onClick={() => setShowCalendar(false)}
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                >
                  ✕
                </Button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center font-semibold text-[#2C5282] py-2">
                    {day}
                  </div>
                ))}
                {weekDays.map((day, index) => (
                  <div
                    key={index}
                    className={`text-center py-3 rounded-lg border ${
                      day.isToday
                        ? 'bg-[#4A90E2] text-white border-[#4A90E2]'
                        : 'bg-gray-50 border-gray-200 text-[#2C5282]'
                    }`}
                  >
                    <div className="text-sm font-medium">{day.dayName}</div>
                    <div className="text-lg font-bold">{day.dayNumber}</div>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                {habits.map(habit => (
                  <div key={habit._id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-2xl">{habit.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#2C5282]">{habit.name}</h3>
                      <p className="text-sm text-gray-600">{habit.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-[#4A90E2] font-medium">
                        {habit.completedDates?.length || 0} completed
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats View */}
      {showStats && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-[#4A90E2] to-[#3A7BC8] p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Habit Statistics</h2>
                <Button
                  onClick={() => setShowStats(false)}
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                >
                  ✕
                </Button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-[#4A90E2] to-[#3A7BC8] p-6 rounded-xl text-white">
                  <div className="text-3xl font-bold">{stats.totalHabits}</div>
                  <div className="text-sm opacity-90">Total Habits</div>
                </div>
                <div className="bg-gradient-to-br from-[#10B981] to-[#059669] p-6 rounded-xl text-white">
                  <div className="text-3xl font-bold">{stats.activeHabits}</div>
                  <div className="text-sm opacity-90">Active Habits</div>
                </div>
                <div className="bg-gradient-to-br from-[#F59E0B] to-[#D97706] p-6 rounded-xl text-white">
                  <div className="text-3xl font-bold">{stats.averageCompletion}%</div>
                  <div className="text-sm opacity-90">Avg. Completion</div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-[#2C5282]">Habit Performance</h3>
                {habits.map(habit => {
                  const completionRate = habit.completedDates?.length || 0;
                  const percentage = Math.round((completionRate / 30) * 100);
                  return (
                    <div key={habit._id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{habit.icon}</span>
                          <div>
                            <h4 className="font-semibold text-[#2C5282]">{habit.name}</h4>
                            <p className="text-sm text-gray-600">{habit.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-[#4A90E2]">{percentage}%</div>
                          <div className="text-sm text-gray-600">{completionRate}/30 days</div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-[#4A90E2] to-[#3A7BC8] h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-[#4A90E2]/20 shadow-lg">
        <div className="flex items-center justify-center py-4">
          <div className="flex items-center space-x-8">
            <Button
              onClick={() => setShowCalendar(!showCalendar)}
              variant="ghost"
              size="icon"
              className={`rounded-full w-12 h-12 transition-all duration-200 ${
                showCalendar 
                  ? "bg-[#4A90E2] text-white shadow-lg" 
                  : "text-[#4A90E2] bg-[#4A90E2]/10 hover:bg-[#4A90E2]/20"
              }`}
            >
              <Calendar className="w-6 h-6" />
            </Button>
            <Button
              onClick={handleCreateHabit}
              className="bg-[#4A90E2] hover:bg-[#3A7BC8] text-white rounded-full w-16 h-16 shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <Plus className="w-8 h-8" />
            </Button>
            <Button
              onClick={() => setShowStats(!showStats)}
              variant="ghost"
              size="icon"
              className={`rounded-full w-12 h-12 transition-all duration-200 ${
                showStats 
                  ? "bg-[#4A90E2] text-white shadow-lg" 
                  : "text-[#4A90E2] bg-[#4A90E2]/10 hover:bg-[#4A90E2]/20"
              }`}
            >
              <BarChart3 className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Habit Form Dialog */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] border-2 border-[#4A90E2]/20">
          <DialogHeader className="bg-gradient-to-r from-[#4A90E2] to-[#3A7BC8] -m-6 mb-6 p-6 rounded-t-lg">
            <DialogTitle className="text-2xl font-bold text-white text-center">
              {editingHabit ? 'Edit Habit' : 'Create New Habit'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 px-2">
            {/* Name */}
            <div className="space-y-3">
              <Label htmlFor="name" className="text-[#2C5282] font-semibold text-lg">
                Habit Name *
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., Morning Exercise, Read 30 minutes..."
                value={formData.name}
                onChange={handleInputChange}
                className="border-2 border-[#A8C8EC] focus:border-[#4A90E2] focus:ring-2 focus:ring-[#4A90E2]/20 rounded-xl px-4 py-3 text-lg bg-white shadow-sm"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-3">
              <Label htmlFor="description" className="text-[#2C5282] font-semibold text-lg">
                Description (Optional)
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe your habit..."
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="border-2 border-[#A8C8EC] focus:border-[#4A90E2] focus:ring-2 focus:ring-[#4A90E2]/20 rounded-xl resize-none px-4 py-3 text-lg bg-white shadow-sm"
              />
            </div>

            {/* Frequency */}
            <div className="space-y-3">
              <Label htmlFor="frequency" className="text-[#2C5282] font-semibold text-lg">
                Frequency *
              </Label>
              <select
                id="frequency"
                name="frequency"
                value={formData.frequency}
                onChange={handleInputChange}
                className="w-full border-2 border-[#A8C8EC] focus:border-[#4A90E2] focus:ring-2 focus:ring-[#4A90E2]/20 rounded-xl px-4 py-3 text-lg bg-white shadow-sm"
                required
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            {/* Icon and Color */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="icon" className="text-[#2C5282] font-semibold text-lg">
                  Icon
                </Label>
                <Input
                  id="icon"
                  name="icon"
                  placeholder="📝"
                  value={formData.icon}
                  onChange={handleInputChange}
                  className="border-2 border-[#A8C8EC] focus:border-[#4A90E2] focus:ring-2 focus:ring-[#4A90E2]/20 rounded-xl text-center text-2xl px-4 py-3 bg-white shadow-sm"
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="color" className="text-[#2C5282] font-semibold text-lg">
                  Color
                </Label>
                <Input
                  id="color"
                  name="color"
                  type="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  className="border-2 border-[#A8C8EC] focus:border-[#4A90E2] focus:ring-2 focus:ring-[#4A90E2]/20 rounded-xl h-12 w-full bg-white shadow-sm cursor-pointer"
                />
              </div>
            </div>

            {/* Goal */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="goalCount" className="text-[#2C5282] font-semibold text-lg">
                  Goal Count
                </Label>
                <Input
                  id="goalCount"
                  name="goalCount"
                  type="number"
                  min="1"
                  value={formData.goalCount}
                  onChange={handleInputChange}
                  className="border-2 border-[#A8C8EC] focus:border-[#4A90E2] focus:ring-2 focus:ring-[#4A90E2]/20 rounded-xl px-4 py-3 text-lg bg-white shadow-sm"
                  required
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="goalUnit" className="text-[#2C5282] font-semibold text-lg">
                  Goal Unit
                </Label>
                <select
                  id="goalUnit"
                  name="goalUnit"
                  value={formData.goalUnit}
                  onChange={handleInputChange}
                  className="w-full border-2 border-[#A8C8EC] focus:border-[#4A90E2] focus:ring-2 focus:ring-[#4A90E2]/20 rounded-xl px-4 py-3 text-lg bg-white shadow-sm"
                  required
                >
                  <option value="time">Times</option>
                  <option value="minutes">Minutes</option>
                  <option value="pages">Pages</option>
                  <option value="glasses">Glasses</option>
                  <option value="steps">Steps</option>
                </select>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowCreateModal(false)
                  resetForm()
                }}
                className="flex-1 border-2 border-[#A8C8EC] text-[#2C5282] hover:bg-[#F0F4F8] hover:border-[#4A90E2] rounded-xl py-3 text-lg font-semibold transition-all duration-200"
              >
                Cancel
              </Button>
              <Button
                type="button"
                disabled={loading}
                onClick={handleSubmit}
                className="flex-1 bg-gradient-to-r from-[#4A90E2] to-[#3A7BC8] hover:from-[#3A7BC8] hover:to-[#2C5282] text-white rounded-xl py-3 text-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                {loading ? 'Saving...' : (editingHabit ? 'Update Habit' : 'Create Habit')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default HabitTrackerPage