"use client"

import { useState, useEffect } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { Music, Search, Plus, Play, List, Sparkles, MoreVertical } from "lucide-react"
import { Link } from "react-router-dom"
import jamendoApi from "../services/jamendoApi"
import { usePlaylist } from "../contexts/PlaylistContext"
import PlaylistManager from "../components/PlaylistManager"

export default function CalmingPlaylistPage() {
  const [tracks, setTracks] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [selectedPlaylist, setSelectedPlaylist] = useState(null)
  const [showAddToPlaylistDialog, setShowAddToPlaylistDialog] = useState(false)
  const [selectedTrack, setSelectedTrack] = useState(null)

  const { playlists, currentTrack, currentPlaylist, currentTrackIndex, playTrack, addTrackToPlaylist, playPlaylist } =
    usePlaylist()

  // Load calming tracks on component mount
  useEffect(() => {
    loadCalmingTracks()
  }, [])

  const loadCalmingTracks = async () => {
    setLoading(true)
    try {
      const calmingTracks = await jamendoApi.getCalmingTracks(30)
      setTracks(calmingTracks)
    } catch (error) {
      console.error("Error loading calming tracks:", error)
    }
    setLoading(false)
  }

  const searchTracks = async () => {
    if (!searchQuery.trim()) return

    setLoading(true)
    try {
      const searchResults = await jamendoApi.searchTracks(searchQuery, 20)
      setTracks(searchResults)
    } catch (error) {
      console.error("Error searching tracks:", error)
    }
    setLoading(false)
  }

  const handlePlayTrack = (track) => {
    playTrack(track, selectedPlaylist, 0)
  }

  const handleAddToPlaylist = (track) => {
    setSelectedTrack(track)
    setShowAddToPlaylistDialog(true)
  }

  const handleConfirmAddToPlaylist = (playlistId) => {
    if (selectedTrack && playlistId) {
      addTrackToPlaylist(playlistId, selectedTrack)
      setShowAddToPlaylistDialog(false)
      setSelectedTrack(null)
    }
  }

  const handlePlaylistSelect = (playlist) => {
    setSelectedPlaylist(playlist)
  }

  return (
    <div className="min-h-screen relative bg-cover bg-center bg-fixed" style={{ backgroundImage: 'url("/bg.jpg")' }}>
      {/* Background Overlay with sage green tint */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[#97B3AE]/20" />

      {/* Content Container */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-6 lg:px-12 backdrop-blur-sm shadow-sm bg-[#97B3AE]/90">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#D2E0D3] to-[#F0EEEA] rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#486856]" />
            </div>
            <Link to="/" className="text-2xl font-bold text-white">
              Welly
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-white hover:text-[#D2E0D3] transition-colors">
              Home
            </Link>
            <Link to="/journaling" className="text-white hover:text-[#D2E0D3] transition-colors">
              Journal
            </Link>
            <Link to="/habits" className="text-white hover:text-[#D2E0D3] transition-colors">
              Habits
            </Link>
            <Link to="/gratitude" className="text-white hover:text-[#D2E0D3] transition-colors">
              Gratitude
            </Link>
            <Link to="/memory" className="text-white hover:text-[#D2E0D3] transition-colors">
              Memory
            </Link>
          </div>
        </nav>

        {/* Main Content */}
        <div className="pt-24 px-6 pb-32">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-[#97B3AE] rounded-full flex items-center justify-center shadow-lg">
                  <Music className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-light text-[#486856] mb-4">Calming Playlists</h1>
              <p className="text-lg text-[#6B8E7A] max-w-2xl mx-auto">
                Create your perfect soundtrack for relaxation, meditation, and inner peace
              </p>
            </div>

            {/* Search and Controls */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#97B3AE] w-5 h-5" />
                  <Input
                    placeholder="Search for calming music..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && searchTracks()}
                    className="pl-10 border-[#97B3AE]/30 focus:border-[#97B3AE]"
                  />
                </div>
                <Button
                  onClick={searchTracks}
                  className="bg-[#97B3AE] hover:bg-[#486856] text-white"
                  disabled={loading}
                >
                  {loading ? "Searching..." : "Search"}
                </Button>
              </div>
            </div>

            <div className="mb-8">
              <PlaylistManager onPlaylistSelect={handlePlaylistSelect} />
            </div>

            {selectedPlaylist && (
              <div className="mb-8">
                <Card className="bg-white/80 backdrop-blur-sm border-[#97B3AE]/30">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-[#486856]">{selectedPlaylist.name}</h3>
                        <p className="text-[#6B8E7A]">{selectedPlaylist.tracks.length} tracks</p>
                      </div>
                      <Button
                        onClick={() => playPlaylist(selectedPlaylist)}
                        disabled={selectedPlaylist.tracks.length === 0}
                        className="bg-[#97B3AE] hover:bg-[#486856] text-white"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Play All
                      </Button>
                    </div>
                    {selectedPlaylist.tracks.length > 0 && (
                      <div className="space-y-2">
                        {selectedPlaylist.tracks.map((track, index) => (
                          <div key={track.id} className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <span className="text-sm text-[#6B8E7A] w-6">{index + 1}</span>
                              <div>
                                <p className="font-medium text-[#486856]">{track.name}</p>
                                <p className="text-sm text-[#6B8E7A]">{track.artist_name}</p>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => playTrack(track, selectedPlaylist, index)}
                              className="bg-[#97B3AE] hover:bg-[#486856] text-white"
                            >
                              <Play className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Tracks Section */}
            <div>
              <h2 className="text-2xl font-semibold text-[#486856] mb-4 flex items-center">
                <Music className="w-6 h-6 mr-2" />
                {searchQuery ? "Search Results" : "Calming Tracks"}
              </h2>

              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#97B3AE] mx-auto"></div>
                  <p className="text-[#6B8E7A] mt-4">Loading peaceful music...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tracks.map((track) => (
                    <Card
                      key={track.id}
                      className="bg-white/80 backdrop-blur-sm border-[#97B3AE]/30 hover:shadow-lg transition-all group"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-[#486856] mb-1 line-clamp-2">{track.name}</h3>
                            <p className="text-sm text-[#6B8E7A]">{track.artist_name}</p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-[#97B3AE] hover:text-[#486856] opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white">
                              <DropdownMenuItem onClick={() => handleAddToPlaylist(track)}>
                                <Plus className="w-4 h-4 mr-2" />
                                Add to Playlist
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handlePlayTrack(track)}>
                                <Play className="w-4 h-4 mr-2" />
                                Play Now
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-[#6B8E7A]">
                            {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, "0")}
                          </span>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handlePlayTrack(track)}
                              className="bg-[#97B3AE] hover:bg-[#486856] text-white"
                            >
                              <Play className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAddToPlaylist(track)}
                              className="border-[#97B3AE] text-[#97B3AE] hover:bg-[#97B3AE] hover:text-white bg-transparent"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {!loading && tracks.length === 0 && (
                <div className="text-center py-12">
                  <Music className="w-16 h-16 text-[#97B3AE] mx-auto mb-4" />
                  <p className="text-[#6B8E7A] text-lg">
                    {searchQuery
                      ? "No tracks found. Try a different search term."
                      : "No tracks available at the moment."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <Dialog open={showAddToPlaylistDialog} onOpenChange={setShowAddToPlaylistDialog}>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle className="text-[#486856]">Add to Playlist</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {selectedTrack && (
                <div className="p-3 bg-[#97B3AE]/10 rounded-lg">
                  <p className="font-medium text-[#486856]">{selectedTrack.name}</p>
                  <p className="text-sm text-[#6B8E7A]">{selectedTrack.artist_name}</p>
                </div>
              )}

              {playlists.length === 0 ? (
                <p className="text-[#6B8E7A] text-center py-4">No playlists available. Create a playlist first.</p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {playlists.map((playlist) => (
                    <Button
                      key={playlist.id}
                      variant="outline"
                      onClick={() => handleConfirmAddToPlaylist(playlist.id)}
                      className="w-full justify-start border-[#97B3AE]/30 hover:bg-[#97B3AE] hover:text-white"
                    >
                      <List className="w-4 h-4 mr-2" />
                      {playlist.name} ({playlist.tracks.length} tracks)
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
