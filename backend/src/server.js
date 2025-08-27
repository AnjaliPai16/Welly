const dotenv = require('dotenv');

// Load env vars FIRST, before any other imports
dotenv.config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { isCloudinaryConfigured } = require('./config/cloudinary');

console.log('Cloudinary env check:', {
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ? 'SET' : 'NOT SET',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? 'SET' : 'NOT SET',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT SET'
});
// Debug log to confirm JWT_SECRET is loaded
console.log('JWT_SECRET from env:', process.env.JWT_SECRET);

// Connect to MongoDB
connectDB();

const app = express();

// CORS middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Body parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Import routes
const authRoutes = require('./routes/authRoutes');
const journalRoutes = require('./routes/journalRoutes');
const albumRoutes = require('./routes/albumRoutes');
const photoRoutes = require('./routes/photoRoutes');
const habitRoutes = require('./routes/habitRoutes');
const gratitudeRoutes = require('./routes/gratitudeRoutes');
const playlistRoutes = require('./routes/playlistRoutes');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/albums', albumRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/gratitude', gratitudeRoutes);
app.use('/api/playlists', playlistRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Welly Backend is running',
    cloudinaryConfigured: isCloudinaryConfigured()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server Error' });
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));