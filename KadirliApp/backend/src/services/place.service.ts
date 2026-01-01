import { Place } from '@prisma/client';
import prisma from '../lib/prisma';
import { BadRequestError, NotFoundError } from '../types/errors';

export interface CreatePlaceDto {
  title: string;
  description?: string;
  distanceText?: string;
  distanceKm?: number;
  latitude?: number;
  longitude?: number;
  imageUrls?: string[];
}

/**
 * Place Service
 * Handles place (tourist attraction) business logic
 */
class PlaceService {
  /**
   * Get all places (ordered by title)
   */
  async getPlaces(): Promise<Place[]> {
    const places = await prisma.place.findMany({
      orderBy: {
        title: 'asc'
      }
    });

    return places;
  }

  /**
   * Get place by ID
   */
  async getPlaceById(id: string): Promise<Place> {
    const place = await prisma.place.findUnique({
      where: { id }
    });

    if (!place) {
      throw new NotFoundError('Place not found');
    }

    return place;
  }

  /**
   * Create a new place
   */
  async createPlace(data: CreatePlaceDto): Promise<Place> {
    // Validate required fields
    if (!data.title) {
      throw new BadRequestError('Title is required');
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

    // Validate distanceKm if provided
    if (data.distanceKm !== undefined) {
      if (typeof data.distanceKm !== 'number' || data.distanceKm < 0) {
        throw new BadRequestError('distanceKm must be a non-negative number');
      }
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

    const place = await prisma.place.create({
      data: {
        title: data.title,
        description: data.description,
        distanceText: data.distanceText,
        distanceKm: data.distanceKm,
        latitude: data.latitude,
        longitude: data.longitude,
        imageUrls: data.imageUrls || []
      }
    });

    return place;
  }

  /**
   * Update place
   */
  async updatePlace(id: string, data: Partial<CreatePlaceDto>): Promise<Place> {
    // Check if exists
    await this.getPlaceById(id);

    const updateData: any = {};
    
    if (data.title) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.distanceText !== undefined) updateData.distanceText = data.distanceText;
    
    if (data.distanceKm !== undefined) {
      if (typeof data.distanceKm !== 'number' || data.distanceKm < 0) {
        throw new BadRequestError('distanceKm must be a non-negative number');
      }
      updateData.distanceKm = data.distanceKm;
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
    
    if (data.imageUrls !== undefined) {
      if (!Array.isArray(data.imageUrls)) {
        throw new BadRequestError('imageUrls must be an array of strings');
      }
      // Validate all imageUrls are strings
      for (const url of data.imageUrls) {
        if (typeof url !== 'string') {
          throw new BadRequestError('All imageUrls must be strings');
        }
      }
      updateData.imageUrls = data.imageUrls;
    }

    const place = await prisma.place.update({
      where: { id },
      data: updateData
    });

    return place;
  }

  /**
   * Delete place
   */
  async deletePlace(id: string): Promise<void> {
    await this.getPlaceById(id);
    await prisma.place.delete({
      where: { id }
    });
  }
}

// Export singleton instance
export const placeService = new PlaceService();

