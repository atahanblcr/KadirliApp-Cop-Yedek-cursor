import { Request, Response, NextFunction } from 'express';
import { transportStopService } from '../services/transport-stop.service';
import { BadRequestError } from '../types/errors';

/**
 * Transport Stop Controller
 * Handles HTTP requests for transport stops
 */
export class TransportStopController {
  /**
   * GET /api/transport/stops
   * Get all stops
   */
  static async getStops(req: Request, res: Response, next: NextFunction) {
    try {
      const stops = await transportStopService.getStops();

      res.status(200).json({
        success: true,
        data: stops
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/transport/stops/:id
   * Get stop by ID
   */
  static async getStopById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new BadRequestError('Stop ID is required');
      }

      const stop = await transportStopService.getStopById(id);

      res.status(200).json({
        success: true,
        data: stop
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/transport/stops
   * Create a new stop
   */
  static async createStop(req: Request, res: Response, next: NextFunction) {
    try {
      const stop = await transportStopService.createStop(req.body);

      res.status(201).json({
        success: true,
        message: 'Stop created successfully',
        data: stop
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/transport/stops/:id
   * Update stop
   */
  static async updateStop(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new BadRequestError('Stop ID is required');
      }

      const stop = await transportStopService.updateStop(id, req.body);

      res.status(200).json({
        success: true,
        message: 'Stop updated successfully',
        data: stop
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/transport/stops/:id
   * Delete stop
   */
  static async deleteStop(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new BadRequestError('Stop ID is required');
      }

      await transportStopService.deleteStop(id);

      res.status(200).json({
        success: true,
        message: 'Stop deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

