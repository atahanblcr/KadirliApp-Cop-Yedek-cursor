import { Request, Response, NextFunction } from 'express';
import { intercityTripService } from '../services/intercity-trip.service';
import { BadRequestError } from '../types/errors';

/**
 * Intercity Trip Controller
 * Handles HTTP requests for intercity trips
 */
export class IntercityTripController {
  /**
   * GET /api/transport/intercity
   * Get all intercity trips
   */
  static async getTrips(req: Request, res: Response, next: NextFunction) {
    try {
      const trips = await intercityTripService.getTrips();

      res.status(200).json({
        success: true,
        data: trips
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/transport/intercity/:id
   * Get trip by ID
   */
  static async getTripById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new BadRequestError('Trip ID is required');
      }

      const trip = await intercityTripService.getTripById(id);

      res.status(200).json({
        success: true,
        data: trip
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/transport/intercity
   * Create a new trip
   */
  static async createTrip(req: Request, res: Response, next: NextFunction) {
    try {
      const trip = await intercityTripService.createTrip(req.body);

      res.status(201).json({
        success: true,
        message: 'Trip created successfully',
        data: trip
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/transport/intercity/:id
   * Update trip
   */
  static async updateTrip(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new BadRequestError('Trip ID is required');
      }

      const trip = await intercityTripService.updateTrip(id, req.body);

      res.status(200).json({
        success: true,
        message: 'Trip updated successfully',
        data: trip
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/transport/intercity/:id
   * Delete trip
   */
  static async deleteTrip(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new BadRequestError('Trip ID is required');
      }

      await intercityTripService.deleteTrip(id);

      res.status(200).json({
        success: true,
        message: 'Trip deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

