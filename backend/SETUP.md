# Welly Backend Setup Guide

## Prerequisites
- Node.js (v14 or higher)
- MongoDB running locally or MongoDB Atlas account
- Cloudinary account

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend root directory with the following variables:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/welly

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d

# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## Cloudinary Setup

1. Go to [Cloudinary](https://cloudinary.com/) and create a free account
2. Get your credentials from the Dashboard:
   - Cloud Name
   - API Key
   - API Secret
3. Add these to your `.env` file

## Running the Backend

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Journal Entries
- `GET /api/journal` - Get user's journal entries
- `POST /api/journal` - Create new journal entry
- `PUT /api/journal/:id` - Update journal entry
- `DELETE /api/journal/:id` - Delete journal entry

### Albums
- `GET /api/albums` - Get user's albums
- `POST /api/albums` - Create new album
- `GET /api/albums/:id` - Get album by ID
- `PUT /api/albums/:id` - Update album
- `DELETE /api/albums/:id` - Delete album
- `GET /api/albums/stats` - Get album statistics

### Photos
- `POST /api/photos/album/:albumId/single` - Upload single photo
- `POST /api/photos/album/:albumId/multiple` - Upload multiple photos
- `GET /api/photos/album/:albumId` - Get photos by album
- `GET /api/photos/user/all` - Get all user photos
- `PATCH /api/photos/:photoId/note` - Update photo note
- `DELETE /api/photos/:photoId` - Delete photo

## File Upload

- Maximum file size: 10MB
- Supported formats: JPEG, PNG, GIF, WebP
- Photos are automatically optimized and stored in Cloudinary
- Thumbnails are generated automatically

## Database Models

The backend includes the following MongoDB models:
- User (with firstName, lastName, email, password)
- JournalEntry (with mood tracking, tags, favorites)
- Habit (with completion tracking, goals, colors)
- Album (with genres, colors, descriptions)
- Photo (with Cloudinary integration, notes)
- Playlist (with track management)
- PlaylistTrack (with external service integration)

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- User-specific data isolation
- File type validation
- File size limits
- CORS configuration

