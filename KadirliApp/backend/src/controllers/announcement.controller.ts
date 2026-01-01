import { Request, Response, NextFunction } from 'express';
import { announcementService } from '../services/announcement.service';
import { BadRequestError } from '../types/errors';
import { AnnouncementType } from '@prisma/client';

/**
 * Announcement Controller
 * Handles HTTP requests for announcements
 */
export class AnnouncementController {
  /**
   * GET /api/announcements
   * Get all announcements (optionally filtered by type)
   * Query params: ?type=electricity|water|institution|education|general (optional)
   */
  static async getAnnouncements(req: Request, res: Response, next: NextFunction) {
    try {
      const { type } = req.query;
      const announcementType = type ? (type as AnnouncementType) : undefined;

      // Validate type if provided
      if (announcementType) {
        const validTypes = Object.values(AnnouncementType);
        if (!validTypes.includes(announcementType)) {
          throw new BadRequestError(`Invalid type. Must be one of: ${validTypes.join(', ')}`);
        }
      }

      const announcements = await announcementService.getAnnouncements(announcementType);

      res.status(200).json({
        success: true,
        data: announcements
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/announcements/:id
   * Get announcement by ID
   */
  static async getAnnouncementById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new BadRequestError('Announcement ID is required');
      }

      const announcement = await announcementService.getAnnouncementById(id);

      res.status(200).json({
        success: true,
        data: announcement
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/announcements
   * Create a new announcement
   */
  static async createAnnouncement(req: Request, res: Response, next: NextFunction) {
    try {
      const announcement = await announcementService.createAnnouncement(req.body);

      res.status(201).json({
        success: true,
        message: 'Announcement created successfully',
        data: announcement
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/announcements/:id
   * Update announcement
   */
  static async updateAnnouncement(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new BadRequestError('Announcement ID is required');
      }

      const announcement = await announcementService.updateAnnouncement(id, req.body);

      res.status(200).json({
        success: true,
        message: 'Announcement updated successfully',
        data: announcement
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/announcements/:id
   * Delete announcement
   */
  static async deleteAnnouncement(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new BadRequestError('Announcement ID is required');
      }

      await announcementService.deleteAnnouncement(id);

      res.status(200).json({
        success: true,
        message: 'Announcement deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

