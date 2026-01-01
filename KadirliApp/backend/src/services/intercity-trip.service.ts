import { IntercityTrip } from '@prisma/client';
import prisma from '../lib/prisma';
import { BadRequestError, NotFoundError } from '../types/errors';

export interface CreateIntercityTripDto {
  destination: string;
  companyName?: string;
  departureTimes: string[]; // Array of TIME strings: "HH:mm:ss"
  price?: string;
}

/**
 * Intercity Trip Service
 * Handles intercity trip business logic
 */
class IntercityTripService {
  /**
   * Get all intercity trips
   */
  async getTrips(): Promise<IntercityTrip[]> {
    const trips = await prisma.intercityTrip.findMany({
      orderBy: {
        destination: 'asc'
      }
    });

    return trips;
  }

  /**
   * Get trip by ID
   */
  async getTripById(id: string): Promise<IntercityTrip> {
    const trip = await prisma.intercityTrip.findUnique({
      where: { id }
    });

    if (!trip) {
      throw new NotFoundError('Intercity trip not found');
    }

    return trip;
  }

  /**
   * Create a new trip
   */
  async createTrip(data: CreateIntercityTripDto): Promise<IntercityTrip> {
    // Validate required fields
    if (!data.destination || !data.departureTimes) {
      throw new BadRequestError('Destination and departureTimes are required');
    }

    // Validate departureTimes is an array
    if (!Array.isArray(data.departureTimes)) {
      throw new BadRequestError('departureTimes must be an array');
    }

    // Validate time format for each departure time (HH:mm:ss)
    const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
    for (const time of data.departureTimes) {
      if (typeof time !== 'string' || !timeRegex.test(time)) {
        throw new BadRequestError('All departureTimes must be in HH:mm:ss format');
      }
    }

    const trip = await prisma.intercityTrip.create({
      data: {
        destination: data.destination,
        companyName: data.companyName,
        departureTimes: data.departureTimes,
        price: data.price
      }
    });

    return trip;
  }

  /**
   * Update trip
   */
  async updateTrip(id: string, data: Partial<CreateIntercityTripDto>): Promise<IntercityTrip> {
    // Check if exists
    await this.getTripById(id);

    const updateData: any = {};
    
    if (data.destination) updateData.destination = data.destination;
    if (data.companyName !== undefined) updateData.companyName = data.companyName;
    if (data.price !== undefined) updateData.price = data.price;
    
    if (data.departureTimes !== undefined) {
      if (!Array.isArray(data.departureTimes)) {
        throw new BadRequestError('departureTimes must be an array');
      }
      // Validate time format for each departure time
      const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
      for (const time of data.departureTimes) {
        if (typeof time !== 'string' || !timeRegex.test(time)) {
          throw new BadRequestError('All departureTimes must be in HH:mm:ss format');
        }
      }
      updateData.departureTimes = data.departureTimes;
    }

    const trip = await prisma.intercityTrip.update({
      where: { id },
      data: updateData
    });

    return trip;
  }

  /**
   * Delete trip
   */
  async deleteTrip(id: string): Promise<void> {
    await this.getTripById(id);
    await prisma.intercityTrip.delete({
      where: { id }
    });
  }
}

// Export singleton instance
export const intercityTripService = new IntercityTripService();

