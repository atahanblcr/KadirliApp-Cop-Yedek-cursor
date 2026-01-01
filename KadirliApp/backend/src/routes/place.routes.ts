import { Router } from 'express';
import { PlaceController } from '../controllers/place.controller';

const router = Router();

/**
 * GET /api/places
 * Get all places (ordered by title)
 */
router.get('/', PlaceController.getPlaces);

/**
 * GET /api/places/:id
 * Get place by ID
 */
router.get('/:id', PlaceController.getPlaceById);

/**
 * POST /api/places
 * Create a new place
 */
router.post('/', PlaceController.createPlace);

/**
 * PATCH /api/places/:id
 * Update place
 */
router.patch('/:id', PlaceController.updatePlace);

/**
 * DELETE /api/places/:id
 * Delete place
 */
router.delete('/:id', PlaceController.deletePlace);

export default router;

