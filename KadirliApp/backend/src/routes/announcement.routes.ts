import { Router } from 'express';
import { AnnouncementController } from '../controllers/announcement.controller';

const router = Router();

/**
 * GET /api/announcements
 * Get all announcements (optionally filtered by type)
 * Query: ?type=electricity|water|institution|education|general
 */
router.get('/', AnnouncementController.getAnnouncements);

/**
 * GET /api/announcements/:id
 * Get announcement by ID
 */
router.get('/:id', AnnouncementController.getAnnouncementById);

/**
 * POST /api/announcements
 * Create a new announcement
 */
router.post('/', AnnouncementController.createAnnouncement);

/**
 * PATCH /api/announcements/:id
 * Update announcement
 */
router.patch('/:id', AnnouncementController.updateAnnouncement);

/**
 * DELETE /api/announcements/:id
 * Delete announcement
 */
router.delete('/:id', AnnouncementController.deleteAnnouncement);

export default router;

