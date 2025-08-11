import { Button } from "./components/ui/button"
import { Card, CardContent } from "./components/ui/card"
import { BookOpen, Heart, CheckSquare, Wind, Camera, Music, Menu, Sparkles } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "./components/ui/sheet"
import { Link, Routes, Route } from "react-router-dom" // Import Link, Routes, Route
import FeatureDetailPage from "./pages/FeatureDetailPage" // Import FeatureDetailPage
import "./App.css" // Import the minimal CSS file
import JournalingPage from "./pages/JournalingPage" // Import JournalingPage
import HabitTrackerPage from "./pages/HabitTrackerPage" // Import HabitTrackerPage

// Main component for the landing page content
function HomePage() {
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
    },
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
            <a href="#features" className="text-[#486856] hover:text-[#D6CBBF] transition-colors">
              {" "}
              {/* sage-dark, cream-warm */}
              Features
            </a>
            <a href="#about" className="text-[#486856] hover:text-[#D6CBBF] transition-colors">
              {" "}
              {/* sage-dark, cream-warm */}
              About
            </a>
            <a href="#contact" className="text-[#486856] hover:text-[#D6CBBF] transition-colors">
              {" "}
              {/* sage-dark, cream-warm */}
              Contact
            </a>
            <Button className="bg-[#97B3AE] hover:bg-[#D6CBBF] text-white border-none">Get Started</Button>{" "}
            {/* sage, cream-warm */}
          </div>
          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-[#97B3AE]">
                {" "}
                {/* sage */}
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-[#F0EEEA]">
              {" "}
              {/* cream */}
              <div className="flex flex-col space-y-6 mt-8">
                <a href="#features" className="text-[#97B3AE] text-lg">
                  {" "}
                  {/* sage */}
                  Features
                </a>
                <a href="#about" className="text-[#97B3AE] text-lg">
                  {" "}
                  {/* sage */}
                  About
                </a>
                <a href="#contact" className="text-[#97B3AE] text-lg">
                  {" "}
                  {/* sage */}
                  Contact
                </a>
                <Button className="bg-[#97B3AE] hover:bg-[#D6CBBF] text-white">Get Started</Button>{" "}
                {/* sage, cream-warm */}
              </div>
            </SheetContent>
          </Sheet>
        </nav>
        {/* Hero Section */}
        <section className="text-center py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-light text-[black] mb-6 leading-tight">
              {" "}
              {/* sage-dark */}
              Your Journey to
              <span className="block text-[#90745b]">Inner Peace</span> {/* Reverted to cream-warm */}
            </h1>
            <p className="text-xl text-[#769121] mb-12 max-w-2xl mx-auto leading-relaxed">
              {" "}
              {/* sage-dark */}
              Discover tranquility through mindful practices, gentle habits, and moments of gratitude. Welly is your
              companion for a more peaceful, centered life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-[#97B3AE] hover:bg-[#D6CBBF] text-white px-8 py-4 text-lg">
                {" "}
                {/* sage, cream-warm */}
                Begin Your Journey
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-[#97B3AE] text-[#97B3AE] hover:bg-[#97B3AE] hover:text-white px-8 py-4 text-lg bg-transparent"
              >
                {" "}
                {/* sage, sage */}
                Learn More
              </Button>
            </div>
          </div>
        </section>
        {/* Features Section */}
        <section
          id="features"
          className={`py-20 px-6`} // Removed conditional opacity classes
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-light text-[black] mb-4">Wellness Features</h2> {/* sage-dark */}
              <p className="text-lg text-[#6B8E7A] max-w-2xl mx-auto">
                {" "}
                {/* sage-medium */}
                Explore our thoughtfully designed tools to support your mental health and wellbeing journey
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className={`border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer rounded-2xl ${feature.color}`}
                >
                  <CardContent className="p-6 h-full flex flex-col items-center text-center space-y-4 group-hover:scale-105 transition-transform duration-300">
                    <div className="w-10 h-8 bg-white/40 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <feature.icon className="w-8 h-8 text-[#97B3AE]" /> {/* sage */}
                    </div>
                    <h3 className="text-xl font-semibold text-[#486856]">{feature.title}</h3> {/* sage-dark */}
                    <p className="text-[#486856] leading-relaxed">{feature.description}</p> {/* sage-dark */}
                    {feature.slug === "journaling" ? (
                      <Link to={`/journaling`}>
                        <Button variant="ghost" className="text-[#486856] hover:bg-white/20 mt-4">
                          {" "}
                          {/* sage-dark */}
                          Explore →
                        </Button>
                      </Link>
                    ) : feature.slug === "habittracker" ? (
                      <Link to={`/habits`}>
                        <Button variant="ghost" className="text-[#486856] hover:bg-white/20 mt-4">
                          {" "}
                          {/* sage-dark */}
                          Explore →
                        </Button>
                      </Link>
                    ) : (
                      <Button variant="ghost" className="text-[#486856] hover:bg-white/20 mt-4" disabled>
                        {" "}
                        {/* sage-dark */}
                        Coming Soon →
                      </Button>
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
                {" "}
                {/* sage-dark */}
                Ready to Start Your Wellness Journey?
              </h2>
              <p className="text-lg text-[#97B3AE] mb-8 max-w-2xl mx-auto">
                {" "}
                {/* sage */}
                Join thousands who have found peace and balance through mindful daily practices
              </p>
              <Button size="lg" className="bg-[#97B3AE] hover:bg-[#D6CBBF] text-white px-12 py-4 text-lg">
                {" "}
                {/* sage, cream-warm */}
                Get Started Today
              </Button>
            </div>
          </div>
        </section>
        {/* Footer */}
        <footer className="py-12 px-6 border-t border-[#97B3AE]/40">
          {" "}
          {/* sage/40 */}
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-gradient-to-br from-[#97B3AE] to-[#D2E0D3] rounded-full flex items-center justify-center">
                {/* sage to sage-light */}
                <Sparkles className="w-3 h-3 text-white" />
              </div>
              <span className="text-xl font-bold text-[#97B3AE]">Welly</span> {/* sage */}
            </div>
            <div className="flex space-x-6 text-[#97B3AE]">
              {" "}
              {/* sage */}
              <a href="#" className="hover:text-[#97B3AE] transition-colors">
                {" "}
                {/* sage */}
                Privacy
              </a>
              <a href="#" className="hover:text-[#97B3AE] transition-colors">
                {" "}
                {/* sage */}
                Terms
              </a>
              <a href="#" className="hover:text-[#97B3AE] transition-colors">
                {" "}
                {/* sage */}
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
      <Route path="/features/:featureName" element={<FeatureDetailPage />} />
      <Route path="/journaling" element={<JournalingPage />} /> {/* Add journaling route */}
      <Route path="/habits" element={<HabitTrackerPage />} /> {/* Add habit tracker route */}
    </Routes>
  )
}
