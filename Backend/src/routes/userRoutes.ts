import express from 'express';
import { protect, admin } from '../middleware/authMiddleware';
import { getAllUsers, toggleUserVerification } from '../controllers/userController';

const router = express.Router();

// Get all users (Admin only)
router.get('/', protect, admin, getAllUsers);

// Toggle verification (Admin only)
router.put('/:id/verify', protect, admin, toggleUserVerification);

export default router;
