const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema(
  {
    sender: { type: String, enum: ['user', 'welly'], required: true },
    text: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const ChatSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    messages: { type: [ChatMessageSchema], default: [] }
  },
  { timestamps: true }
);

// useful indexes for retrieving recent conversation quickly
ChatSchema.index({ user: 1, 'messages.createdAt': -1 });
ChatSchema.index({ user: 1, updatedAt: -1 });

module.exports = mongoose.model('Chat', ChatSchema);
