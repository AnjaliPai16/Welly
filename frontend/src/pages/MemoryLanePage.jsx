"use client"

import { useState, useEffect } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Sparkles, Menu, Plus, Grid3X3, Camera, Users, Calendar, Heart, LayoutGrid, Folder } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet"
import { Link } from "react-router-dom"
import CreateAlbumModal from "../components/ui/CreateAlbumModal"
import PhotoUploadModal from "../components/ui/PhotoUploadModal"
import PhotoViewModal from "../components/ui/PhotoViewModal"
import { albumAPI, photoAPI } from "../services/api"

export default function MemoryLanePage() {
  const [albums, setAlbums] = useState([])
  const [showCreateAlbum, setShowCreateAlbum] = useState(false)
  const [showPhotoUpload, setShowPhotoUpload] = useState(false)
  const [selectedAlbum, setSelectedAlbum] = useState(null)
  const [showPhotoView, setShowPhotoView] = useState(false)
  const [selectedPhotos, setSelectedPhotos] = useState([])
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0)
  const [viewMode, setViewMode] = useState("albums") // "albums" or "cluster"
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Load albums from API on component mount
  useEffect(() => {
    loadAlbums()
  }, [])

  // Ensure full width coverage
  useEffect(() => {
    // Force full width
    document.body.style.width = '100vw'
    document.body.style.overflowX = 'hidden'
    document.body.style.margin = '0'
    document.body.style.padding = '0'
    
    // Also set html element
    document.documentElement.style.width = '100vw'
    document.documentElement.style.overflowX = 'hidden'
    
    return () => {
      document.body.style.width = ''
      document.body.style.overflowX = ''
      document.body.style.margin = ''
      document.body.style.padding = ''
      document.documentElement.style.width = ''
      document.documentElement.style.overflowX = ''
    }
  }, [])

  const loadAlbums = async () => {
    try {
      setLoading(true)
      setError("")
      const response = await albumAPI.getUserAlbums()
      if (response.success) {
        setAlbums(response.data || [])
      } else {
        setError(response.message || 'Failed to load albums')
      }
    } catch (error) {
      setError(error.message || 'Failed to load albums')
    } finally {
      setLoading(false)
    }
  }

  // Add function to handle album creation
  const handleCreateAlbum = async (newAlbum) => {
    try {
      setError("")
      const response = await albumAPI.createAlbum({
        name: newAlbum.name,
        description: newAlbum.description,
        genre: newAlbum.genreId,
        color: newAlbum.color,
        icon: newAlbum.icon
      })

      if (response.success) {
        await loadAlbums() // Reload albums to get the new one
        setShowCreateAlbum(false)
      } else {
        setError(response.message || 'Failed to create album')
      }
    } catch (error) {
      setError(error.message || 'Failed to create album')
    }
  }

  // Add function to handle adding photos to album
  const handleAddPhotos = async (albumId, photos) => {
    try {
      setError("")
      
      // Create FormData for each photo
      const uploadPromises = photos.map(async (photo) => {
        try {
          const formData = new FormData()
          formData.append('photo', photo.file)
          formData.append('note', photo.note || '')
          
          return await photoAPI.uploadPhoto(albumId, formData)
        } catch (e) {
          console.error('Single photo upload failed:', e)
          return { success: false, message: e?.message || 'Upload failed' }
        }
      })

      const results = await Promise.allSettled(uploadPromises)
      const fulfilled = results.filter(r => r.status === 'fulfilled').map(r => r.value)
      const successCount = fulfilled.filter(r => r && r.success).length

      if (successCount > 0) {
        // Reload albums to get updated photo counts
        await loadAlbums()
        setShowPhotoUpload(false)
        setSelectedAlbum(null)
      } else {
        const firstError = (results.find(r => r.status === 'fulfilled' && !r.value?.success)?.value?.message)
          || (results.find(r => r.status === 'rejected')?.reason?.message)
          || 'Failed to upload photos'
        setError(firstError)
      }
    } catch (error) {
      setError(error.message || 'Failed to upload photos')
    }
  }

  // Add function to handle album click
  const handleAlbumClick = (album) => {
    setSelectedAlbum(album)
    setShowPhotoUpload(true)
  }

  // Add state to show album collage view
  const [showAlbumGrid, setShowAlbumGrid] = useState(false)

  // Add function to handle photo click
  const handlePhotoClick = async (albumId) => {
    try {
      setError("")
      const response = await photoAPI.getPhotosByAlbum(albumId)
      if (response.success) {
        const normalized = (response.data || []).map(p => ({
          ...p,
          url: p.url || p.secureUrl || p.secure_url,
          thumbnailUrl: p.thumbnailUrl || p.thumbnail || p.secureThumbnailUrl || p.secure_thumbnail_url,
        }))
        setSelectedPhotos(normalized)
        setSelectedPhotoIndex(0)
        setShowAlbumGrid(true) // Open collage grid
      } else {
        setError(response.message || 'Failed to load photos')
      }
    } catch (error) {
      setError(error.message || 'Failed to load photos')
    }
  }

  // Add function to update photo note
  const handleUpdatePhotoNote = async (photoId, newNote) => {
    try {
      setError("")
      const response = await photoAPI.updatePhotoNote(photoId, { note: newNote })
      if (response.success) {
        // Update local state
        setSelectedPhotos(prev => 
          prev.map(photo => 
            photo._id === photoId ? { ...photo, note: newNote } : photo
          )
        )
      } else {
        setError(response.message || 'Failed to update photo note')
      }
    } catch (error) {
      setError(error.message || 'Failed to update photo note')
    }
  }

  // Get all photos from all albums for cluster view
  const getAllPhotos = async () => {
    try {
      setError("")
      const response = await photoAPI.getAllUserPhotos()
      if (response.success) {
        return (response.data || []).map(photo => ({
          ...photo,
          albumName: photo.album?.name || 'Unknown Album',
          albumColor: photo.album?.color || 'bg-gradient-to-br from-[#D4B896] to-[#E8D5B7]'
        })).sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
      } else {
        setError(response.message || 'Failed to load photos')
        return []
      }
    } catch (error) {
      setError(error.message || 'Failed to load photos')
      return []
    }
  }

  const albumGenres = [
    { id: "personal", name: "Personal", icon: Camera, color: "bg-gradient-to-br from-[#D4B896] to-[#E8D5B7]" },
    { id: "group", name: "Group", icon: Users, color: "bg-gradient-to-br from-[#C8A882] to-[#D4B896]" },
    { id: "special", name: "Special Days", icon: Calendar, color: "bg-gradient-to-br from-[#B8956F] to-[#C8A882]" },
    { id: "family", name: "Family", icon: Heart, color: "bg-gradient-to-br from-[#E8D5B7] to-[#F2E6D3]" },
  ]

  const getCurrentDate = () => {
    const now = new Date()
    return now.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Handle cluster view photo loading
  const [clusterPhotos, setClusterPhotos] = useState([])
  const [clusterLoading, setClusterLoading] = useState(false)

  useEffect(() => {
    if (viewMode === "cluster") {
      loadClusterPhotos()
    }
  }, [viewMode])

  const loadClusterPhotos = async () => {
    setClusterLoading(true)
    const photos = await getAllPhotos()
    setClusterPhotos(photos)
    setClusterLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen relative bg-cover bg-center bg-fixed" style={{ backgroundImage: 'url("memory.jpg")' }}>
        {/* Background Overlay with warm tint */}
        <div className="fixed inset-0 pointer-events-none z-0 bg-[#F2E6D3]/20" />
        
        {/* Content Container */}
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B7355] mx-auto mb-4"></div>
            <p className="text-[#8B7355]">Loading your memories...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen w-screen relative bg-cover bg-center bg-fixed bg-no-repeat overflow-x-hidden" 
      style={{ 
        backgroundImage: 'url("bg1.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        width: '100vw',
        minWidth: '100vw',
        left: '0',
        right: '0',
        margin: '0',
        padding: '0'
      }}
    >
      {/* Background Overlay with warm tint */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[#F2E6D3]/20" />

      {/* Content Container */}
      <div className="relative z-10 w-full">
        {/* Navigation Header */}
        <header className="bg-gradient-to-br from-[#D4B896] via-[#C8A882] to-[#B8956F] shadow-sm">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[#8B7355] to-[#A0845C] rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-[#5D4E37]">Welly</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-[#5D4E37] hover:text-[#8B7355] transition-colors font-medium">
                Home
              </Link>
              <Link to="/journaling" className="text-[#5D4E37] hover:text-[#8B7355] transition-colors font-medium">
                Journal
              </Link>
              <Link to="/habits" className="text-[#5D4E37] hover:text-[#8B7355] transition-colors font-medium">
                Habits
              </Link>
              <Link to="/gratitude" className="text-[#5D4E37] hover:text-[#8B7355] transition-colors font-medium">
                Gratitude
              </Link>
              <Button className="bg-[#8B7355] hover:bg-[#5D4E37] text-white">Get Started</Button>
            </div>

            {/* Mobile Navigation */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-[#5D4E37]">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-[#F2E6D3]">
                <div className="flex flex-col space-y-6 mt-8">
                  <Link to="/" className="text-[#5D4E37] text-lg font-medium">
                    Home
                  </Link>
                  <Link to="/journaling" className="text-[#5D4E37] text-lg font-medium">
                    Journal
                  </Link>
                  <Link to="/habits" className="text-[#5D4E37] text-lg font-medium">
                    Habits
                  </Link>
                  <Link to="/gratitude" className="text-[#5D4E37] text-lg font-medium">
                    Gratitude
                  </Link>
                  <Button className="bg-[#8B7355] hover:bg-[#5D4E37] text-white">Get Started</Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </header>

        {/* Main Content */}
        <div
          className="relative min-h-[calc(100vh-80px)]"
          style={{
            backgroundImage: "url(/bg1.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="absolute inset-0 bg-[#F2E6D3]/60"></div>

          <div className="relative z-10 p-6">
            {/* Error Display */}
            {error && (
              <div className="w-full mx-auto mb-6 px-6">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                  <button 
                    onClick={() => setError("")}
                    className="float-right font-bold text-red-700 hover:text-red-900"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}

            {/* Date Display */}
            <div className="text-center mb-8 px-6">
              <h1 className="text-3xl font-bold text-[#5D4E37] mb-2">Memory Lane</h1>
              <p className="text-[#8B7355] text-lg">{getCurrentDate()}</p>
            </div>

            {/* View Toggle and Actions */}
            <div className="w-full mx-auto mb-6 px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    variant={viewMode === "albums" ? "default" : "outline"}
                    onClick={() => setViewMode("albums")}
                    className={
                      viewMode === "albums"
                        ? "bg-[#8B7355] hover:bg-[#5D4E37] text-white"
                        : "border-[#D4B896] text-[#8B7355] hover:bg-[#E8D5B7] bg-transparent"
                    }
                  >
                    <Folder className="w-4 h-4 mr-2" />
                    Albums
                  </Button>
                  <Button
                    variant={viewMode === "cluster" ? "default" : "outline"}
                    onClick={() => setViewMode("cluster")}
                    className={
                      viewMode === "cluster"
                        ? "bg-[#8B7355] hover:bg-[#5D4E37] text-white"
                        : "border-[#D4B896] text-[#8B7355] hover:bg-[#E8D5B7] bg-transparent"
                    }
                  >
                    <LayoutGrid className="w-4 h-4 mr-2" />
                    All Photos
                  </Button>
                </div>
                <Button onClick={() => setShowCreateAlbum(true)} className="bg-[#8B7355] hover:bg-[#5D4E37] text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Album
                </Button>
              </div>
            </div>

            {/* Content based on view mode */}
            <div className="w-full px-6">
              {viewMode === "albums" ? (
                // Albums View
                <>
                  {albums.length === 0 ? (
                    <div className="text-center py-16">
                      <Camera className="w-16 h-16 text-[#B8956F] mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-[#5D4E37] mb-2">No Albums Yet</h3>
                      <p className="text-[#8B7355] mb-6">Create your first photo album to start preserving memories</p>
                      <Button
                        onClick={() => setShowCreateAlbum(true)}
                        className="bg-[#8B7355] hover:bg-[#5D4E37] text-white"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Your First Album
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {albums.map((album) => (
                        <Card
                          key={album._id}
                          className="bg-white/80 backdrop-blur-sm border-none shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                          onClick={() => handleAlbumClick(album)}
                        >
                          <CardContent className="p-6">
                            <div className="flex items-center space-x-3 mb-4">
                              <div className={`w-12 h-12 ${album.color} rounded-full flex items-center justify-center`}>
                                {album.icon === 'Camera' && <Camera className="w-6 h-6 text-[#5D4E37]" />}
                                {album.icon === 'Users' && <Users className="w-6 h-6 text-[#5D4E37]" />}
                                {album.icon === 'Calendar' && <Calendar className="w-6 h-6 text-[#5D4E37]" />}
                                {album.icon === 'Heart' && <Heart className="w-6 h-6 text-[#5D4E37]" />}
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-[#5D4E37]">{album.name}</h3>
                                <p className="text-[#8B7355] text-sm">{album.genre}</p>
                              </div>
                            </div>
                            <p className="text-[#8B7355] text-sm mb-4">{album.description}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-[#B8956F] text-sm">{album.photoCount || 0} photos</span>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-[#8B7355] hover:bg-[#E8D5B7]"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handlePhotoClick(album._id)
                                }}
                              >
                                <Grid3X3 className="w-4 h-4 mr-1" />
                                View
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  {/* Quick Genre Cards */}
                  <div className="mt-12">
                    <h3 className="text-xl font-semibold text-[#5D4E37] mb-6">Create by Genre</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {albumGenres.map((genre) => (
                        <Card
                          key={genre.id}
                          className="bg-white/60 backdrop-blur-sm border-none shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
                          onClick={() => {
                            setShowCreateAlbum(true)
                            // Pre-select the genre in the modal
                          }}
                        >
                          <CardContent className="p-4 text-center">
                            <div
                              className={`w-12 h-12 ${genre.color} rounded-full flex items-center justify-center mx-auto mb-3`}
                            >
                              <genre.icon className="w-6 h-6 text-[#5D4E37]" />
                            </div>
                            <h4 className="text-sm font-medium text-[#5D4E37]">{genre.name}</h4>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                // Cluster Board View
                <>
                  {clusterLoading ? (
                    <div className="text-center py-16">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B7355] mx-auto mb-4"></div>
                      <p className="text-[#8B7355]">Loading your photos...</p>
                    </div>
                  ) : clusterPhotos.length === 0 ? (
                    <div className="text-center py-16">
                      <LayoutGrid className="w-16 h-16 text-[#B8956F] mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-[#5D4E37] mb-2">No Photos Yet</h3>
                      <p className="text-[#8B7355] mb-6">Upload photos to your albums to see them here</p>
                      <Button
                        onClick={() => setViewMode("albums")}
                        className="bg-[#8B7355] hover:bg-[#5D4E37] text-white"
                      >
                        <Folder className="w-4 h-4 mr-2" />
                        Go to Albums
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="mb-6">
                        <h2 className="text-2xl font-semibold text-[#5D4E37] mb-2">All Your Memories</h2>
                        <p className="text-[#8B7355]">
                          {clusterPhotos.length} photos across {albums.length} albums
                        </p>
                      </div>

                      {/* Photo Grid - Masonry Layout */}
                      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                        {clusterPhotos.map((photo, index) => (
                          <div
                            key={photo._id}
                            className="break-inside-avoid cursor-pointer group"
                            onClick={() => {
                              setSelectedPhotos(clusterPhotos)
                              setSelectedPhotoIndex(index)
                              setShowPhotoView(true)
                            }}
                          >
                            <Card className="bg-white/80 backdrop-blur-sm border-none shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                              <CardContent className="p-0">
                                <div className="relative">
                                  <img
                                    src={photo.thumbnailUrl || photo.url || "/placeholder.svg"}
                                    alt={photo.name || "Memory"}
                                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

                                  {/* Album Badge */}
                                  <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                                      {photo.albumName}
                                    </div>
                                  </div>
                                </div>

                                {/* Photo Note Preview */}
                                {photo.note && (
                                  <div className="p-3">
                                    <p className="text-[#5D4E37] text-sm line-clamp-2">{photo.note}</p>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Modals */}
        <CreateAlbumModal
          isOpen={showCreateAlbum}
          onClose={() => setShowCreateAlbum(false)}
          onCreateAlbum={handleCreateAlbum}
        />

        <PhotoUploadModal
          isOpen={showPhotoUpload}
          onClose={() => {
            setShowPhotoUpload(false)
            setSelectedAlbum(null)
          }}
          album={selectedAlbum}
          onAddPhotos={handleAddPhotos}
        />

        {/* Album Collage Grid Modal */}
        {showAlbumGrid && (
          <div className="fixed inset-0 z-50 bg-black/80 overflow-y-auto">
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-black/60 backdrop-blur">
              <h3 className="text-white text-lg font-semibold">{selectedAlbum?.name || 'Album'}</h3>
              <Button
                variant="ghost"
                className="text-white hover:bg-white/20"
                onClick={() => {
                  setShowAlbumGrid(false)
                  setSelectedPhotos([])
                  setSelectedPhotoIndex(0)
                }}
              >
                Close
              </Button>
            </div>

            <div className="px-4 pb-10">
              {/* Masonry columns with natural aspect ratios */}
              <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
                {selectedPhotos.map((photo, index) => (
                  <div key={photo._id || index} className="mb-4 break-inside-avoid">
                    <button
                      className="block w-full group"
                      onClick={() => {
                        setSelectedPhotoIndex(index)
                        setShowPhotoView(true)
                      }}
                    >
                      <img
                        src={photo.thumbnailUrl || photo.url || "/placeholder.svg"}
                        alt={photo.name || 'Memory'}
                        className="w-full h-auto rounded-lg shadow-md transition-transform duration-300 group-hover:scale-[1.01]"
                        loading="lazy"
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <PhotoViewModal
          isOpen={showPhotoView}
          onClose={() => {
            setShowPhotoView(false)
            setSelectedPhotos([])
            setSelectedPhotoIndex(0)
          }}
          photos={selectedPhotos}
          initialPhotoIndex={selectedPhotoIndex}
          onUpdateNote={handleUpdatePhotoNote}
        />
      </div>
    </div>
  )
}
