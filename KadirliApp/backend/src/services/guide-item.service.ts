import { GuideItem } from '@prisma/client';
import prisma from '../lib/prisma';
import { BadRequestError, NotFoundError } from '../types/errors';

export interface CreateGuideItemDto {
  categoryId: string;
  title: string;
  phone?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  isCenter?: boolean;
  isBusy?: boolean;
  rank?: number;
  ownerId?: string; // For taxi drivers
}

/**
 * Guide Item Service
 * Handles guide item business logic
 */
class GuideItemService {
  /**
   * Get items by category ID
   */
  async getItemsByCategory(categoryId: string): Promise<GuideItem[]> {
    // Verify category exists
    const category = await prisma.guideCategory.findUnique({
      where: { id: categoryId }
    });

    if (!category) {
      throw new NotFoundError('Guide category not found');
    }

    const items = await prisma.guideItem.findMany({
      where: { categoryId },
      include: {
        category: true
      },
      orderBy: {
        rank: 'asc'
      }
    });

    return items;
  }

  /**
   * Get item by ID
   */
  async getItemById(id: string): Promise<GuideItem> {
    const item = await prisma.guideItem.findUnique({
      where: { id },
      include: {
        category: true,
        owner: {
          select: {
            id: true,
            phone: true,
            fullName: true
          }
        }
      }
    });

    if (!item) {
      throw new NotFoundError('Guide item not found');
    }

    return item;
  }

  /**
   * Create a new item
   */
  async createItem(data: CreateGuideItemDto): Promise<GuideItem> {
    // Validate required fields
    if (!data.categoryId || !data.title) {
      throw new BadRequestError('Category ID and title are required');
    }

    // Verify category exists
    const category = await prisma.guideCategory.findUnique({
      where: { id: data.categoryId }
    });

    if (!category) {
      throw new NotFoundError('Guide category not found');
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

    // Verify owner exists if provided
    if (data.ownerId) {
      const owner = await prisma.user.findUnique({
        where: { id: data.ownerId }
      });
      if (!owner) {
        throw new NotFoundError('Owner (user) not found');
      }
    }

    const item = await prisma.guideItem.create({
      data: {
        categoryId: data.categoryId,
        title: data.title,
        phone: data.phone,
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
        isCenter: data.isCenter || false,
        isBusy: data.isBusy || false,
        rank: data.rank || 0,
        ownerId: data.ownerId
      },
      include: {
        category: true
      }
    });

    return item;
  }

  /**
   * Update item
   */
  async updateItem(id: string, data: Partial<CreateGuideItemDto>): Promise<GuideItem> {
    // Check if exists
    await this.getItemById(id);

    const updateData: any = {};
    
    if (data.categoryId) {
      // Verify new category exists
      const category = await prisma.guideCategory.findUnique({
        where: { id: data.categoryId }
      });
      if (!category) {
        throw new NotFoundError('Guide category not found');
      }
      updateData.categoryId = data.categoryId;
    }
    if (data.title) updateData.title = data.title;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.address !== undefined) updateData.address = data.address;
    if (data.isCenter !== undefined) updateData.isCenter = data.isCenter;
    if (data.isBusy !== undefined) updateData.isBusy = data.isBusy;
    if (data.rank !== undefined) updateData.rank = data.rank;
    
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
    
    if (data.ownerId !== undefined) {
      if (data.ownerId) {
        // Verify owner exists
        const owner = await prisma.user.findUnique({
          where: { id: data.ownerId }
        });
        if (!owner) {
          throw new NotFoundError('Owner (user) not found');
        }
      }
      updateData.ownerId = data.ownerId;
    }

    const item = await prisma.guideItem.update({
      where: { id },
      data: updateData,
      include: {
        category: true
      }
    });

    return item;
  }

  /**
   * Delete item
   */
  async deleteItem(id: string): Promise<void> {
    await this.getItemById(id);
    await prisma.guideItem.delete({
      where: { id }
    });
  }
}

// Export singleton instance
export const guideItemService = new GuideItemService();

