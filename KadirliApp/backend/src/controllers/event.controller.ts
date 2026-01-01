import { Request, Response, NextFunction } from 'express';
import { eventService } from '../services/event.service';
import { BadRequestError } from '../types/errors';

/**
 * Event Controller
 * Handles HTTP requests for events
 */
export class EventController {
  /**
   * GET /api/events
   * Get active events (optionally filtered by date range)
   * Query params: ?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&isActive=true|false
   */
  static async getEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const { startDate, endDate, isActive } = req.query;

      const filters = {
        startDate: startDate as string | undefined,
        endDate: endDate as string | undefined,
        isActive: isActive === 'false' ? false : undefined
      };

      const events = await eventService.getEvents(filters);

      res.status(200).json({
        success: true,
        data: events
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/events/:id
   * Get event by ID
   */
  static async getEventById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new BadRequestError('Event ID is required');
      }

      const event = await eventService.getEventById(id);

      res.status(200).json({
        success: true,
        data: event
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/events
   * Create a new event
   */
  static async createEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const event = await eventService.createEvent(req.body);

      res.status(201).json({
        success: true,
        message: 'Event created successfully',
        data: event
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/events/:id
   * Update event
   */
  static async updateEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new BadRequestError('Event ID is required');
      }

      const event = await eventService.updateEvent(id, req.body);

      res.status(200).json({
        success: true,
        message: 'Event updated successfully',
        data: event
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/events/:id
   * Delete event
   */
  static async deleteEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new BadRequestError('Event ID is required');
      }

      await eventService.deleteEvent(id);

      res.status(200).json({
        success: true,
        message: 'Event deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

