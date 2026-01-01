import { Request, Response, NextFunction } from 'express';
import { taxiRequestService } from '../services/taxi-request.service';
import { BadRequestError } from '../types/errors';
import { TaxiRequestStatus } from '@prisma/client';

/**
 * Taxi Request Controller
 * Handles HTTP requests for taxi requests
 */
export class TaxiRequestController {
  /**
   * POST /api/taxi-requests
   * Create a taxi request (protected - requires authentication)
   */
  static async createRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new BadRequestError('User ID is required');
      }

      const request = await taxiRequestService.createRequest(userId, req.body);

      res.status(201).json({
        success: true,
        message: 'Taxi request created successfully',
        data: request
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/taxi-requests/my-requests
   * Get user's own requests (protected)
   */
  static async getMyRequests(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new BadRequestError('User ID is required');
      }

      const requests = await taxiRequestService.getMyRequests(userId);

      res.status(200).json({
        success: true,
        data: requests
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/taxi-requests/driver-requests
   * Get driver's requests (protected - driver must own a taxi)
   */
  static async getDriverRequests(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new BadRequestError('User ID is required');
      }

      const requests = await taxiRequestService.getDriverRequests(userId);

      res.status(200).json({
        success: true,
        data: requests
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/taxi-requests/:id
   * Get request by ID (protected)
   */
  static async getRequestById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new BadRequestError('Request ID is required');
      }

      const request = await taxiRequestService.getRequestById(id);

      res.status(200).json({
        success: true,
        data: request
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/taxi-requests/:id/status
   * Update request status (protected)
   * Body: { status: "pending"|"accepted"|"in_progress"|"completed"|"cancelled" }
   */
  static async updateRequestStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      const { status } = req.body;

      if (!id) {
        throw new BadRequestError('Request ID is required');
      }
      if (!userId) {
        throw new BadRequestError('User ID is required');
      }
      if (!status) {
        throw new BadRequestError('Status is required');
      }

      // Validate status
      const validStatuses = Object.values(TaxiRequestStatus);
      if (!validStatuses.includes(status)) {
        throw new BadRequestError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
      }

      const request = await taxiRequestService.updateRequestStatus(id, userId, status);

      res.status(200).json({
        success: true,
        message: 'Request status updated successfully',
        data: request
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/taxi-requests/:id
   * Delete request (protected - only passenger can delete)
   */
  static async deleteRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      if (!id) {
        throw new BadRequestError('Request ID is required');
      }
      if (!userId) {
        throw new BadRequestError('User ID is required');
      }

      await taxiRequestService.deleteRequest(id, userId);

      res.status(200).json({
        success: true,
        message: 'Request deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

