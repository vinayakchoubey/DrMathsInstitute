import express from 'express';
import { getModules, getModuleById, createModule, updateModule, deleteModule } from '../controllers/moduleController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
    .get(getModules)
    .post(protect, admin, createModule);

router.route('/:id')
    .get(getModuleById)
    .put(protect, admin, updateModule)
    .delete(protect, admin, deleteModule);

export default router;
