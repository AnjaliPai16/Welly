// src/models/JournalEntry.js
const mongoose = require('mongoose');

const JournalEntrySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, trim: true, default: '' },
    content: { type: String, trim: true },
    mood: { 
      type: String, 
      enum: ['neutral', 'happy', 'excited', 'love', 'blissful', 'worried', 'angry', 'sad', 'very-sad', 'crying'], 
      default: 'neutral' 
    },
    tags: [{ type: String, trim: true }],
    isFavorite: { type: Boolean, default: false },
    status: { type: String, enum: ['draft', 'saved', 'archived'], default: 'saved' }
  },
  { timestamps: true }
);

JournalEntrySchema.index({ user: 1, createdAt: -1 });
JournalEntrySchema.index({ user: 1, mood: 1 });
JournalEntrySchema.index({ user: 1, isFavorite: 1 });

module.exports = mongoose.model('JournalEntry', JournalEntrySchema);