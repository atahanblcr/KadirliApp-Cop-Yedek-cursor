import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

/**
 * GET /api/users
 * Get all users (protected route)
 * Returns list of users with id, phone, createdAt
 */
router.get('/', authenticate, AuthController.getAllUsers);

export default router;

