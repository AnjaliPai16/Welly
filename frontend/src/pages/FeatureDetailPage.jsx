"use client"
import { useParams, Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Sparkles, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet"

export default function FeatureDetailPage() {
  const { featureName } = useParams()

  // You can expand this object with more detailed content for each feature
  const featureDetails = {
    journaling: {
      title: "Deep Dive into Journaling",
      description:
        "Explore advanced techniques and benefits of daily journaling for mental clarity and emotional release.",
      content:
        "Journaling is a powerful tool for self-reflection and personal growth. It allows you to process thoughts, track progress, and gain insights into your inner world. Regular journaling can reduce stress, improve problem-solving skills, and enhance self-awareness. Start by writing freely, without judgment, about your day, your feelings, or any topic that comes to mind. Over time, you'll discover patterns and develop a deeper understanding of yourself.",
      color: "bg-gradient-to-br from-[#D2E0D3] to-[#F0EEEA]", // sage-light to cream
    },
    gratitudecheck: {
      title: "The Power of Gratitude",
      description: "Learn how a daily gratitude practice can transform your perspective and boost your happiness.",
      content:
        "A gratitude check is a simple yet profound practice. By consciously acknowledging the good things in your life, no matter how small, you shift your focus from what's lacking to what's abundant. This practice can rewire your brain for positivity, improve relationships, and increase overall life satisfaction. Try listing three things you're grateful for each morning or before bed. Consistency is key to experiencing its full benefits.",
      color: "bg-gradient-to-br from-[#F2C3B9] to-[#F0DDD6]", // peach to peach-light
    },
    habittracker: {
      title: "Mastering Your Habits",
      description: "Strategies for building sustainable habits that lead to long-term wellbeing.",
      content:
        "Building healthy habits is fundamental to personal growth. A habit tracker helps you visualize your progress and stay motivated. Break down large goals into small, manageable actions. Consistency is more important than intensity. Don't aim for perfection; aim for consistency. If you miss a day, don't give up—just get back on track the next day. Celebrate small wins to reinforce positive behavior.",
      color: "bg-gradient-to-br from-[#97B3AE] to-[#D2E0D3]", // sage to sage-light
    },
    breathingmeditation: {
      title: "Mindful Breathing & Meditation",
      description: "Techniques to calm your mind, reduce anxiety, and find inner peace through breathwork.",
      content:
        "Breathing and meditation are ancient practices with modern benefits. Deep, conscious breathing can immediately calm your nervous system, reducing stress and anxiety. Meditation, even for a few minutes a day, can improve focus, emotional regulation, and overall well-being. Find a quiet space, sit comfortably, and focus on your breath. There are many guided meditations available to help you get started.",
      color: "bg-gradient-to-br from-[#F0DDD6] to-[#D6CBBF]", // peach-light to cream-warm
    },
    memorylane: {
      title: "Creating Lasting Memories",
      description: "Tips for capturing and cherishing your most precious moments.",
      content:
        "Memory Lane is about preserving the moments that matter. Whether through photos, videos, or written reflections, actively recalling positive experiences can boost your mood and strengthen your sense of self. Create a digital album, a physical scrapbook, or simply dedicate time to reminisce. These memories serve as anchors of joy and resilience.",
      color: "bg-gradient-to-br from-[#D6CBBF] to-[#F0EEEA]", // cream-warm to cream
    },
    calmingplaylist: {
      title: "Sounds of Serenity",
      description: "Discover the therapeutic power of music and curated calming playlists.",
      content:
        "Music has a profound impact on our mood and well-being. A calming playlist can help you relax, focus, or even sleep better. Choose instrumental tracks, nature sounds, or gentle melodies that resonate with you. Create different playlists for different moods or activities, such as studying, meditating, or winding down before bed. Let the sounds guide you to a state of tranquility.",
      color: "bg-gradient-to-br from-[#F0EEEA] to-[#F2C3B9]", // cream to peach
    },
  }

  const currentFeature = featureDetails[featureName.toLowerCase()]

  if (!currentFeature) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-cream text-sage-dark">
        <h1 className="text-4xl font-bold mb-4">Feature Not Found</h1>
        <p className="text-lg">The feature you are looking for does not exist.</p>
        <Link to="/" className="mt-8">
          <Button className="bg-[#97B3AE] hover:bg-[#D6CBBF] text-white">Go to Home</Button>
        </Link>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen relative bg-cover bg-repeat bg-center bg-fixed scroll-smooth"
      style={{ backgroundImage: 'url("/images/floral-background.png")' }}
    >
      {/* Background Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[#F0EEEA]/30" />
      {/* Navigation (replicated from App.jsx for consistency) */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-6 lg:px-12 backdrop-blur-sm shadow-sm bg-[#F2C3B9]">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-[#97B3AE] to-[#D2E0D3] rounded-full flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-2xl font-bold text-[#486856]">Welly</span>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-[#486856] hover:text-[#D6CBBF] transition-colors">
            Home
          </Link>
          <Link to="/journaling" className="text-[#486856] hover:text-[#D6CBBF] transition-colors">
            Journal
          </Link>
          <Link to="/habits" className="text-[#486856] hover:text-[#D6CBBF] transition-colors">
            Habits
          </Link>
          <Link to="/gratitude" className="text-[#486856] hover:text-[#D6CBBF] transition-colors">
            Gratitude
          </Link>
          <Link to="/memory" className="text-[#486856] hover:text-[#D6CBBF] transition-colors">
            Memory
          </Link>
          <Link to="/playlist" className="text-[#486856] hover:text-[#D6CBBF] transition-colors">
            Playlist
          </Link>
          <Button className="bg-[#97B3AE] hover:bg-[#D6CBBF] text-white border-none">Get Started</Button>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden text-[#97B3AE]">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent className="bg-[#F0EEEA]">
            <div className="flex flex-col space-y-6 mt-8">
              <Link to="/" className="text-[#97B3AE] text-lg">
                Home
              </Link>
              <Link to="/journaling" className="text-[#97B3AE] text-lg">
                Journal
              </Link>
              <Link to="/habits" className="text-[#97B3AE] text-lg">
                Habits
              </Link>
              <Link to="/gratitude" className="text-[#97B3AE] text-lg">
                Gratitude
              </Link>
              <Link to="/memory" className="text-[#97B3AE] text-lg">
                Memory
              </Link>
              <Link to="/playlist" className="text-[#97B3AE] text-lg">
                Playlist
              </Link>
              <Button className="bg-[#97B3AE] hover:bg-[#D6CBBF] text-white">Get Started</Button>
            </div>
          </SheetContent>
        </Sheet>
      </nav>

      {/* Feature Detail Content */}
      <main className="relative z-10 py-20 px-6 min-h-[calc(100vh-100px)] flex items-center justify-center">
        <div className="max-w-4xl mx-auto text-center bg-white/70 backdrop-blur-sm rounded-3xl p-12 shadow-lg">
          <h1 className="text-4xl md:text-5xl font-light text-[#486856] mb-4">{currentFeature.title}</h1>
          <p className="text-lg text-[#6B8E7A] mb-8">{currentFeature.description}</p>
          <p className="text-md text-[#486856] leading-relaxed mb-12">{currentFeature.content}</p>
          <Link to="/">
            <Button size="lg" className="bg-[#97B3AE] hover:bg-[#D6CBBF] text-white px-8 py-4 text-lg">
              Back to Home
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer (replicated from App.jsx for consistency) */}
      <footer className="py-12 px-6 border-t border-[#97B3AE]/40 relative z-10">
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
  )
}
