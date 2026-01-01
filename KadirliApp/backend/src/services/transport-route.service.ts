import { TransportRoute } from '@prisma/client';
import prisma from '../lib/prisma';
import { BadRequestError, NotFoundError } from '../types/errors';

export interface CreateTransportRouteDto {
  title: string;
  startTime: string; // Format: "HH:mm:ss"
  endTime: string;   // Format: "HH:mm:ss"
  frequencyMin: number;
}

/**
 * Transport Route Service
 * Handles transport route business logic
 */
class TransportRouteService {
  /**
   * Get all routes (with routeStops and stop details)
   */
  async getRoutes(includeStops: boolean = true): Promise<TransportRoute[]> {
    const routes = await prisma.transportRoute.findMany({
      include: includeStops ? {
        routeStops: {
          include: {
            stop: true
          },
          orderBy: {
            minutesFromStart: 'asc'
          }
        }
      } : undefined,
      orderBy: {
        title: 'asc'
      }
    });

    return routes;
  }

  /**
   * Get route by ID (with routeStops and stop details)
   */
  async getRouteById(id: string, includeStops: boolean = true): Promise<TransportRoute> {
    const route = await prisma.transportRoute.findUnique({
      where: { id },
      include: includeStops ? {
        routeStops: {
          include: {
            stop: true
          },
          orderBy: {
            minutesFromStart: 'asc'
          }
        }
      } : undefined
    });

    if (!route) {
      throw new NotFoundError('Transport route not found');
    }

    return route;
  }

  /**
   * Create a new route
   */
  async createRoute(data: CreateTransportRouteDto): Promise<TransportRoute> {
    // Validate required fields
    if (!data.title || !data.startTime || !data.endTime || data.frequencyMin === undefined) {
      throw new BadRequestError('Title, startTime, endTime, and frequencyMin are required');
    }

    // Validate time format (HH:mm:ss)
    const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
    if (!timeRegex.test(data.startTime)) {
      throw new BadRequestError('startTime must be in HH:mm:ss format');
    }
    if (!timeRegex.test(data.endTime)) {
      throw new BadRequestError('endTime must be in HH:mm:ss format');
    }

    // Validate frequency
    if (typeof data.frequencyMin !== 'number' || data.frequencyMin < 1) {
      throw new BadRequestError('frequencyMin must be a positive number');
    }

    const route = await prisma.transportRoute.create({
      data: {
        title: data.title,
        startTime: data.startTime,
        endTime: data.endTime,
        frequencyMin: data.frequencyMin
      }
    });

    return route;
  }

  /**
   * Update route
   */
  async updateRoute(id: string, data: Partial<CreateTransportRouteDto>): Promise<TransportRoute> {
    // Check if exists
    await this.getRouteById(id, false);

    const updateData: any = {};
    
    if (data.title) updateData.title = data.title;
    
    if (data.startTime) {
      const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
      if (!timeRegex.test(data.startTime)) {
        throw new BadRequestError('startTime must be in HH:mm:ss format');
      }
      updateData.startTime = data.startTime;
    }
    
    if (data.endTime) {
      const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
      if (!timeRegex.test(data.endTime)) {
        throw new BadRequestError('endTime must be in HH:mm:ss format');
      }
      updateData.endTime = data.endTime;
    }
    
    if (data.frequencyMin !== undefined) {
      if (typeof data.frequencyMin !== 'number' || data.frequencyMin < 1) {
        throw new BadRequestError('frequencyMin must be a positive number');
      }
      updateData.frequencyMin = data.frequencyMin;
    }

    const route = await prisma.transportRoute.update({
      where: { id },
      data: updateData
    });

    return route;
  }

  /**
   * Delete route
   */
  async deleteRoute(id: string): Promise<void> {
    await this.getRouteById(id, false);
    // Note: Cascade delete will handle related routeStops
    await prisma.transportRoute.delete({
      where: { id }
    });
  }
}

// Export singleton instance
export const transportRouteService = new TransportRouteService();

