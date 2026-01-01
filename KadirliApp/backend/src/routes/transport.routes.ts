import { Router } from 'express';
import { TransportStopController } from '../controllers/transport-stop.controller';
import { TransportRouteController } from '../controllers/transport-route.controller';
import { IntercityTripController } from '../controllers/intercity-trip.controller';

const router = Router();

// Stop routes
/**
 * GET /api/transport/stops
 * Get all stops
 */
router.get('/stops', TransportStopController.getStops);

/**
 * GET /api/transport/stops/:id
 * Get stop by ID
 */
router.get('/stops/:id', TransportStopController.getStopById);

/**
 * POST /api/transport/stops
 * Create a new stop
 */
router.post('/stops', TransportStopController.createStop);

/**
 * PATCH /api/transport/stops/:id
 * Update stop
 */
router.patch('/stops/:id', TransportStopController.updateStop);

/**
 * DELETE /api/transport/stops/:id
 * Delete stop
 */
router.delete('/stops/:id', TransportStopController.deleteStop);

// Route routes
/**
 * GET /api/transport/routes
 * Get all routes (with routeStops and stop details)
 * Query: ?includeStops=true|false
 */
router.get('/routes', TransportRouteController.getRoutes);

/**
 * GET /api/transport/routes/:id
 * Get route by ID (with routeStops and stop details)
 * Query: ?includeStops=true|false
 */
router.get('/routes/:id', TransportRouteController.getRouteById);

/**
 * POST /api/transport/routes
 * Create a new route
 */
router.post('/routes', TransportRouteController.createRoute);

/**
 * PATCH /api/transport/routes/:id
 * Update route
 */
router.patch('/routes/:id', TransportRouteController.updateRoute);

/**
 * DELETE /api/transport/routes/:id
 * Delete route
 */
router.delete('/routes/:id', TransportRouteController.deleteRoute);

// Intercity trip routes
/**
 * GET /api/transport/intercity
 * Get all intercity trips
 */
router.get('/intercity', IntercityTripController.getTrips);

/**
 * GET /api/transport/intercity/:id
 * Get trip by ID
 */
router.get('/intercity/:id', IntercityTripController.getTripById);

/**
 * POST /api/transport/intercity
 * Create a new trip
 */
router.post('/intercity', IntercityTripController.createTrip);

/**
 * PATCH /api/transport/intercity/:id
 * Update trip
 */
router.patch('/intercity/:id', IntercityTripController.updateTrip);

/**
 * DELETE /api/transport/intercity/:id
 * Delete trip
 */
router.delete('/intercity/:id', IntercityTripController.deleteTrip);

export default router;

