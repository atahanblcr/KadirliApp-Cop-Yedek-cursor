import { Router } from 'express';
import { ProfileController } from '../controllers/profile.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All profile routes require authentication
router.use(authenticate);

/**
 * GET /api/profiles
 * Get current user profile
 * Headers: Authorization: Bearer <token>
 */
router.get('/', ProfileController.getProfile);

/**
 * PATCH /api/profiles
 * Update user profile
 * Headers: Authorization: Bearer <token>
 * Body: { fullName?: string, neighborhood?: string }
 */
router.patch('/', ProfileController.updateProfile);

export default router;

