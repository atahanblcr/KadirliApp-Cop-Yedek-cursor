import { Router } from 'express';
import { PharmacyController } from '../controllers/pharmacy.controller';

const router = Router();

/**
 * GET /api/pharmacy
 * Get duty pharmacies (optionally filtered by date)
 * Query: ?date=YYYY-MM-DD
 */
router.get('/', PharmacyController.getDutyPharmacies);

/**
 * GET /api/pharmacy/:id
 * Get pharmacy by ID
 */
router.get('/:id', PharmacyController.getPharmacyById);

/**
 * POST /api/pharmacy
 * Create a new pharmacy
 */
router.post('/', PharmacyController.createPharmacy);

/**
 * PATCH /api/pharmacy/:id
 * Update pharmacy
 */
router.patch('/:id', PharmacyController.updatePharmacy);

/**
 * DELETE /api/pharmacy/:id
 * Delete pharmacy
 */
router.delete('/:id', PharmacyController.deletePharmacy);

export default router;

