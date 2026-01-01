import { Pharmacy } from '@prisma/client';
import prisma from '../lib/prisma';
import { BadRequestError, NotFoundError } from '../types/errors';

export interface CreatePharmacyDto {
  name: string;
  phone?: string;
  address?: string;
  region: string;
  latitude?: number;
  longitude?: number;
  dutyDate: Date | string;
}

/**
 * Pharmacy Service
 * Handles pharmacy business logic
 */
class PharmacyService {
  /**
   * Get duty pharmacies for a specific date
   * If no date provided, uses today (with logic: if before 9 AM, use yesterday)
   */
  async getDutyPharmacies(date?: string): Promise<Pharmacy[]> {
    let queryDate: Date;

    if (date) {
      queryDate = new Date(date);
      if (isNaN(queryDate.getTime())) {
        throw new BadRequestError('Invalid date format. Use YYYY-MM-DD');
      }
    } else {
      // Logic: If before 9 AM, use yesterday (night shift continues)
      const now = new Date();
      const hour = now.getHours();
      
      if (hour < 9) {
        queryDate = new Date(now);
        queryDate.setDate(queryDate.getDate() - 1);
      } else {
        queryDate = now;
      }
    }

    // Set to start of day for comparison
    const startOfDay = new Date(queryDate);
    startOfDay.setHours(0, 0, 0, 0);

    const pharmacies = await prisma.pharmacy.findMany({
      where: {
        dutyDate: {
          gte: startOfDay
        }
      },
      orderBy: [
        { region: 'asc' },
        { name: 'asc' }
      ]
    });

    return pharmacies;
  }

  /**
   * Get pharmacy by ID
   */
  async getPharmacyById(id: string): Promise<Pharmacy> {
    const pharmacy = await prisma.pharmacy.findUnique({
      where: { id }
    });

    if (!pharmacy) {
      throw new NotFoundError('Pharmacy not found');
    }

    return pharmacy;
  }

  /**
   * Create a new pharmacy
   */
  async createPharmacy(data: CreatePharmacyDto): Promise<Pharmacy> {
    // Validate required fields
    if (!data.name || !data.region) {
      throw new BadRequestError('Name and region are required');
    }

    // Parse dutyDate if it's a string
    let dutyDate: Date;
    if (typeof data.dutyDate === 'string') {
      dutyDate = new Date(data.dutyDate);
      if (isNaN(dutyDate.getTime())) {
        throw new BadRequestError('Invalid dutyDate format. Use YYYY-MM-DD');
      }
    } else {
      dutyDate = data.dutyDate;
    }

    // Set to start of day
    dutyDate.setHours(0, 0, 0, 0);

    const pharmacy = await prisma.pharmacy.create({
      data: {
        name: data.name,
        phone: data.phone,
        address: data.address,
        region: data.region,
        latitude: data.latitude,
        longitude: data.longitude,
        dutyDate
      }
    });

    return pharmacy;
  }

  /**
   * Update pharmacy
   */
  async updatePharmacy(id: string, data: Partial<CreatePharmacyDto>): Promise<Pharmacy> {
    // Check if exists
    await this.getPharmacyById(id);

    const updateData: any = {};
    
    if (data.name) updateData.name = data.name;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.address !== undefined) updateData.address = data.address;
    if (data.region) updateData.region = data.region;
    if (data.latitude !== undefined) updateData.latitude = data.latitude;
    if (data.longitude !== undefined) updateData.longitude = data.longitude;
    
    if (data.dutyDate) {
      let dutyDate: Date;
      if (typeof data.dutyDate === 'string') {
        dutyDate = new Date(data.dutyDate);
        if (isNaN(dutyDate.getTime())) {
          throw new BadRequestError('Invalid dutyDate format. Use YYYY-MM-DD');
        }
      } else {
        dutyDate = data.dutyDate;
      }
      dutyDate.setHours(0, 0, 0, 0);
      updateData.dutyDate = dutyDate;
    }

    const pharmacy = await prisma.pharmacy.update({
      where: { id },
      data: updateData
    });

    return pharmacy;
  }

  /**
   * Delete pharmacy
   */
  async deletePharmacy(id: string): Promise<void> {
    await this.getPharmacyById(id);
    await prisma.pharmacy.delete({
      where: { id }
    });
  }
}

// Export singleton instance
export const pharmacyService = new PharmacyService();

