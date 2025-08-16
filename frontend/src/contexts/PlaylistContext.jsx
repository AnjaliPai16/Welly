"use client"

import { createContext, useContext, useState, useEffect } from "react"

const PlaylistContext = createContext()

export const usePlaylist = () => {
  const context = useContext(PlaylistContext)
  if (!context) {
    throw new Error("usePlaylist must be used within a PlaylistProvider")
  }
  return context
}

export const PlaylistProvider = ({ children }) => {
  const [playlists, setPlaylists] = useState([])
  const [currentPlaylist, setCurrentPlaylist] = useState(null)
  const [currentTrack, setCurrentTrack] = useState(null)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)

  // Load playlists from localStorage on mount
  useEffect(() => {
    const savedPlaylists = localStorage.getItem("welly-playlists")
    if (savedPlaylists) {
      try {
        const parsedPlaylists = JSON.parse(savedPlaylists)
        setPlaylists(parsedPlaylists)
      } catch (error) {
        console.error("Error loading playlists:", error)
      }
    }
  }, [])

  // Save playlists to localStorage whenever playlists change
  useEffect(() => {
    localStorage.setItem("welly-playlists", JSON.stringify(playlists))
  }, [playlists])

  const createPlaylist = (name, description = "") => {
    const newPlaylist = {
      id: Date.now().toString(),
      name,
      description,
      tracks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setPlaylists((prev) => [...prev, newPlaylist])
    return newPlaylist
  }

  const deletePlaylist = (playlistId) => {
    setPlaylists((prev) => prev.filter((playlist) => playlist.id !== playlistId))

    // If the deleted playlist was current, clear it
    if (currentPlaylist?.id === playlistId) {
      setCurrentPlaylist(null)
      setCurrentTrack(null)
      setCurrentTrackIndex(0)
    }
  }

  const updatePlaylist = (playlistId, updates) => {
    setPlaylists((prev) =>
      prev.map((playlist) =>
        playlist.id === playlistId ? { ...playlist, ...updates, updatedAt: new Date().toISOString() } : playlist,
      ),
    )

    // Update current playlist if it's the one being updated
    if (currentPlaylist?.id === playlistId) {
      setCurrentPlaylist((prev) => ({ ...prev, ...updates, updatedAt: new Date().toISOString() }))
    }
  }

  const addTrackToPlaylist = (playlistId, track) => {
    setPlaylists((prev) =>
      prev.map((playlist) => {
        if (playlist.id === playlistId) {
          // Check if track already exists in playlist
          const trackExists = playlist.tracks.some((t) => t.id === track.id)
          if (trackExists) {
            return playlist
          }

          const updatedPlaylist = {
            ...playlist,
            tracks: [...playlist.tracks, track],
            updatedAt: new Date().toISOString(),
          }

          // Update current playlist if it's the one being updated
          if (currentPlaylist?.id === playlistId) {
            setCurrentPlaylist(updatedPlaylist)
          }

          return updatedPlaylist
        }
        return playlist
      }),
    )
  }

  const removeTrackFromPlaylist = (playlistId, trackId) => {
    setPlaylists((prev) =>
      prev.map((playlist) => {
        if (playlist.id === playlistId) {
          const updatedPlaylist = {
            ...playlist,
            tracks: playlist.tracks.filter((track) => track.id !== trackId),
            updatedAt: new Date().toISOString(),
          }

          // Update current playlist if it's the one being updated
          if (currentPlaylist?.id === playlistId) {
            setCurrentPlaylist(updatedPlaylist)

            // If the removed track was currently playing, stop playback
            if (currentTrack?.id === trackId) {
              setCurrentTrack(null)
              setCurrentTrackIndex(0)
            }
          }

          return updatedPlaylist
        }
        return playlist
      }),
    )
  }

  const playPlaylist = (playlist, startIndex = 0) => {
    if (playlist.tracks.length === 0) return

    setCurrentPlaylist(playlist)
    setCurrentTrack(playlist.tracks[startIndex])
    setCurrentTrackIndex(startIndex)
  }

  const playTrack = (track, playlist = null, index = 0) => {
    setCurrentTrack(track)
    if (playlist) {
      setCurrentPlaylist(playlist)
      setCurrentTrackIndex(index)
    }
  }

  const nextTrack = () => {
    if (!currentPlaylist || currentPlaylist.tracks.length === 0) return

    const nextIndex = (currentTrackIndex + 1) % currentPlaylist.tracks.length
    setCurrentTrackIndex(nextIndex)
    setCurrentTrack(currentPlaylist.tracks[nextIndex])
  }

  const previousTrack = () => {
    if (!currentPlaylist || currentPlaylist.tracks.length === 0) return

    const prevIndex = currentTrackIndex === 0 ? currentPlaylist.tracks.length - 1 : currentTrackIndex - 1
    setCurrentTrackIndex(prevIndex)
    setCurrentTrack(currentPlaylist.tracks[prevIndex])
  }

  const getPlaylistById = (playlistId) => {
    return playlists.find((playlist) => playlist.id === playlistId)
  }

  const value = {
    playlists,
    currentPlaylist,
    currentTrack,
    currentTrackIndex,
    createPlaylist,
    deletePlaylist,
    updatePlaylist,
    addTrackToPlaylist,
    removeTrackFromPlaylist,
    playPlaylist,
    playTrack,
    nextTrack,
    previousTrack,
    getPlaylistById,
  }

  return <PlaylistContext.Provider value={value}>{children}</PlaylistContext.Provider>
}
