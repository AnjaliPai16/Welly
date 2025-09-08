
const JournalEntry = require('../models/JournalEntry');


exports.createJournal = async (req, res) => {
  try {
    const { title, content, mood, tags, isFavorite } = req.body;
    console.log('CREATE JOURNAL REQUEST:', { title, content, mood, tags, isFavorite, userId: req.user.id });
    
    const entry = await JournalEntry.create({
      user: req.user.id, 
      title,
      content,
      mood,
      tags,
      isFavorite
    });
    
    console.log('JOURNAL CREATED:', entry);
    res.status(201).json(entry);
  } catch (err) {
    console.error('JOURNAL CREATE ERROR:', err);
    res.status(400).json({ message: err.message });
  }
};


exports.getJournals = async (req, res) => {
  try {
    const entries = await JournalEntry.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getJournal = async (req, res) => {
  try {
    const entry = await JournalEntry.findOne({ _id: req.params.id, user: req.user.id });
    if (!entry) return res.status(404).json({ message: 'Journal not found' });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.updateJournal = async (req, res) => {
  try {
    const { title, content, mood, tags, isFavorite } = req.body;
    const entry = await JournalEntry.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { title, content, mood, tags, isFavorite },
      { new: true }
    );
    if (!entry) return res.status(404).json({ message: 'Journal not found' });
    res.json(entry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


exports.deleteJournal = async (req, res) => {
  try {
    const entry = await JournalEntry.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!entry) return res.status(404).json({ message: 'Journal not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};