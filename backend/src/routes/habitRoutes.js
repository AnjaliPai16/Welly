const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth');
const {
  createHabit,
  getUserHabits,
  getHabitById,
  updateHabit,
  deleteHabit,
  toggleHabitCompletion,
  getHabitStats
} = require('../controllers/habitController');

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Create new habit
router.post('/', createHabit);

// Get all habits for user
router.get('/', getUserHabits);

// Get habit statistics
router.get('/stats', getHabitStats);

// Get habit by ID
router.get('/:habitId', getHabitById);

// Update habit
router.put('/:habitId', updateHabit);

// Delete habit
router.delete('/:habitId', deleteHabit);

// Toggle habit completion
router.patch('/:habitId/toggle', toggleHabitCompletion);

module.exports = router;

