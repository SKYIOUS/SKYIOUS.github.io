const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getUsers,
  getPendingUsers,
  getUser,
  updateUserApproval,
  updateUserRole,
  deleteUser,
  updateProfile,
  updatePassword
} = require('../controllers/user.controller');

// Routes for admin
router.get('/', protect, authorize('admin'), getUsers);
router.get('/pending', protect, authorize('admin'), getPendingUsers);
router.get('/:id', protect, authorize('admin'), getUser);
router.put('/:id/approval', protect, authorize('admin'), updateUserApproval);
router.put('/:id/role', protect, authorize('admin'), updateUserRole);
router.delete('/:id', protect, authorize('admin'), deleteUser);

// Routes for user profile management
router.put('/profile', protect, updateProfile);
router.put('/updatepassword', protect, updatePassword);

module.exports = router; 