import { Request, Response, NextFunction } from 'express';
import { guideItemService } from '../services/guide-item.service';
import { BadRequestError } from '../types/errors';

/**
 * Guide Item Controller
 * Handles HTTP requests for guide items
 */
export class GuideItemController {
  /**
   * GET /api/guide/items
   * Get items by category ID
   * Query: ?categoryId=uuid
   */
  static async getItems(req: Request, res: Response, next: NextFunction) {
    try {
      const { categoryId } = req.query;

      if (!categoryId || typeof categoryId !== 'string') {
        throw new BadRequestError('Category ID is required');
      }

      const items = await guideItemService.getItemsByCategory(categoryId);

      res.status(200).json({
        success: true,
        data: items
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/guide/items/:id
   * Get item by ID
   */
  static async getItemById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new BadRequestError('Item ID is required');
      }

      const item = await guideItemService.getItemById(id);

      res.status(200).json({
        success: true,
        data: item
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/guide/items
   * Create a new item
   */
  static async createItem(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await guideItemService.createItem(req.body);

      res.status(201).json({
        success: true,
        message: 'Item created successfully',
        data: item
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/guide/items/:id
   * Update item (supports isBusy and ownerId for taxi drivers)
   */
  static async updateItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new BadRequestError('Item ID is required');
      }

      const item = await guideItemService.updateItem(id, req.body);

      res.status(200).json({
        success: true,
        message: 'Item updated successfully',
        data: item
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/guide/items/:id
   * Delete item
   */
  static async deleteItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new BadRequestError('Item ID is required');
      }

      await guideItemService.deleteItem(id);

      res.status(200).json({
        success: true,
        message: 'Item deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

