import express from 'express';
import { getScholars, addScholar, updateScholar, deleteScholar } from '../controllers/scholarController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
    .get(getScholars)
    .post(protect, admin, addScholar);

router.route('/:id')
    .put(protect, admin, updateScholar)
    .delete(protect, admin, deleteScholar);

export default router;
