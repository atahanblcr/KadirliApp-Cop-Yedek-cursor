import { Ad, AdType } from '@prisma/client';
import prisma from '../lib/prisma';
import { BadRequestError, NotFoundError, ForbiddenError } from '../types/errors';

export interface CreateAdDto {
  title: string;
  description?: string;
  type: AdType;
  contactInfo?: string;
  price?: string;
  imageUrls?: string[];
  expiresAt?: Date | string;
  sellerName?: string;
  latitude?: number;
  longitude?: number;
}

export interface AdFilterParams {
  type?: AdType;
  search?: string; // Search in title
}

/**
 * Ad Service
 * Handles ad business logic
 */
class AdService {
  /**
   * Get active ads (public - no authentication required)
   * Supports filtering by type and searching by title
   */
  async getActiveAds(filters?: AdFilterParams): Promise<Ad[]> {
    const where: any = {
      isActive: true,
      isDeleted: false
    };

    // Filter by type if provided
    if (filters?.type) {
      const validTypes = Object.values(AdType);
      if (!validTypes.includes(filters.type)) {
        throw new BadRequestError(`Invalid type. Must be one of: ${validTypes.join(', ')}`);
      }
      where.type = filters.type;
    }

    // Search by title if provided
    if (filters?.search) {
      where.title = {
        contains: filters.search,
        mode: 'insensitive' // Case-insensitive search
      };
    }

    // Filter out expired ads
    where.OR = [
      { expiresAt: null },
      { expiresAt: { gte: new Date() } }
    ];

    const ads = await prisma.ad.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            id: true,
            phone: true,
            fullName: true
          }
        }
      }
    });

    return ads;
  }

  /**
   * Get ad by ID (public)
   */
  async getAdById(id: string): Promise<Ad> {
    const ad = await prisma.ad.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            phone: true,
            fullName: true
          }
        }
      }
    });

    if (!ad) {
      throw new NotFoundError('Ad not found');
    }

    // Don't show deleted ads
    if (ad.isDeleted) {
      throw new NotFoundError('Ad not found');
    }

    return ad;
  }

  /**
   * Create a new ad (requires userId from authenticated user)
   */
  async createAd(userId: string, data: CreateAdDto): Promise<Ad> {
    // Validate required fields
    if (!data.title || !data.type) {
      throw new BadRequestError('Title and type are required');
    }

    // Validate type enum
    const validTypes = Object.values(AdType);
    if (!validTypes.includes(data.type)) {
      throw new BadRequestError(`Invalid type. Must be one of: ${validTypes.join(', ')}`);
    }

    // Validate imageUrls is an array if provided
    if (data.imageUrls && !Array.isArray(data.imageUrls)) {
      throw new BadRequestError('imageUrls must be an array of strings');
    }

    // Validate all imageUrls are strings
    if (data.imageUrls) {
      for (const url of data.imageUrls) {
        if (typeof url !== 'string') {
          throw new BadRequestError('All imageUrls must be strings');
        }
      }
    }

    // Validate coordinates if provided
    if (data.latitude !== undefined) {
      if (typeof data.latitude !== 'number' || data.latitude < -90 || data.latitude > 90) {
        throw new BadRequestError('Latitude must be a number between -90 and 90');
      }
    }
    if (data.longitude !== undefined) {
      if (typeof data.longitude !== 'number' || data.longitude < -180 || data.longitude > 180) {
        throw new BadRequestError('Longitude must be a number between -180 and 180');
      }
    }

    // Parse expiresAt if it's a string
    let expiresAt: Date | null = null;
    if (data.expiresAt) {
      if (typeof data.expiresAt === 'string') {
        expiresAt = new Date(data.expiresAt);
        if (isNaN(expiresAt.getTime())) {
          throw new BadRequestError('Invalid expiresAt format. Use ISO 8601 format');
        }
      } else {
        expiresAt = data.expiresAt;
      }
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    const ad = await prisma.ad.create({
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        contactInfo: data.contactInfo,
        price: data.price,
        imageUrls: data.imageUrls || [],
        expiresAt,
        sellerName: data.sellerName,
        latitude: data.latitude,
        longitude: data.longitude,
        userId
      },
      include: {
        user: {
          select: {
            id: true,
            phone: true,
            fullName: true
          }
        }
      }
    });

    return ad;
  }

  /**
   * Update ad (only owner can update)
   */
  async updateAd(id: string, userId: string, data: Partial<CreateAdDto>): Promise<Ad> {
    // Check if ad exists
    const ad = await this.getAdById(id);

    // Check if user is the owner
    if (ad.userId !== userId) {
      throw new ForbiddenError('You can only update your own ads');
    }

    const updateData: any = {};
    
    if (data.title) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.contactInfo !== undefined) updateData.contactInfo = data.contactInfo;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.sellerName !== undefined) updateData.sellerName = data.sellerName;
    
    if (data.type) {
      const validTypes = Object.values(AdType);
      if (!validTypes.includes(data.type)) {
        throw new BadRequestError(`Invalid type. Must be one of: ${validTypes.join(', ')}`);
      }
      updateData.type = data.type;
    }
    
    if (data.imageUrls !== undefined) {
      if (!Array.isArray(data.imageUrls)) {
        throw new BadRequestError('imageUrls must be an array of strings');
      }
      for (const url of data.imageUrls) {
        if (typeof url !== 'string') {
          throw new BadRequestError('All imageUrls must be strings');
        }
      }
      updateData.imageUrls = data.imageUrls;
    }
    
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
    
    if (data.expiresAt !== undefined) {
      if (data.expiresAt === null) {
        updateData.expiresAt = null;
      } else {
        let expiresAt: Date;
        if (typeof data.expiresAt === 'string') {
          expiresAt = new Date(data.expiresAt);
          if (isNaN(expiresAt.getTime())) {
            throw new BadRequestError('Invalid expiresAt format. Use ISO 8601 format');
          }
        } else {
          expiresAt = data.expiresAt;
        }
        updateData.expiresAt = expiresAt;
      }
    }

    const updatedAd = await prisma.ad.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            phone: true,
            fullName: true
          }
        }
      }
    });

    return updatedAd;
  }

  /**
   * Delete ad (soft delete - only owner can delete)
   */
  async deleteAd(id: string, userId: string): Promise<void> {
    // Check if ad exists
    const ad = await this.getAdById(id);

    // Check if user is the owner
    if (ad.userId !== userId) {
      throw new ForbiddenError('You can only delete your own ads');
    }

    // Soft delete
    await prisma.ad.update({
      where: { id },
      data: {
        isDeleted: true,
        isActive: false
      }
    });
  }
}

// Export singleton instance
export const adService = new AdService();

