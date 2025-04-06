const express = require('express');
const passport = require('passport');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  register,
  login,
  getMe,
  logout,
  forgotPassword,
  resetPassword,
  githubCallback,
  googleCallback
} = require('../controllers/auth.controller');

// Register and login routes
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/logout', protect, logout);

// Password reset routes
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

// GitHub OAuth routes
router.get('/github',
  passport.authenticate('github', { session: false })
);
router.get('/github/callback',
  passport.authenticate('github', { session: false, failureRedirect: '/account/login.html' }),
  githubCallback
);

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', { session: false, scope: ['profile', 'email'] })
);
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/account/login.html' }),
  googleCallback
);

module.exports = router; 