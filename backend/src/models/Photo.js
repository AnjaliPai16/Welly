const mongoose = require('mongoose');

const PhotoSchema = new mongoose.Schema(
  {
    album: { type: mongoose.Schema.Types.ObjectId, ref: 'Album', required: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    url: { type: String, required: true, trim: true },
    caption: { type: String, trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Photo', PhotoSchema);