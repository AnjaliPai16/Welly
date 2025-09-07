const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const admin = require('../config/firebase');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  
  console.log('REGISTER REQUEST:', { firstName, lastName, email, password: password ? '[HIDDEN]' : 'MISSING' });

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({ firstName, lastName, email, password });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const response = {
      token,
      user: {
        id: user._id,
        name: user.fullName,
        email: user.email,
      },
    };
    
    console.log('REGISTER SUCCESS:', response);
    res.status(201).json(response);
  } catch (err) {
    console.error('REGISTER ERROR:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  const { email, password } = req.body;
  console.log('LOGIN ATTEMPT:', { email, password });

  try {
    const user = await User.findOne({ email });
    console.log('USER FOUND:', user);

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('PASSWORD MATCH:', isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.fullName,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('LOGIN ERROR:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Login with Firebase OAuth
// @route   POST /api/auth/firebase
// @access  Public
const loginWithFirebase = async (req, res) => {
  const { idToken, email, name, photoURL } = req.body;
  
  console.log('FIREBASE LOGIN REQUEST:', { email, name, photoURL });

  try {
    // Check if Firebase Admin SDK is initialized
    if (!admin.apps.length) {
      return res.status(500).json({ 
        message: 'Firebase Admin SDK not initialized. Please check server configuration.' 
      });
    }

    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    console.log('FIREBASE TOKEN VERIFIED:', decodedToken);

    // Check if user exists in our database
    let user = await User.findOne({ email: decodedToken.email });
    
    if (!user) {
      // Create new user if they don't exist
      const [firstName, ...lastNameParts] = (name || email.split('@')[0]).split(' ');
      const lastName = lastNameParts.join(' ') || '';
      
      user = new User({
        firstName,
        lastName,
        email: decodedToken.email,
        photoURL: photoURL || '',
        // No password for OAuth users
        password: null
      });
      
      await user.save();
      console.log('NEW FIREBASE USER CREATED:', user);
    } else {
      // Update existing user with latest info
      if (photoURL && photoURL !== user.photoURL) {
        user.photoURL = photoURL;
        await user.save();
      }
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.fullName,
        email: user.email,
        photoURL: user.photoURL
      },
    });
  } catch (err) {
    console.error('FIREBASE LOGIN ERROR:', err);
    res.status(500).json({ message: 'Firebase authentication failed', error: err.message });
  }
};

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error('GETME ERROR:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { register, login, loginWithFirebase, getMe };