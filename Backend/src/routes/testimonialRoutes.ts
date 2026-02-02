import express from 'express';
import { getTestimonials, addTestimonial, updateTestimonial, deleteTestimonial } from '../controllers/testimonialController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
    .get(getTestimonials)
    .post(protect, admin, addTestimonial);

router.route('/:id')
    .put(protect, admin, updateTestimonial)
    .delete(protect, admin, deleteTestimonial);

export default router;
