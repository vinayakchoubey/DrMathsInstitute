import express from 'express';
import { getPromotionalVideo, updatePromotionalVideo } from '../controllers/promotionalVideoController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', getPromotionalVideo);
router.put('/', protect, admin, updatePromotionalVideo);

export default router;
