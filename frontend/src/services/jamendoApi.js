// Jamendo API service for music integration
const JAMENDO_API_BASE = "https://api.jamendo.com/v3.0"
const CLIENT_ID = "fdba5158" // You'll need to get this from Jamendo

class JamendoAPI {
  constructor() {
    this.clientId = CLIENT_ID
  }

  // Search for tracks
  async searchTracks(query, limit = 20) {
    try {
      const response = await fetch(
        `${JAMENDO_API_BASE}/tracks/?client_id=${this.clientId}&format=json&limit=${limit}&search=${encodeURIComponent(query)}&include=musicinfo&groupby=artist_id`,
      )
      const data = await response.json()
      return data.results || []
    } catch (error) {
      console.error("Error searching tracks:", error)
      return []
    }
  }

  // Get tracks by genre
  async getTracksByGenre(genre, limit = 20) {
    try {
      const response = await fetch(
        `${JAMENDO_API_BASE}/tracks/?client_id=${this.clientId}&format=json&limit=${limit}&tags=${genre}&include=musicinfo&groupby=artist_id`,
      )
      const data = await response.json()
      return data.results || []
    } catch (error) {
      console.error("Error fetching tracks by genre:", error)
      return []
    }
  }

  // Get popular tracks
  async getPopularTracks(limit = 20) {
    try {
      const response = await fetch(
        `${JAMENDO_API_BASE}/tracks/?client_id=${this.clientId}&format=json&limit=${limit}&order=popularity_total&include=musicinfo&groupby=artist_id`,
      )
      const data = await response.json()
      return data.results || []
    } catch (error) {
      console.error("Error fetching popular tracks:", error)
      return []
    }
  }

  // Get calming/relaxing tracks
  async getCalmingTracks(limit = 20) {
    const calmingTags = ["ambient", "chillout", "relaxation", "meditation", "peaceful"]
    const randomTag = calmingTags[Math.floor(Math.random() * calmingTags.length)]
    return this.getTracksByGenre(randomTag, limit)
  }
}

export default new JamendoAPI()
