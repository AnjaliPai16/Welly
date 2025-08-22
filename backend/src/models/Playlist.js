const mongoose = require('mongoose');

const PlaylistSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true }
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

PlaylistSchema.virtual('tracks', {
  ref: 'PlaylistTrack',
  localField: '_id',
  foreignField: 'playlist'
});

PlaylistSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  try {
    await this.model('PlaylistTrack').deleteMany({ playlist: this._id });
    next();
  } catch (e) {
    next(e);
  }
});

module.exports = mongoose.model('Playlist', PlaylistSchema);