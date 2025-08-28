"use client"

import { useState } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog"
import { Sparkles, Play, BookOpen, ExternalLink, Search } from "lucide-react"
import { Link } from "react-router-dom"

const videos = [
  {
    id: "5DqTuWve9t8",
    title: "10-Minute Guided Breathing Meditation",
    channel: "Great Meditation",
    duration: "10:12",
    url: "https://www.youtube.com/watch?v=5DqTuWve9t8",
  },
  {
    id: "inpok4MKVLM",
    title: "5-Minute Meditation You Can Do Anywhere",
    channel: "Headspace",
    duration: "5:11",
    url: "https://www.youtube.com/watch?v=inpok4MKVLM",
  },
  {
    id: "SEfs5TJZ6Nk",
    title: "Mindfulness Meditation - Guided 10 Minutes",
    channel: "The Honest Guys",
    duration: "10:01",
    url: "https://www.youtube.com/watch?v=SEfs5TJZ6Nk",
  },
  {
    id: "aNXKjGFUlMs",
    title: "Box Breathing (4x4) Guided Practice",
    channel: "CalaMed",
    duration: "4:45",
    url: "https://www.youtube.com/watch?v=aNXKjGFUlMs",
  },
]

const articles = [
  {
    title: "The Science of Mindfulness",
    source: "American Psychological Association",
    url: "https://www.apa.org/monitor/2012/07-08/ce-corner",
  },
  {
    title: "How Meditation Affects the Brain",
    source: "Harvard Health",
    url: "https://www.health.harvard.edu/mind-and-mood/meditation-what-it-can-do-for-you",
  },
  {
    title: "Breathwork Techniques for Stress",
    source: "Cleveland Clinic",
    url: "https://health.clevelandclinic.org/breathing-exercises-for-anxiety/",
  },
  {
    title: "A Beginner's Guide to Meditation",
    source: "Mindful.org",
    url: "https://www.mindful.org/how-to-meditate/",
  },
]

export default function BreathingMeditationPage() {
  const [query, setQuery] = useState("")
  const [activeVideo, setActiveVideo] = useState(null)

  const filteredVideos = videos.filter(v => v.title.toLowerCase().includes(query.toLowerCase()))
  const filteredArticles = articles.filter(a => a.title.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="min-h-screen relative bg-cover bg-center bg-fixed" style={{ backgroundImage: 'url("bg5.jpg")' }}>
      {/* Coral-blue overlay (#82b2c0) */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{ backgroundColor: "#82b2c0", opacity: 0.2 }} />

      <div className="relative z-10">
        {/* Nav */}
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-6 lg:px-12 backdrop-blur-sm shadow-sm" style={{ backgroundColor: "rgba(32,78,94,0.9)" }}>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#bfe0ea] to-[#eef6f8] rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4" style={{ color: "#2f6e82" }} />
            </div>
            <Link to="/" className="text-2xl font-bold text-white">Welly</Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-white hover:opacity-80">Home</Link>
            <Link to="/journaling" className="text-white hover:opacity-80">Journal</Link>
            <Link to="/habits" className="text-white hover:opacity-80">Habits</Link>
            <Link to="/gratitude" className="text-white hover:opacity-80">Gratitude</Link>
            <Link to="/memory" className="text-white hover:opacity-80">Memory</Link>
            <Link to="/playlist" className="text-white hover:opacity-80">Playlist</Link>
          </div>
        </nav>

        <div className="pt-24 px-6 pb-24">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: "#82b2c0" }}>
                  <Play className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-light" style={{ color: "#2f6e82" }}>Breathing & Meditation</h1>
              <p className="text-lg mt-3" style={{ color: "#3c879f" }}>Curated videos and reads to calm the mind and center your breath</p>
            </div>

            {/* Search */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#82b2c0" }} />
                  <Input
                    placeholder="Search videos and articles..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-10 border-[#82b2c0]/30 focus:border-[#82b2c0]"
                  />
                </div>
              </div>
            </div>

            {/* Videos Section */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center" style={{ color: "#2f6e82" }}>
                <Play className="w-6 h-6 mr-2" /> Guided Videos
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredVideos.map((v) => (
                  <Card key={v.id} className="bg-white/85 backdrop-blur-sm border-[#82b2c0]/30 hover:shadow-lg transition-all">
                    <CardContent className="p-4">
                      <div className="aspect-video w-full rounded-lg overflow-hidden mb-3 bg-black/10">
                        <img
                          src={`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`}
                          alt={v.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="font-semibold" style={{ color: "#2f6e82" }}>{v.title}</h3>
                      <p className="text-sm" style={{ color: "#3c879f" }}>{v.channel} • {v.duration}</p>
                      <div className="mt-3 flex gap-2">
                        <Button onClick={() => setActiveVideo(v)} className="text-white" style={{ backgroundColor: "#82b2c0" }}>
                          <Play className="w-4 h-4 mr-2" /> Watch
                        </Button>
                        <a href={v.url} target="_blank" rel="noreferrer">
                          <Button variant="outline" className="border-[#82b2c0]" style={{ color: "#2f6e82" }}>
                            <ExternalLink className="w-4 h-4 mr-2" /> Open
                          </Button>
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Articles Section */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center" style={{ color: "#2f6e82" }}>
                <BookOpen className="w-6 h-6 mr-2" /> Articles & Blogs
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredArticles.map((a, idx) => (
                  <Card key={idx} className="bg-white/85 backdrop-blur-sm border-[#82b2c0]/30 hover:shadow-lg transition-all">
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-1" style={{ color: "#2f6e82" }}>{a.title}</h3>
                      <p className="text-sm mb-3" style={{ color: "#3c879f" }}>{a.source}</p>
                      <a href={a.url} target="_blank" rel="noreferrer">
                        <Button variant="outline" className="border-[#82b2c0]" style={{ color: "#2f6e82" }}>
                          <ExternalLink className="w-4 h-4 mr-2" /> Read
                        </Button>
                      </a>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Video Dialog */}
        <Dialog open={!!activeVideo} onOpenChange={() => setActiveVideo(null)}>
          <DialogContent className="bg-white max-w-3xl w-full">
            <DialogHeader>
              <DialogTitle style={{ color: "#2f6e82" }}>{activeVideo?.title}</DialogTitle>
            </DialogHeader>
            <div className="w-full aspect-video">
              {activeVideo && (
                <iframe
                  className="w-full h-full rounded-lg"
                  src={`https://www.youtube.com/embed/${activeVideo.id}`}
                  title={activeVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}



