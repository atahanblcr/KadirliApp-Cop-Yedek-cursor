import { Request, Response, NextFunction } from 'express';
import { guideCategoryService } from '../services/guide-category.service';
import { BadRequestError } from '../types/errors';

/**
 * Guide Category Controller
 * Handles HTTP requests for guide categories
 */
export class GuideCategoryController {
  /**
   * GET /api/guide/categories
   * Get all categories (optionally include items)
   * Query: ?includeItems=true|false
   */
  static async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const includeItems = req.query.includeItems === 'true';

      const categories = await guideCategoryService.getCategories(includeItems);

      res.status(200).json({
        success: true,
        data: categories
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/guide/categories/:id
   * Get category by ID (optionally include items)
   * Query: ?includeItems=true|false
   */
  static async getCategoryById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const includeItems = req.query.includeItems === 'true';

      if (!id) {
        throw new BadRequestError('Category ID is required');
      }

      const category = await guideCategoryService.getCategoryById(id, includeItems);

      res.status(200).json({
        success: true,
        data: category
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/guide/categories
   * Create a new category
   */
  static async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await guideCategoryService.createCategory(req.body);

      res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: category
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/guide/categories/:id
   * Update category
   */
  static async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new BadRequestError('Category ID is required');
      }

      const category = await guideCategoryService.updateCategory(id, req.body);

      res.status(200).json({
        success: true,
        message: 'Category updated successfully',
        data: category
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/guide/categories/:id
   * Delete category
   */
  static async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new BadRequestError('Category ID is required');
      }

      await guideCategoryService.deleteCategory(id);

      res.status(200).json({
        success: true,
        message: 'Category deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

