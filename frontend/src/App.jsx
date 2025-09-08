import { Button } from "./components/ui/button"
import { Card, CardContent } from "./components/ui/card"
import { BookOpen, Heart, CheckSquare, Wind, Camera, Music, Menu, Sparkles } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "./components/ui/sheet"
import { Link, Routes, Route } from "react-router-dom"

import "./App.css"
import JournalingPage from "./pages/JournalingPage"
import HabitTrackerPage from "./pages/HabitTrackerPage"
import GratitudePage from "./pages/GratitudePage"
import MemoryLanePage from "./pages/MemoryLanePage"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import CalmingPlaylistPage from "./pages/CalmingPlaylistPage"
import ChatWithWelly from "./pages/ChatWithWelly";
import BreathingMeditationPage from "./pages/BreathingMeditationPage"
import AboutPage from "./pages/AboutPage"
import ContactPage from "./pages/ContactPage"
import ProtectedRoute from "./components/ProtectedRoute"
import { useAuth } from "./contexts/AuthContext"

// Function to handle smooth scrolling to features section
const scrollToFeatures = () => {
  const featuresSection = document.getElementById('features');
  if (featuresSection) {
    featuresSection.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  }
};

// Main component for the landing page content
function HomePage() {
  const { isAuthenticated, user, logout } = useAuth()
  const features = [
    {
      icon: BookOpen,
      title: "Journaling",
      description: "Express your thoughts and feelings in a safe, private space",
      color: "bg-gradient-to-br from-[#D2E0D3] to-[#F0EEEA]", // sage-light to cream
      slug: "journaling", // Add a slug for the URL
    },
    {
      icon: Heart,
      title: "Gratitude Check",
      description: "Cultivate appreciation and positive mindset daily",
      color: "bg-gradient-to-br from-[#F2C3B9] to-[#F0DDD6]", // peach to peach-light
      slug: "gratitudecheck", // Add a slug for the URL
    },
    {
      icon: CheckSquare,
      title: "Habit Tracker",
      description: "Build healthy routines that nurture your wellbeing",
      color: "bg-gradient-to-br from-[#97B3AE] to-[#D2E0D3]", // sage to sage-light
      slug: "habittracker", // Add a slug for the URL
    },
    {
      icon: Wind,
      title: "Breathing & Meditation",
      description: "Find peace through mindful breathing and meditation",
      color: "bg-gradient-to-br from-[#F0DDD6] to-[#D6CBBF]", // peach-light to cream-warm
      slug: "breathingmeditation", // Add a slug for the URL
    },
    {
      icon: Camera,
      title: "Memory Lane",
      description: "Cherish beautiful moments and create lasting memories",
      color: "bg-gradient-to-br from-[#D6CBBF] to-[#F0EEEA]", // cream-warm to cream
      slug: "memorylane", // Add a slug for the URL
    },
    {
      icon: Music,
      title: "Calming Playlist",
      description: "Soothing sounds to accompany your wellness journey",
      color: "bg-gradient-to-br from-[#F0EEEA] to-[#F2C3B9]", // cream to peach
      slug: "calmingplaylist", // Add a slug for the URL
    }
  ]

  return (
    <div
      className="min-h-screen relative bg-cover bg-repeat bg-center bg-fixed scroll-smooth" // Added scroll-smooth
      style={{ backgroundImage: 'url("bg.jpg")' }}
    >
      {/* Background Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[#F0EEEA]/30" /> {/* cream/30 */}
      {/* Content Container */}
      <div className="relative z-10 pt-20">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-6 lg:px-12 backdrop-blur-sm shadow-sm bg-[#F2C3B9]">
          {/* peach */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#97B3AE] to-[#D2E0D3] rounded-full flex items-center justify-center">
              {/* sage to sage-light */}
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-2xl font-bold text-[#486856]">Welly</span> {/* sage-dark */}
          </div>
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={scrollToFeatures}
              className="text-[#486856] hover:text-[#D6CBBF] transition-colors cursor-pointer"
            >
              Features
            </button>
            <a href="/about" className="text-[#486856] hover:text-[#D6CBBF] transition-colors">
              About
            </a>
            <a href="/contact" className="text-[#486856] hover:text-[#D6CBBF] transition-colors">
              Contact
            </a>
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-[#486856] text-sm">Welcome, {user?.name?.split(' ')[0] || 'User'}!</span>
                <Button 
                  onClick={() => logout()} 
                  className="bg-[#97B3AE] hover:bg-[#D6CBBF] text-white border-none"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Link to="/signup">
                <Button className="bg-[#97B3AE] hover:bg-[#D6CBBF] text-white border-none">Sign Up</Button>
              </Link>
            )}
          </div>
          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-[#97B3AE]">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-[#F0EEEA]">
              <div className="flex flex-col space-y-6 mt-8">
                <button 
                  onClick={scrollToFeatures}
                  className="text-[#97B3AE] text-lg text-left cursor-pointer"
                >
                  Features
                </button>
                <a href="/about" className="text-[#97B3AE] text-lg">
                  About
                </a>
                <a href="/contact" className="text-[#97B3AE] text-lg">
                  Contact
                </a>
                {isAuthenticated ? (
                  <div className="flex flex-col space-y-4">
                    <span className="text-[#97B3AE] text-lg">Welcome, {user?.name?.split(' ')[0] || 'User'}!</span>
                    <Button 
                      onClick={() => logout()} 
                      className="bg-[#97B3AE] hover:bg-[#D6CBBF] text-white"
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Link to="/signup">
                    <Button className="bg-[#97B3AE] hover:bg-[#D6CBBF] text-white">Sign Up</Button>
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </nav>
        {/* Hero Section */}
        <section className="text-center py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-light text-[black] mb-6 leading-tight">
              Your Journey to
              <span className="block text-[#90745b]">Inner Peace</span>
            </h1>
            <p className="text-xl text-[#769121] mb-12 max-w-2xl mx-auto leading-relaxed">
              Discover tranquility through mindful practices, gentle habits, and moments of gratitude. Welly is your
              companion for a more peaceful, centered life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Button 
                  size="lg" 
                  className="bg-[#97B3AE] hover:bg-[#D6CBBF] text-white px-8 py-4 text-lg"
                  onClick={scrollToFeatures}
                >
                  Explore Features
                </Button>
              ) : (
                <Link to="/signup">
                  <Button size="lg" className="bg-[#97B3AE] hover:bg-[#D6CBBF] text-white px-8 py-4 text-lg">
                    Begin Your Journey
                  </Button>
                </Link>
              )}
              <Button
                size="lg"
                variant="outline"
                className="border-[#97B3AE] text-[#97B3AE] hover:bg-[#97B3AE] hover:text-white px-8 py-4 text-lg bg-transparent"
              >
                <a href="/about" >Learn More </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Chat with Welly Featured Section */}
        <section className="py-12 px-6">
          <div className="max-w-4xl mx-auto">
            <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer rounded-2xl bg-gradient-to-r from-[#E0D7F5] to-[#F0EEEA]">
              <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-8 group-hover:scale-[1.02] transition-transform duration-300">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/40 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Sparkles className="w-8 h-8 text-[#97B3AE]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-[#486856] mb-1">Chat with Welly</h3>
                    <p className="text-[#486856] text-lg">Have a safe and supportive conversation with your AI companion</p>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  {isAuthenticated ? (
                    <Link to="/chat">
                      <Button size="lg" className="bg-[#97B3AE] hover:bg-[#D6CBBF] text-white px-8 py-3 text-lg">
                        Start Chatting →
                      </Button>
                    </Link>
                  ) : (
                    <div className="flex space-x-3">
                      <Link to="/login">
                        <Button size="lg" variant="outline" className="border-[#97B3AE] text-[#97B3AE] hover:bg-[#97B3AE] hover:text-white px-6 py-3">
                          Login
                        </Button>
                      </Link>
                      <Link to="/signup">
                        <Button size="lg" className="bg-[#97B3AE] hover:bg-[#D6CBBF] text-white px-6 py-3">
                          Sign Up
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-light text-[black] mb-4">Wellness Features</h2>
              <p className="text-lg text-[#6B8E7A] max-w-2xl mx-auto">Explore our thoughtfully designed tools</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className={`border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer rounded-2xl ${feature.color}`}
                >
                  <CardContent className="p-6 h-full flex flex-col items-center text-center space-y-4 group-hover:scale-105 transition-transform duration-300">
                    <div className="w-10 h-8 bg-white/40 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <feature.icon className="w-8 h-8 text-[#97B3AE]" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#486856]">{feature.title}</h3>
                    <p className="text-[#486856] leading-relaxed">{feature.description}</p>

                    {isAuthenticated ? (
                      // Show actual links for authenticated users
                      feature.slug === "journaling" ? (
                        <Link to={`/journaling`}>
                          <Button variant="ghost" className="text-[#486856] hover:bg-white/20 mt-4">
                            Explore →
                          </Button>
                        </Link>
                      ) : feature.slug === "habittracker" ? (
                        <Link to={`/habits`}>
                          <Button variant="ghost" className="text-[#486856] hover:bg-white/20 mt-4">
                            Explore →
                          </Button>
                        </Link>
                      ) : feature.slug === "gratitudecheck" ? (
                        <Link to={`/gratitude`}>
                          <Button variant="ghost" className="text-[#486856] hover:bg-white/20 mt-4">
                            Explore →
                          </Button>
                        </Link>
                      ) : feature.slug === "memorylane" ? (
                        <Link to={`/memory`}>
                          <Button variant="ghost" className="text-[#486856] hover:bg-white/20 mt-4">
                            Explore →
                          </Button>
                        </Link>
                      ) : feature.slug === "calmingplaylist" ? (
                        <Link to={`/playlist`}>
                          <Button variant="ghost" className="text-[#486856] hover:bg-white/20 mt-4">
                            Explore →
                          </Button>
                        </Link>
                      ) : feature.slug === "breathingmeditation" ? (
                        <Link to={'/breathing'}>
                          <Button variant="ghost" className="text-[#486856] hover:bg-white/20 mt-4">
                            Explore →
                          </Button>
                        </Link>
                      ): (
                        
                        <Button variant="ghost" className="text-[#486856] hover:bg-white/20 mt-4" disabled>
                          Coming Soon →
                        </Button>
                      )
                    ) : (
                      // Show login/signup prompts for unauthenticated users
                      <div className="flex flex-col space-y-2 mt-4">
                        <p className="text-sm text-[#486856] opacity-75">Sign in to access this feature</p>
                        <div className="flex space-x-2">
                          <Link to="/login">
                            <Button size="sm" variant="ghost" className="text-[#486856] hover:bg-white/20">
                              Login
                            </Button>
                          </Link>
                          <Link to="/signup">
                            <Button size="sm" variant="ghost" className="text-[#486856] hover:bg-white/20">
                              Sign Up
                            </Button>
                          </Link>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        {/* Call to Action */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-12 shadow-lg">
              <h2 className="text-3xl md:text-4xl font-light text-[#486856] mb-6">
                Ready to Start Your Wellness Journey?
              </h2>
              <p className="text-lg text-[#97B3AE] mb-8 max-w-2xl mx-auto">
                Join thousands who have found peace and balance through mindful daily practices
              </p>
              <Button 
                size="lg" 
                className="bg-[#97B3AE] hover:bg-[#D6CBBF] text-white px-12 py-4 text-lg"
                onClick={scrollToFeatures}
              >
                Get Started Today
              </Button>
            </div>
          </div>
        </section>
        {/* Footer */}
        <footer className="py-12 px-6 border-t border-[#97B3AE]/40">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-gradient-to-br from-[#97B3AE] to-[#D2E0D3] rounded-full flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
              <span className="text-xl font-bold text-[#97B3AE]">Welly</span>
            </div>
            <div className="flex space-x-6 text-[#97B3AE]">
              <a href="#" className="hover:text-[#97B3AE] transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-[#97B3AE] transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-[#97B3AE] transition-colors">
                Support
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
 
      <Route path="/journaling" element={
        <ProtectedRoute>
          <JournalingPage />
        </ProtectedRoute>
      } />
      <Route path="/habits" element={
        <ProtectedRoute>
          <HabitTrackerPage />
        </ProtectedRoute>
      } />
      <Route path="/gratitude" element={
        <ProtectedRoute>
          <GratitudePage />
        </ProtectedRoute>
      } />
      <Route path="/memory" element={
        <ProtectedRoute>
          <MemoryLanePage />
        </ProtectedRoute>
      } />
      <Route path="/playlist" element={
        <ProtectedRoute>
          <CalmingPlaylistPage />
        </ProtectedRoute>
      } />
      <Route path="/breathing" element={
        <ProtectedRoute>
          <BreathingMeditationPage />
        </ProtectedRoute>
      } />
      <Route path="/chat" element={
  <ProtectedRoute>
    <ChatWithWelly />
  </ProtectedRoute>
} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/contact" element={<ContactPage />} />
    </Routes>
  )
}