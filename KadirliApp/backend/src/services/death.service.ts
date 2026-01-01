import { DeathNotice } from '@prisma/client';
import prisma from '../lib/prisma';
import { BadRequestError, NotFoundError } from '../types/errors';

export interface CreateDeathNoticeDto {
  firstName: string;
  lastName: string;
  deathDate: Date | string;
  burialPlace?: string;
  burialTime?: string; // Format: "HH:mm:ss"
  condolenceAddress?: string;
  latitude?: number;
  longitude?: number;
  imageUrl?: string;
}

/**
 * Death Notice Service
 * Handles death notice business logic
 */
class DeathService {
  /**
   * Get death notices for a specific date
   */
  async getDeathNotices(date?: string): Promise<DeathNotice[]> {
    let queryDate: Date;

    if (date) {
      queryDate = new Date(date);
      if (isNaN(queryDate.getTime())) {
        throw new BadRequestError('Invalid date format. Use YYYY-MM-DD');
      }
    } else {
      queryDate = new Date();
    }

    // Set to start of day for comparison
    const startOfDay = new Date(queryDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(queryDate);
    endOfDay.setHours(23, 59, 59, 999);

    const deaths = await prisma.deathNotice.findMany({
      where: {
        deathDate: {
          gte: startOfDay,
          lte: endOfDay
        }
      },
      orderBy: [
        { firstName: 'asc' },
        { lastName: 'asc' }
      ]
    });

    return deaths;
  }

  /**
   * Get death notice by ID
   */
  async getDeathNoticeById(id: string): Promise<DeathNotice> {
    const deathNotice = await prisma.deathNotice.findUnique({
      where: { id }
    });

    if (!deathNotice) {
      throw new NotFoundError('Death notice not found');
    }

    return deathNotice;
  }

  /**
   * Create a new death notice
   */
  async createDeathNotice(data: CreateDeathNoticeDto): Promise<DeathNotice> {
    // Validate required fields
    if (!data.firstName || !data.lastName || !data.deathDate) {
      throw new BadRequestError('First name, last name, and death date are required');
    }

    // Parse deathDate if it's a string
    let deathDate: Date;
    if (typeof data.deathDate === 'string') {
      deathDate = new Date(data.deathDate);
      if (isNaN(deathDate.getTime())) {
        throw new BadRequestError('Invalid deathDate format. Use YYYY-MM-DD');
      }
    } else {
      deathDate = data.deathDate;
    }

    // Set to start of day
    deathDate.setHours(0, 0, 0, 0);

    // Validate burialTime format if provided
    if (data.burialTime && !/^\d{2}:\d{2}:\d{2}$/.test(data.burialTime)) {
      throw new BadRequestError('Invalid burialTime format. Use HH:mm:ss');
    }

    const deathNotice = await prisma.deathNotice.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        deathDate,
        burialPlace: data.burialPlace,
        burialTime: data.burialTime,
        condolenceAddress: data.condolenceAddress,
        latitude: data.latitude,
        longitude: data.longitude,
        imageUrl: data.imageUrl
      }
    });

    return deathNotice;
  }

  /**
   * Update death notice
   */
  async updateDeathNotice(id: string, data: Partial<CreateDeathNoticeDto>): Promise<DeathNotice> {
    // Check if exists
    await this.getDeathNoticeById(id);

    const updateData: any = {};
    
    if (data.firstName) updateData.firstName = data.firstName;
    if (data.lastName) updateData.lastName = data.lastName;
    if (data.burialPlace !== undefined) updateData.burialPlace = data.burialPlace;
    if (data.burialTime !== undefined) {
      if (data.burialTime && !/^\d{2}:\d{2}:\d{2}$/.test(data.burialTime)) {
        throw new BadRequestError('Invalid burialTime format. Use HH:mm:ss');
      }
      updateData.burialTime = data.burialTime;
    }
    if (data.condolenceAddress !== undefined) updateData.condolenceAddress = data.condolenceAddress;
    if (data.latitude !== undefined) updateData.latitude = data.latitude;
    if (data.longitude !== undefined) updateData.longitude = data.longitude;
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
    
    if (data.deathDate) {
      let deathDate: Date;
      if (typeof data.deathDate === 'string') {
        deathDate = new Date(data.deathDate);
        if (isNaN(deathDate.getTime())) {
          throw new BadRequestError('Invalid deathDate format. Use YYYY-MM-DD');
        }
      } else {
        deathDate = data.deathDate;
      }
      deathDate.setHours(0, 0, 0, 0);
      updateData.deathDate = deathDate;
    }

    const deathNotice = await prisma.deathNotice.update({
      where: { id },
      data: updateData
    });

    return deathNotice;
  }

  /**
   * Delete death notice
   */
  async deleteDeathNotice(id: string): Promise<void> {
    await this.getDeathNoticeById(id);
    await prisma.deathNotice.delete({
      where: { id }
    });
  }
}

// Export singleton instance
export const deathService = new DeathService();

