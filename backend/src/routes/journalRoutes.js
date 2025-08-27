// src/routes/journalRoutes.js
const express = require('express');
const router = express.Router();
const journalController = require('../controllers/journalController');
const { authenticateToken } = require('../middlewares/auth'); // JWT middleware

// All routes are protected
router.use(authenticateToken);

// Create new journal
router.post('/', journalController.createJournal);

// Get all journals
router.get('/', journalController.getJournals);

// Get single journal by ID
router.get('/:id', journalController.getJournal);

// Update journal (title, content, mood, tags, favorite)
router.put('/:id', journalController.updateJournal);

// Delete journal
router.delete('/:id', journalController.deleteJournal);

// Extra endpoints for convenience
router.patch('/:id/favorite', async (req, res) => {
  try {
    const entry = await require('../models/JournalEntry').findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { isFavorite: req.body.isFavorite },
      { new: true }
    );
    if (!entry) return res.status(404).json({ message: 'Journal not found' });
    res.json(entry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.patch('/:id/tags', async (req, res) => {
  try {
    const entry = await require('../models/JournalEntry').findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { tags: req.body.tags },
      { new: true }
    );
    if (!entry) return res.status(404).json({ message: 'Journal not found' });
    res.json(entry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;