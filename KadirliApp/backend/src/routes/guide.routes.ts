import { Router } from 'express';
import { GuideCategoryController } from '../controllers/guide-category.controller';
import { GuideItemController } from '../controllers/guide-item.controller';

const router = Router();

// Category routes
/**
 * GET /api/guide/categories
 * Get all categories (?includeItems=true)
 */
router.get('/categories', GuideCategoryController.getCategories);

/**
 * GET /api/guide/categories/:id
 * Get category by ID (?includeItems=true)
 */
router.get('/categories/:id', GuideCategoryController.getCategoryById);

/**
 * POST /api/guide/categories
 * Create a new category
 */
router.post('/categories', GuideCategoryController.createCategory);

/**
 * PATCH /api/guide/categories/:id
 * Update category
 */
router.patch('/categories/:id', GuideCategoryController.updateCategory);

/**
 * DELETE /api/guide/categories/:id
 * Delete category
 */
router.delete('/categories/:id', GuideCategoryController.deleteCategory);

// Item routes
/**
 * GET /api/guide/items
 * Get items by category (?categoryId=uuid)
 */
router.get('/items', GuideItemController.getItems);

/**
 * GET /api/guide/items/:id
 * Get item by ID
 */
router.get('/items/:id', GuideItemController.getItemById);

/**
 * POST /api/guide/items
 * Create a new item
 */
router.post('/items', GuideItemController.createItem);

/**
 * PATCH /api/guide/items/:id
 * Update item (supports isBusy and ownerId for taxi drivers)
 */
router.patch('/items/:id', GuideItemController.updateItem);

/**
 * DELETE /api/guide/items/:id
 * Delete item
 */
router.delete('/items/:id', GuideItemController.deleteItem);

export default router;

