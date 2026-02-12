import express from 'express';
import { getProHeroImages, getAdminHeroImages, addHeroImage, deleteHeroImage, updateHeroImage } from '../controllers/mobileHeroController';

const router = express.Router();

// Public route for fetching active images
router.get('/', getProHeroImages);

// Admin routes (You should add auth middleware here later, e.g. protect)
// For now, these are open but frontend will hide them from non-admins
router.get('/admin', getAdminHeroImages);
router.post('/', addHeroImage);
router.delete('/:id', deleteHeroImage);
router.put('/:id', updateHeroImage);

export default router;
