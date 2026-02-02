import express from 'express';
import { getAbout, updateAbout, deleteAbout, getMembers, createMember, updateMember, deleteMember } from '../controllers/aboutController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', getAbout);
router.put('/', protect, admin, updateAbout);
router.delete('/', protect, admin, deleteAbout);

// Members routes
router.get('/members', getMembers);
router.post('/members', protect, admin, createMember);
router.put('/members/:id', protect, admin, updateMember);
router.delete('/members/:id', protect, admin, deleteMember);

export default router;
