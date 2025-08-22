// src/models/Journal.js
const mongoose = require('mongoose');

const JournalEntrySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, trim: true, default: '' },
    content: { type: String, trim: true },
    mood: { type: String, enum: ['happy', 'sad', 'calm', 'anxious', 'angry', 'neutral', 'excited'], default: 'neutral' },
    tags: [{ type: String, trim: true }],
    favorite: { type: Boolean, default: false }
  },
  { timestamps: true }
);

JournalEntrySchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('JournalEntry', JournalEntrySchema);