import { Router } from 'express';
import { EventController } from '../controllers/event.controller';

const router = Router();

/**
 * GET /api/events
 * Get active events (optionally filtered by date range)
 * Query: ?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&isActive=true|false
 */
router.get('/', EventController.getEvents);

/**
 * GET /api/events/:id
 * Get event by ID
 */
router.get('/:id', EventController.getEventById);

/**
 * POST /api/events
 * Create a new event
 */
router.post('/', EventController.createEvent);

/**
 * PATCH /api/events/:id
 * Update event
 */
router.patch('/:id', EventController.updateEvent);

/**
 * DELETE /api/events/:id
 * Delete event
 */
router.delete('/:id', EventController.deleteEvent);

export default router;

