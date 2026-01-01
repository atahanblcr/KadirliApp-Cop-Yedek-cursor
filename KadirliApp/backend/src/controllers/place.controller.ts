import { Request, Response, NextFunction } from 'express';
import { placeService } from '../services/place.service';
import { BadRequestError } from '../types/errors';

/**
 * Place Controller
 * Handles HTTP requests for places (tourist attractions)
 */
export class PlaceController {
  /**
   * GET /api/places
   * Get all places (ordered by title)
   */
  static async getPlaces(req: Request, res: Response, next: NextFunction) {
    try {
      const places = await placeService.getPlaces();

      res.status(200).json({
        success: true,
        data: places
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/places/:id
   * Get place by ID
   */
  static async getPlaceById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new BadRequestError('Place ID is required');
      }

      const place = await placeService.getPlaceById(id);

      res.status(200).json({
        success: true,
        data: place
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/places
   * Create a new place
   */
  static async createPlace(req: Request, res: Response, next: NextFunction) {
    try {
      const place = await placeService.createPlace(req.body);

      res.status(201).json({
        success: true,
        message: 'Place created successfully',
        data: place
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/places/:id
   * Update place
   */
  static async updatePlace(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new BadRequestError('Place ID is required');
      }

      const place = await placeService.updatePlace(id, req.body);

      res.status(200).json({
        success: true,
        message: 'Place updated successfully',
        data: place
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/places/:id
   * Delete place
   */
  static async deletePlace(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new BadRequestError('Place ID is required');
      }

      await placeService.deletePlace(id);

      res.status(200).json({
        success: true,
        message: 'Place deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

