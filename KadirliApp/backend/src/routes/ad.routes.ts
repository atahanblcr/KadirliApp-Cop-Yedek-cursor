import { Router } from 'express';
import { AdController } from '../controllers/ad.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

/**
 * GET /api/ads
 * Get active ads (public - no authentication required)
 * Query: ?type=second_hand|zero_product|...&search=keyword
 */
router.get('/', AdController.getActiveAds);

/**
 * GET /api/ads/:id
 * Get ad by ID (public)
 */
router.get('/:id', AdController.getAdById);

/**
 * POST /api/ads
 * Create a new ad (protected - requires authentication)
 */
router.post('/', authenticate, AdController.createAd);

/**
 * PATCH /api/ads/:id
 * Update ad (protected - only owner can update)
 */
router.patch('/:id', authenticate, AdController.updateAd);

/**
 * DELETE /api/ads/:id
 * Delete ad (protected - only owner can delete)
 */
router.delete('/:id', authenticate, AdController.deleteAd);

export default router;

