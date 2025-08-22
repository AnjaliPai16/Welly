// src/controllers/journalController.js
const JournalEntry = require('../models/JournalEntry');

// Create new journal entry
exports.createJournal = async (req, res) => {
  try {
    const { title, content, mood, tags, favorite } = req.body;
    const entry = await JournalEntry.create({
      user: req.user.id, // comes from auth middleware
      title,
      content,
      mood,
      tags,
      favorite
    });
    res.status(201).json(entry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all journals for logged-in user
exports.getJournals = async (req, res) => {
  try {
    const entries = await JournalEntry.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single journal by id
exports.getJournal = async (req, res) => {
  try {
    const entry = await JournalEntry.findOne({ _id: req.params.id, user: req.user.id });
    if (!entry) return res.status(404).json({ message: 'Journal not found' });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update journal
exports.updateJournal = async (req, res) => {
  try {
    const { title, content, mood, tags, favorite } = req.body;
    const entry = await JournalEntry.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { title, content, mood, tags, favorite },
      { new: true }
    );
    if (!entry) return res.status(404).json({ message: 'Journal not found' });
    res.json(entry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete journal
exports.deleteJournal = async (req, res) => {
  try {
    const entry = await JournalEntry.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!entry) return res.status(404).json({ message: 'Journal not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};