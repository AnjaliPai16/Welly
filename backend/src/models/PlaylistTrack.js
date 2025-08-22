const mongoose = require('mongoose');

const PlaylistTrackSchema = new mongoose.Schema(
  {
    playlist: { type: mongoose.Schema.Types.ObjectId, ref: 'Playlist', required: true, index: true },
    title: { type: String, required: true, trim: true },
    artist: { type: String, trim: true },
    url: { type: String, trim: true },
    thumbnail: { type: String, trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('PlaylistTrack', PlaylistTrackSchema);