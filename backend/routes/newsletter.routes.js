const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  subscribe,
  unsubscribe,
  getSubscribers,
  sendNewsletter
} = require('../controllers/newsletter.controller');

// Public routes
router.post('/subscribe', subscribe);
router.post('/unsubscribe', unsubscribe);
router.get('/unsubscribe', unsubscribe); // For unsubscribe links in emails

// Admin routes
router.get('/subscribers', protect, authorize('admin'), getSubscribers);
router.post('/send', protect, authorize('admin'), sendNewsletter);

module.exports = router; 