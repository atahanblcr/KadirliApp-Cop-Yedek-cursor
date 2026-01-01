import { Router } from 'express';
import { TaxiRequestController } from '../controllers/taxi-request.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All taxi request routes require authentication
router.use(authenticate);

/**
 * POST /api/taxi-requests
 * Create a taxi request
 * Body: { taxiId: string, pickupLatitude: number, pickupLongitude: number, passengerPhone?: string }
 */
router.post('/', TaxiRequestController.createRequest);

/**
 * GET /api/taxi-requests/my-requests
 * Get user's own requests
 */
router.get('/my-requests', TaxiRequestController.getMyRequests);

/**
 * GET /api/taxi-requests/driver-requests
 * Get driver's requests (driver must own a taxi)
 */
router.get('/driver-requests', TaxiRequestController.getDriverRequests);

/**
 * GET /api/taxi-requests/:id
 * Get request by ID
 */
router.get('/:id', TaxiRequestController.getRequestById);

/**
 * PATCH /api/taxi-requests/:id/status
 * Update request status
 * Body: { status: "pending"|"accepted"|"in_progress"|"completed"|"cancelled" }
 */
router.patch('/:id/status', TaxiRequestController.updateRequestStatus);

/**
 * DELETE /api/taxi-requests/:id
 * Delete request (only passenger can delete)
 */
router.delete('/:id', TaxiRequestController.deleteRequest);

export default router;

