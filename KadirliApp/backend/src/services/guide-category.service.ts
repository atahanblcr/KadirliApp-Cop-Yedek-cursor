import { GuideCategory } from '@prisma/client';
import prisma from '../lib/prisma';
import { BadRequestError, NotFoundError } from '../types/errors';

export interface CreateGuideCategoryDto {
  title: string;
  iconName?: string;
  rank?: number;
}

/**
 * Guide Category Service
 * Handles guide category business logic
 */
class GuideCategoryService {
  /**
   * Get all categories (optionally include items)
   */
  async getCategories(includeItems: boolean = false): Promise<GuideCategory[]> {
    const categories = await prisma.guideCategory.findMany({
      include: includeItems ? {
        items: {
          orderBy: {
            rank: 'asc'
          }
        }
      } : undefined,
      orderBy: {
        rank: 'asc'
      }
    });

    return categories;
  }

  /**
   * Get category by ID (optionally include items)
   */
  async getCategoryById(id: string, includeItems: boolean = false): Promise<GuideCategory> {
    const category = await prisma.guideCategory.findUnique({
      where: { id },
      include: includeItems ? {
        items: {
          orderBy: {
            rank: 'asc'
          }
        }
      } : undefined
    });

    if (!category) {
      throw new NotFoundError('Guide category not found');
    }

    return category;
  }

  /**
   * Create a new category
   */
  async createCategory(data: CreateGuideCategoryDto): Promise<GuideCategory> {
    // Validate required fields
    if (!data.title) {
      throw new BadRequestError('Title is required');
    }

    const category = await prisma.guideCategory.create({
      data: {
        title: data.title,
        iconName: data.iconName,
        rank: data.rank || 0
      }
    });

    return category;
  }

  /**
   * Update category
   */
  async updateCategory(id: string, data: Partial<CreateGuideCategoryDto>): Promise<GuideCategory> {
    // Check if exists
    await this.getCategoryById(id);

    const updateData: any = {};
    
    if (data.title) updateData.title = data.title;
    if (data.iconName !== undefined) updateData.iconName = data.iconName;
    if (data.rank !== undefined) updateData.rank = data.rank;

    const category = await prisma.guideCategory.update({
      where: { id },
      data: updateData
    });

    return category;
  }

  /**
   * Delete category
   */
  async deleteCategory(id: string): Promise<void> {
    await this.getCategoryById(id);
    // Note: Cascade delete will handle related items
    await prisma.guideCategory.delete({
      where: { id }
    });
  }
}

// Export singleton instance
export const guideCategoryService = new GuideCategoryService();

