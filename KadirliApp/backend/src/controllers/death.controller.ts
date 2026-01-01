import { Request, Response, NextFunction } from 'express';
import { deathService } from '../services/death.service';
import { BadRequestError } from '../types/errors';

/**
 * Death Notice Controller
 * Handles HTTP requests for death notices
 */
export class DeathController {
  /**
   * GET /api/deaths
   * Get death notices (optionally filtered by date)
   * Query params: ?date=YYYY-MM-DD (optional)
   */
  static async getDeathNotices(req: Request, res: Response, next: NextFunction) {
    try {
      const { date } = req.query;
      const dateStr = date as string | undefined;

      const deaths = await deathService.getDeathNotices(dateStr);

      res.status(200).json({
        success: true,
        data: deaths
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/deaths/:id
   * Get death notice by ID
   */
  static async getDeathNoticeById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new BadRequestError('Death notice ID is required');
      }

      const deathNotice = await deathService.getDeathNoticeById(id);

      res.status(200).json({
        success: true,
        data: deathNotice
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/deaths
   * Create a new death notice
   */
  static async createDeathNotice(req: Request, res: Response, next: NextFunction) {
    try {
      const deathNotice = await deathService.createDeathNotice(req.body);

      res.status(201).json({
        success: true,
        message: 'Death notice created successfully',
        data: deathNotice
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/deaths/:id
   * Update death notice
   */
  static async updateDeathNotice(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new BadRequestError('Death notice ID is required');
      }

      const deathNotice = await deathService.updateDeathNotice(id, req.body);

      res.status(200).json({
        success: true,
        message: 'Death notice updated successfully',
        data: deathNotice
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/deaths/:id
   * Delete death notice
   */
  static async deleteDeathNotice(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new BadRequestError('Death notice ID is required');
      }

      await deathService.deleteDeathNotice(id);

      res.status(200).json({
        success: true,
        message: 'Death notice deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

