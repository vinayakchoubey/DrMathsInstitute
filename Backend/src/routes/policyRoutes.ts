import express from 'express';
import { getPolicies, addPolicy, updatePolicy, deletePolicy } from '../controllers/policyController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
    .get(getPolicies)
    .post(protect, admin, addPolicy);

router.route('/:id')
    .put(protect, admin, updatePolicy)
    .delete(protect, admin, deletePolicy);

export default router;
