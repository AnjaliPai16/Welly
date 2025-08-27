const mongoose = require('mongoose');

const HabitSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    frequency: { type: String, enum: ['daily', 'weekly', 'monthly'], default: 'daily' },
    icon: { type: String, required: true, default: '📝' },
    color: { type: String, required: true, default: '#4A90E2' },
    goalCount: { type: Number, required: true, default: 1 },
    goalUnit: { type: String, required: true, default: 'time' },
    completedDates: [{ type: String }], // Array of date strings in YYYY-MM-DD format
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual: logs (1:N)
HabitSchema.virtual('logs', {
  ref: 'HabitLog',
  localField: '_id',
  foreignField: 'habit'
});

// Virtual: completion rate for current month
HabitSchema.virtual('monthlyCompletionRate').get(function() {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  const monthDates = this.completedDates.filter(dateStr => {
    const date = new Date(dateStr);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });
  
  return Math.round((monthDates.length / daysInMonth) * 100);
});

// Cascade delete logs when a Habit document is deleted via deleteOne({ document: true })
HabitSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  try {
    await this.model('HabitLog').deleteMany({ habit: this._id });
    next();
  } catch (e) {
    next(e);
  }
});

// Indexes for better query performance
HabitSchema.index({ user: 1, isActive: 1 });
HabitSchema.index({ user: 1, frequency: 1 });

module.exports = mongoose.model('Habit', HabitSchema);