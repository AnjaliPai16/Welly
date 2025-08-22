const mongoose = require('mongoose');

const AlbumSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true }
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

AlbumSchema.virtual('photos', {
  ref: 'Photo',
  localField: '_id',
  foreignField: 'album'
});

AlbumSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  try {
    await this.model('Photo').deleteMany({ album: this._id });
    next();
  } catch (e) {
    next(e);
  }
});

module.exports = mongoose.model('Album', AlbumSchema);