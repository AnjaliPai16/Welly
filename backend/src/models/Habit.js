const mongoose = require('mongoose');

const HabitSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    frequency: { type: String, enum: ['daily', 'weekly', 'monthly'], default: 'daily' }
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual: logs (1:N)
HabitSchema.virtual('logs', {
  ref: 'HabitLog',
  localField: '_id',
  foreignField: 'habit'
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

module.exports = mongoose.model('Habit', HabitSchema);