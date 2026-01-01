import { Router } from 'express';
import { DeathController } from '../controllers/death.controller';

const router = Router();

/**
 * GET /api/deaths
 * Get death notices (optionally filtered by date)
 * Query: ?date=YYYY-MM-DD
 */
router.get('/', DeathController.getDeathNotices);

/**
 * GET /api/deaths/:id
 * Get death notice by ID
 */
router.get('/:id', DeathController.getDeathNoticeById);

/**
 * POST /api/deaths
 * Create a new death notice
 */
router.post('/', DeathController.createDeathNotice);

/**
 * PATCH /api/deaths/:id
 * Update death notice
 */
router.patch('/:id', DeathController.updateDeathNotice);

/**
 * DELETE /api/deaths/:id
 * Delete death notice
 */
router.delete('/:id', DeathController.deleteDeathNotice);

export default router;

