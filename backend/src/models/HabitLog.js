const mongoose = require('mongoose');

const HabitLogSchema = new mongoose.Schema(
  {
    habit: { type: mongoose.Schema.Types.ObjectId, ref: 'Habit', required: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    date: { type: Date, required: true },
    status: { type: Boolean, default: false }
  },
  { timestamps: true }
);


HabitLogSchema.index({ habit: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('HabitLog', HabitLogSchema);