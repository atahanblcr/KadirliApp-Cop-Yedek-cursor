import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();

/**
 * POST /api/auth/otp
 * Send OTP to phone number
 * Body: { phone: string }
 */
router.post('/otp', AuthController.sendOTP);

/**
 * POST /api/auth/verify
 * Verify OTP and get JWT token
 * Body: { phone: string, token: string }
 */
router.post('/verify', AuthController.verifyOTP);

export default router;

