import express from 'express';
import { getCourses, getCourseById, createCourse, updateCourse, deleteCourse, getCourseBuyers } from '../controllers/courseController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
    .get(getCourses)
    .post(protect, admin, createCourse);

router.route('/:id')
    .get(getCourseById) 
    .put(protect, admin, updateCourse)
    .delete(protect, admin, deleteCourse);

router.get('/:id/buyers', protect, admin, getCourseBuyers);

export default router;
