const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middlewares/auth');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected route (requires token)
router.get('/me', auth, authController.getMe);

module.exports = router;