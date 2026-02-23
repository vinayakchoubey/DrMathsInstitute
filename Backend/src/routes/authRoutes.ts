import express from 'express';
import {
    initiateSignup, finalizeSignup,
    initiateLogin, finalizeLogin,
    getProfile, updateProfile, googleLogin, resendOtp,
    forgotPassword, resetPassword
} from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/signup', initiateSignup);
router.post('/signup/verify', finalizeSignup);

router.post('/login', initiateLogin);
router.post('/login/verify', finalizeLogin);
router.post('/resend-otp', resendOtp);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.post('/google', googleLogin);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

export default router;
