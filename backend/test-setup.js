// Simple test script to verify backend setup
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

async function testSetup() {
  console.log('🧪 Testing Welly Backend Setup...\n');

  // Test 1: Environment Variables
  console.log('1. Checking Environment Variables:');
  const requiredEnvVars = [
    'MONGODB_URI',
    'JWT_SECRET',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET'
  ];

  let envVarsOk = true;
  requiredEnvVars.forEach(varName => {
    if (process.env[varName]) {
      console.log(`   ✅ ${varName}: ${varName.includes('SECRET') ? '***' : process.env[varName]}`);
    } else {
      console.log(`   ❌ ${varName}: Missing`);
      envVarsOk = false;
    }
  });

  if (!envVarsOk) {
    console.log('\n   ⚠️  Some environment variables are missing. Please check your .env file.');
  }

  // Test 2: Database Connection
  console.log('\n2. Testing Database Connection:');
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('   ✅ MongoDB connection successful');
    
    // Test model loading
    const User = require('./src/models/User');
    const JournalEntry = require('./src/models/JournalEntry');
    const Habit = require('./src/models/Habit');
    const Album = require('./src/models/Album');
    const Photo = require('./src/models/Photo');
    const Playlist = require('./src/models/Playlist');
    const PlaylistTrack = require('./src/models/PlaylistTrack');
    const GratitudeEntry = require('./src/models/GratitudeEntry');
    const HabitLog = require('./src/models/HabitLog');
    
    console.log('   ✅ All models loaded successfully');
    
    await mongoose.disconnect();
    console.log('   ✅ Database connection closed');
  } catch (error) {
    console.log(`   ❌ Database connection failed: ${error.message}`);
  }

  // Test 3: Cloudinary Configuration
  console.log('\n3. Testing Cloudinary Configuration:');
  try {
    const cloudinary = require('./src/config/cloudinary');
    console.log('   ✅ Cloudinary configuration loaded');
  } catch (error) {
    console.log(`   ❌ Cloudinary configuration failed: ${error.message}`);
  }

  // Test 4: Middleware Loading
  console.log('\n4. Testing Middleware Loading:');
  try {
    const { authenticateToken } = require('./src/middlewares/auth');
    const { uploadSingle, uploadMultiple } = require('./src/middlewares/photoUpload');
    console.log('   ✅ All middleware loaded successfully');
  } catch (error) {
    console.log(`   ❌ Middleware loading failed: ${error.message}`);
  }

  // Test 5: Controllers Loading
  console.log('\n5. Testing Controllers Loading:');
  try {
    require('./src/controllers/authController');
    require('./src/controllers/journalController');
    require('./src/controllers/albumController');
    require('./src/controllers/photoController');
    console.log('   ✅ All controllers loaded successfully');
  } catch (error) {
    console.log(`   ❌ Controllers loading failed: ${error.message}`);
  }

  // Test 6: Routes Loading
  console.log('\n6. Testing Routes Loading:');
  try {
    require('./src/routes/authRoutes');
    require('./src/routes/journalRoutes');
    require('./src/routes/albumRoutes');
    require('./src/routes/photoRoutes');
    console.log('   ✅ All routes loaded successfully');
  } catch (error) {
    console.log(`   ❌ Routes loading failed: ${error.message}`);
  }

  console.log('\n🎉 Setup test completed!');
  console.log('\n📝 Next steps:');
  console.log('   1. Make sure MongoDB is running');
  console.log('   2. Set up your Cloudinary account and add credentials to .env');
  console.log('   3. Run: npm run dev');
  console.log('   4. Test the health endpoint: GET http://localhost:5000/api/health');
}

// Run the test
testSetup().catch(console.error);

