import { Request, Response, NextFunction } from 'express';
import { adService } from '../services/ad.service';
import { BadRequestError } from '../types/errors';
import { AdType } from '@prisma/client';

/**
 * Ad Controller
 * Handles HTTP requests for ads
 */
export class AdController {
  /**
   * GET /api/ads
   * Get active ads (public - no authentication required)
   * Query: ?type=second_hand|zero_product|...&search=keyword
   */
  static async getActiveAds(req: Request, res: Response, next: NextFunction) {
    try {
      const { type, search } = req.query;

      const filters = {
        type: type ? (type as AdType) : undefined,
        search: search as string | undefined
      };

      const ads = await adService.getActiveAds(filters);

      res.status(200).json({
        success: true,
        data: ads
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/ads/:id
   * Get ad by ID (public)
   */
  static async getAdById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new BadRequestError('Ad ID is required');
      }

      const ad = await adService.getAdById(id);

      res.status(200).json({
        success: true,
        data: ad
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/ads
   * Create a new ad (protected - requires authentication)
   */
  static async createAd(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new BadRequestError('User ID is required');
      }

      const ad = await adService.createAd(userId, req.body);

      res.status(201).json({
        success: true,
        message: 'Ad created successfully',
        data: ad
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/ads/:id
   * Update ad (protected - only owner can update)
   */
  static async updateAd(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      if (!id) {
        throw new BadRequestError('Ad ID is required');
      }
      if (!userId) {
        throw new BadRequestError('User ID is required');
      }

      const ad = await adService.updateAd(id, userId, req.body);

      res.status(200).json({
        success: true,
        message: 'Ad updated successfully',
        data: ad
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/ads/:id
   * Delete ad (protected - only owner can delete)
   */
  static async deleteAd(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      if (!id) {
        throw new BadRequestError('Ad ID is required');
      }
      if (!userId) {
        throw new BadRequestError('User ID is required');
      }

      await adService.deleteAd(id, userId);

      res.status(200).json({
        success: true,
        message: 'Ad deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

