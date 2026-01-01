import { TransportStop } from '@prisma/client';
import prisma from '../lib/prisma';
import { BadRequestError, NotFoundError } from '../types/errors';

export interface CreateTransportStopDto {
  name: string;
  latitude: number;
  longitude: number;
}

/**
 * Transport Stop Service
 * Handles transport stop business logic
 */
class TransportStopService {
  /**
   * Get all stops
   */
  async getStops(): Promise<TransportStop[]> {
    const stops = await prisma.transportStop.findMany({
      orderBy: {
        name: 'asc'
      }
    });

    return stops;
  }

  /**
   * Get stop by ID
   */
  async getStopById(id: string): Promise<TransportStop> {
    const stop = await prisma.transportStop.findUnique({
      where: { id }
    });

    if (!stop) {
      throw new NotFoundError('Transport stop not found');
    }

    return stop;
  }

  /**
   * Create a new stop
   */
  async createStop(data: CreateTransportStopDto): Promise<TransportStop> {
    // Validate required fields
    if (!data.name || data.latitude === undefined || data.longitude === undefined) {
      throw new BadRequestError('Name, latitude, and longitude are required');
    }

    // Validate coordinates
    if (typeof data.latitude !== 'number' || data.latitude < -90 || data.latitude > 90) {
      throw new BadRequestError('Latitude must be a number between -90 and 90');
    }
    if (typeof data.longitude !== 'number' || data.longitude < -180 || data.longitude > 180) {
      throw new BadRequestError('Longitude must be a number between -180 and 180');
    }

    const stop = await prisma.transportStop.create({
      data: {
        name: data.name,
        latitude: data.latitude,
        longitude: data.longitude
      }
    });

    return stop;
  }

  /**
   * Update stop
   */
  async updateStop(id: string, data: Partial<CreateTransportStopDto>): Promise<TransportStop> {
    // Check if exists
    await this.getStopById(id);

    const updateData: any = {};
    
    if (data.name) updateData.name = data.name;
    
    if (data.latitude !== undefined) {
      if (typeof data.latitude !== 'number' || data.latitude < -90 || data.latitude > 90) {
        throw new BadRequestError('Latitude must be a number between -90 and 90');
      }
      updateData.latitude = data.latitude;
    }
    if (data.longitude !== undefined) {
      if (typeof data.longitude !== 'number' || data.longitude < -180 || data.longitude > 180) {
        throw new BadRequestError('Longitude must be a number between -180 and 180');
      }
      updateData.longitude = data.longitude;
    }

    const stop = await prisma.transportStop.update({
      where: { id },
      data: updateData
    });

    return stop;
  }

  /**
   * Delete stop
   */
  async deleteStop(id: string): Promise<void> {
    await this.getStopById(id);
    // Note: Cascade delete will handle related routeStops
    await prisma.transportStop.delete({
      where: { id }
    });
  }
}

// Export singleton instance
export const transportStopService = new TransportStopService();

