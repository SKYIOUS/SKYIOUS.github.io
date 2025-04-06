const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  submitContactForm,
  getContactSubmissions,
  getContactSubmission,
  updateContactSubmission,
  deleteContactSubmission
} = require('../controllers/contact.controller');

// Public route for submitting contact form
router.post('/', submitContactForm);

// Admin routes for managing contact submissions
router.get('/', protect, authorize('admin'), getContactSubmissions);
router.get('/:id', protect, authorize('admin'), getContactSubmission);
router.put('/:id', protect, authorize('admin'), updateContactSubmission);
router.delete('/:id', protect, authorize('admin'), deleteContactSubmission);

module.exports = router; 