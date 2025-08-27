const mongoose = require('mongoose');

const PhotoSchema = new mongoose.Schema(
  {
    album: { type: mongoose.Schema.Types.ObjectId, ref: 'Album', required: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, trim: true },
    note: { type: String, trim: true },
    // Cloudinary fields
    publicId: { type: String, required: true }, // Cloudinary public ID
    url: { type: String, required: true }, // Cloudinary secure URL
    thumbnail: { type: String }, // Cloudinary thumbnail URL
    width: { type: Number },
    height: { type: Number },
    format: { type: String },
    size: { type: Number }, // File size in bytes
    uploadedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// Indexes for better query performance
PhotoSchema.index({ album: 1, uploadedAt: -1 });
PhotoSchema.index({ user: 1, uploadedAt: -1 });
PhotoSchema.index({ publicId: 1 });

// Virtual for preview URL (use thumbnail if available, otherwise main URL)
PhotoSchema.virtual('preview').get(function() {
  return this.thumbnail || this.url;
});

// Ensure virtual fields are serialized
PhotoSchema.set('toJSON', { virtuals: true });
PhotoSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Photo', PhotoSchema);