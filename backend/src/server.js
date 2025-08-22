const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Debug log to confirm JWT_SECRET is loaded
console.log('JWT_SECRET from env:', process.env.JWT_SECRET);

// Connect to MongoDB
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Import routes
const authRoutes = require('./routes/authRoutes');
const journalRoutes = require('./routes/journalRoutes');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/journal', journalRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server Error' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));