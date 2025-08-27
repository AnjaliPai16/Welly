const mongoose = require('mongoose');

const AlbumSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    genre: { 
      type: String, 
      enum: ['personal', 'group', 'special', 'family'], 
      default: 'personal' 
    },
    color: { type: String, required: true, default: 'bg-gradient-to-br from-[#D4B896] to-[#E8D5B7]' },
    icon: { type: String, required: true, default: 'Camera', enum: ['Camera', 'Users', 'Calendar', 'Heart'] },
    photoCount: { type: Number, default: 0 },
    isPublic: { type: Boolean, default: false }
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

AlbumSchema.virtual('photos', {
  ref: 'Photo',
  localField: '_id',
  foreignField: 'album'
});

// Update photo count when photos are added/removed
AlbumSchema.methods.updatePhotoCount = async function() {
  const Photo = mongoose.model('Photo');
  const count = await Photo.countDocuments({ album: this._id });
  this.photoCount = count;
  return this.save();
};

AlbumSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  try {
    await this.model('Photo').deleteMany({ album: this._id });
    next();
  } catch (e) {
    next(e);
  }
});

// Indexes for better query performance
AlbumSchema.index({ user: 1, genre: 1 });
AlbumSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Album', AlbumSchema);