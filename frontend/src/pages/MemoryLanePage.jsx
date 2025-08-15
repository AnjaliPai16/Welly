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

export default function MemoryLanePage() {
  const [albums, setAlbums] = useState([])
  const [showCreateAlbum, setShowCreateAlbum] = useState(false)
  const [showPhotoUpload, setShowPhotoUpload] = useState(false)
  const [selectedAlbum, setSelectedAlbum] = useState(null)
  const [showPhotoView, setShowPhotoView] = useState(false)
  const [selectedPhotos, setSelectedPhotos] = useState([])
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0)
  const [viewMode, setViewMode] = useState("albums") // "albums" or "cluster"

  // Load albums from localStorage on component mount
  useEffect(() => {
    const savedAlbums = localStorage.getItem("memoryLaneAlbums")
    if (savedAlbums) {
      setAlbums(JSON.parse(savedAlbums))
    }
  }, [])

  // Save albums to localStorage whenever albums change
  useEffect(() => {
    localStorage.setItem("memoryLaneAlbums", JSON.stringify(albums))
  }, [albums])

  // Add function to handle album creation
  const handleCreateAlbum = (newAlbum) => {
    setAlbums((prevAlbums) => [...prevAlbums, newAlbum])
  }

  // Add function to handle adding photos to album
  const handleAddPhotos = (albumId, photos) => {
    setAlbums((prevAlbums) =>
      prevAlbums.map((album) => {
        if (album.id === albumId) {
          return {
            ...album,
            photos: [...(album.photos || []), ...photos],
            photoCount: (album.photoCount || 0) + photos.length,
          }
        }
        return album
      }),
    )
  }

  // Add function to handle album click
  const handleAlbumClick = (album) => {
    setSelectedAlbum(album)
    setShowPhotoUpload(true)
  }

  // Add function to handle photo click
  const handlePhotoClick = (photos, photoIndex) => {
    setSelectedPhotos(photos)
    setSelectedPhotoIndex(photoIndex)
    setShowPhotoView(true)
  }

  // Add function to update photo note
  const handleUpdatePhotoNote = (photoId, newNote) => {
    setAlbums((prevAlbums) =>
      prevAlbums.map((album) => ({
        ...album,
        photos: (album.photos || []).map((photo) => (photo.id === photoId ? { ...photo, note: newNote } : photo)),
      })),
    )
  }

  // Get all photos from all albums for cluster view
  const getAllPhotos = () => {
    const allPhotos = []
    albums.forEach((album) => {
      if (album.photos && album.photos.length > 0) {
        album.photos.forEach((photo) => {
          allPhotos.push({
            ...photo,
            albumName: album.name,
            albumColor: album.color,
          })
        })
      }
    })
    return allPhotos.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
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

  const allPhotos = getAllPhotos()

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2E6D3] to-[#E8D5B7]">
      {/* Navigation Header */}
      <header className="bg-gradient-to-br from-[#D4B896] via-[#C8A882] to-[#B8956F] shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#8B7355] to-[#A0845C] rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-[#5D4E37]">Welly</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
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
          backgroundImage: "url(/memory.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-[#F2E6D3]/60"></div>

        <div className="relative z-10 p-6">
          {/* Date Display */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#5D4E37] mb-2">Memory Lane</h1>
            <p className="text-[#8B7355] text-lg">{getCurrentDate()}</p>
          </div>

          {/* View Toggle and Actions */}
          <div className="max-w-6xl mx-auto mb-6">
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
          <div className="max-w-6xl mx-auto">
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
                        key={album.id}
                        className="bg-white/80 backdrop-blur-sm border-none shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                        onClick={() => handleAlbumClick(album)}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center space-x-3 mb-4">
                            <div className={`w-12 h-12 ${album.color} rounded-full flex items-center justify-center`}>
                              <album.icon className="w-6 h-6 text-[#5D4E37]" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-[#5D4E37]">{album.name}</h3>
                              <p className="text-[#8B7355] text-sm">{album.genre}</p>
                            </div>
                          </div>
                          <p className="text-[#8B7355] text-sm mb-4">{album.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-[#B8956F] text-sm">{album.photoCount || 0} photos</span>
                            <Button variant="ghost" size="sm" className="text-[#8B7355] hover:bg-[#E8D5B7]">
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
                {allPhotos.length === 0 ? (
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
                        {allPhotos.length} photos across {albums.length} albums
                      </p>
                    </div>

                    {/* Photo Grid - Masonry Layout */}
                    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                      {allPhotos.map((photo, index) => (
                        <div
                          key={photo.id}
                          className="break-inside-avoid cursor-pointer group"
                          onClick={() => handlePhotoClick(allPhotos, index)}
                        >
                          <Card className="bg-white/80 backdrop-blur-sm border-none shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                            <CardContent className="p-0">
                              <div className="relative">
                                <img
                                  src={photo.preview || "/placeholder.svg"}
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
  )
}
