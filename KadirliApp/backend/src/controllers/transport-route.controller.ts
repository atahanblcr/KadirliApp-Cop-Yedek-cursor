import { Request, Response, NextFunction } from 'express';
import { transportRouteService } from '../services/transport-route.service';
import { BadRequestError } from '../types/errors';

/**
 * Transport Route Controller
 * Handles HTTP requests for transport routes
 */
export class TransportRouteController {
  /**
   * GET /api/transport/routes
   * Get all routes (with routeStops and stop details)
   * Query: ?includeStops=true|false (default: true)
   */
  static async getRoutes(req: Request, res: Response, next: NextFunction) {
    try {
      const includeStops = req.query.includeStops !== 'false';

      const routes = await transportRouteService.getRoutes(includeStops);

      res.status(200).json({
        success: true,
        data: routes
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/transport/routes/:id
   * Get route by ID (with routeStops and stop details)
   * Query: ?includeStops=true|false (default: true)
   */
  static async getRouteById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const includeStops = req.query.includeStops !== 'false';

      if (!id) {
        throw new BadRequestError('Route ID is required');
      }

      const route = await transportRouteService.getRouteById(id, includeStops);

      res.status(200).json({
        success: true,
        data: route
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/transport/routes
   * Create a new route
   */
  static async createRoute(req: Request, res: Response, next: NextFunction) {
    try {
      const route = await transportRouteService.createRoute(req.body);

      res.status(201).json({
        success: true,
        message: 'Route created successfully',
        data: route
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/transport/routes/:id
   * Update route
   */
  static async updateRoute(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new BadRequestError('Route ID is required');
      }

      const route = await transportRouteService.updateRoute(id, req.body);

      res.status(200).json({
        success: true,
        message: 'Route updated successfully',
        data: route
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/transport/routes/:id
   * Delete route
   */
  static async deleteRoute(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new BadRequestError('Route ID is required');
      }

      await transportRouteService.deleteRoute(id);

      res.status(200).json({
        success: true,
        message: 'Route deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

