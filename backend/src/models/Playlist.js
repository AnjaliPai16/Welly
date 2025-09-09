const mongoose = require('mongoose');

const PlaylistSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    // coverImage: { type: String, trim: true },
    isPublic: { type: Boolean, default: false },
    tags: [{ type: String, trim: true }]
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

PlaylistSchema.virtual('tracks', {
  ref: 'PlaylistTrack',
  localField: '_id',
  foreignField: 'playlist'
});

// Virtual for track count
PlaylistSchema.virtual('trackCount').get(function() {
  return this.tracks ? this.tracks.length : 0;
});

PlaylistSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  try {
    await this.model('PlaylistTrack').deleteMany({ playlist: this._id });
    next();
  } catch (e) {
    next(e);
  }
});

// Indexes for better query performance
PlaylistSchema.index({ user: 1, isPublic: 1 });
PlaylistSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Playlist', PlaylistSchema);