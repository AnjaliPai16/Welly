const mongoose = require('mongoose');

const GratitudeEntrySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    note: { type: String, required: true, trim: true },
    tags: [{ type: String, trim: true }]
  },
  { timestamps: true }
);

GratitudeEntrySchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('GratitudeEntry', GratitudeEntrySchema);