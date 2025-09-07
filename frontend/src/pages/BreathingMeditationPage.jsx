"use client"

import { useState, useEffect } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog"
import { Sparkles, Play, BookOpen, ExternalLink, Search, Loader2 } from "lucide-react"
import { Link } from "react-router-dom"


// YouTube API configuration
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';
console.log("API Key:", YOUTUBE_API_KEY);


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

// Default search terms for meditation/breathing content
const DEFAULT_SEARCH_TERMS = [
  'guided meditation breathing',
  'mindfulness meditation 10 minutes',
  'breathing exercises anxiety',
  'meditation for beginners'
]

export default function BreathingMeditationPage() {
  const [query, setQuery] = useState("")
  const [activeVideo, setActiveVideo] = useState(null)
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Function to search YouTube videos
  const searchYouTubeVideos = async (searchQuery, maxResults = 20) => {
    try {
      const response = await fetch(
        `${YOUTUBE_API_BASE}/search?` +
        `key=${YOUTUBE_API_KEY}&` +
        `q=${encodeURIComponent(searchQuery)}&` +
        `part=snippet&` +
        `type=video&` +
        `maxResults=${maxResults}&` +
        `order=relevance&` +
        `videoDuration=medium&` + // Filter for medium length videos (4-20 minutes)
        `videoDefinition=any&` +
        `safeSearch=strict`
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.items || []
    } catch (error) {
      console.error('Error fetching YouTube videos:', error)
      throw error
    }
  }

  // Function to get video details including duration
  const getVideoDetails = async (videoIds) => {
    try {
      const response = await fetch(
        `${YOUTUBE_API_BASE}/videos?` +
        `key=${YOUTUBE_API_KEY}&` +
        `id=${videoIds.join(',')}&` +
        `part=contentDetails,statistics`
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.items || []
    } catch (error) {
      console.error('Error fetching video details:', error)
      return []
    }
  }

  // Function to convert ISO 8601 duration to readable format
  const formatDuration = (duration) => {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/)
    if (!match) return '0:00'

    const hours = parseInt(match[1]) || 0
    const minutes = parseInt(match[2]) || 0
    const seconds = parseInt(match[3]) || 0

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  // Function to load initial videos
  const loadInitialVideos = async () => {
    setLoading(true)
    setError(null)

    try {
      // Search for videos using multiple search terms
      const allVideos = []
      
      for (const searchTerm of DEFAULT_SEARCH_TERMS) {
        const searchResults = await searchYouTubeVideos(searchTerm, 8)
        allVideos.push(...searchResults)
      }

      // Remove duplicates based on video ID
      const uniqueVideos = allVideos.filter((video, index, self) => 
        index === self.findIndex(v => v.id.videoId === video.id.videoId)
      )

      // Get video details for duration
      const videoIds = uniqueVideos.map(video => video.id.videoId)
      const videoDetails = await getVideoDetails(videoIds)

      // Combine search results with video details
      const formattedVideos = uniqueVideos.map(video => {
        const details = videoDetails.find(detail => detail.id === video.id.videoId)
        return {
          id: video.id.videoId,
          title: video.snippet.title,
          channel: video.snippet.channelTitle,
          duration: details ? formatDuration(details.contentDetails.duration) : 'N/A',
          url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
          thumbnail: video.snippet.thumbnails.medium?.url || video.snippet.thumbnails.default?.url,
          description: video.snippet.description,
          publishedAt: video.snippet.publishedAt
        }
      })

      // Sort by relevance (you can customize this sorting logic)
      formattedVideos.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))

      setVideos(formattedVideos.slice(0, 12)) // Limit to 12 videos
    } catch (error) {
      setError('Failed to load videos. Please try again later.')
      console.error('Error loading videos:', error)
    } finally {
      setLoading(false)
    }
  }

  // Function to search videos based on user input
  const handleSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      loadInitialVideos()
      return
    }

    setLoading(true)
    setError(null)

    try {
      const searchResults = await searchYouTubeVideos(`${searchQuery} meditation breathing`, 12)
      const videoIds = searchResults.map(video => video.id.videoId)
      const videoDetails = await getVideoDetails(videoIds)

      const formattedVideos = searchResults.map(video => {
        const details = videoDetails.find(detail => detail.id === video.id.videoId)
        return {
          id: video.id.videoId,
          title: video.snippet.title,
          channel: video.snippet.channelTitle,
          duration: details ? formatDuration(details.contentDetails.duration) : 'N/A',
          url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
          thumbnail: video.snippet.thumbnails.medium?.url || video.snippet.thumbnails.default?.url,
          description: video.snippet.description,
          publishedAt: video.snippet.publishedAt
        }
      })

      setVideos(formattedVideos)
    } catch (error) {
      setError('Failed to search videos. Please try again.')
      console.error('Error searching videos:', error)
    } finally {
      setLoading(false)
    }
  }

  // Load initial videos on component mount
  useEffect(() => {
    loadInitialVideos()
  }, [])

  // Handle search with debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(query)
    }, 500) // 500ms delay

    return () => clearTimeout(timer)
  }, [query])

  const filteredArticles = articles.filter(a => 
    a.title.toLowerCase().includes(query.toLowerCase())
  )

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
                    placeholder="Search meditation and breathing videos..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-10 border-[#82b2c0]/30 focus:border-[#82b2c0]"
                  />
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            {/* Videos Section */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 flex items-center" style={{ color: "#2f6e82" }}>
                <Play className="w-6 h-6 mr-2" /> Guided Videos
                {loading && <Loader2 className="w-5 h-5 ml-2 animate-spin" />}
              </h2>
              
              {loading && videos.length === 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, idx) => (
                    <Card key={idx} className="bg-white/85 backdrop-blur-sm border-[#82b2c0]/30">
                      <CardContent className="p-4">
                        <div className="aspect-video w-full rounded-lg bg-gray-200 animate-pulse mb-3" />
                        <div className="h-4 bg-gray-200 animate-pulse rounded mb-2" />
                        <div className="h-3 bg-gray-200 animate-pulse rounded w-2/3" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {videos.map((v) => (
                    <Card key={v.id} className="bg-white/85 backdrop-blur-sm border-[#82b2c0]/30 hover:shadow-lg transition-all">
                      <CardContent className="p-4">
                        <div className="aspect-video w-full rounded-lg overflow-hidden mb-3 bg-black/10">
                          <img
                            src={v.thumbnail}
                            alt={v.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <h3 className="font-semibold line-clamp-2" style={{ color: "#2f6e82" }} title={v.title}>
                          {v.title}
                        </h3>
                        <p className="text-sm" style={{ color: "#3c879f" }}>
                          {v.channel} • {v.duration}
                        </p>
                        <div className="mt-3 flex gap-2">
                          <Button 
                            onClick={() => setActiveVideo(v)} 
                            className="text-white" 
                            style={{ backgroundColor: "#82b2c0" }}
                          >
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
              )}
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
                  src={`https://www.youtube.com/embed/${activeVideo.id}?autoplay=1`}
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