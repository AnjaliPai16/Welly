const mongoose = require('mongoose');

const PlaylistTrackSchema = new mongoose.Schema(
  {
    playlist: { type: mongoose.Schema.Types.ObjectId, ref: 'Playlist', required: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true }, // Optional for external tracks
    title: { type: String, required: true, trim: true },
    artist: { type: String, trim: true },
    artist_name: { type: String, trim: true }, // Alternative field name for compatibility
    url: { type: String, trim: true },
    thumbnail: { type: String, trim: true },
    duration: { type: Number }, // Duration in seconds
    externalId: { type: String }, // External service ID (e.g., Jamendo track ID)
    source: { type: String, enum: ['jamendo', 'upload', 'other'], default: 'other' }
  },
  { timestamps: true }
);

// Indexes for better query performance
PlaylistTrackSchema.index({ playlist: 1, createdAt: -1 });
PlaylistTrackSchema.index({ user: 1, externalId: 1 });

module.exports = mongoose.model('PlaylistTrack', PlaylistTrackSchema);