import { Request, Response, NextFunction } from 'express';
import { pharmacyService } from '../services/pharmacy.service';
import { BadRequestError } from '../types/errors';

/**
 * Pharmacy Controller
 * Handles HTTP requests for pharmacies
 */
export class PharmacyController {
  /**
   * GET /api/pharmacy
   * Get duty pharmacies (optionally filtered by date)
   * Query params: ?date=YYYY-MM-DD (optional)
   */
  static async getDutyPharmacies(req: Request, res: Response, next: NextFunction) {
    try {
      const { date } = req.query;
      const dateStr = date as string | undefined;

      const pharmacies = await pharmacyService.getDutyPharmacies(dateStr);

      res.status(200).json({
        success: true,
        data: pharmacies
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/pharmacy/:id
   * Get pharmacy by ID
   */
  static async getPharmacyById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new BadRequestError('Pharmacy ID is required');
      }

      const pharmacy = await pharmacyService.getPharmacyById(id);

      res.status(200).json({
        success: true,
        data: pharmacy
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/pharmacy
   * Create a new pharmacy
   */
  static async createPharmacy(req: Request, res: Response, next: NextFunction) {
    try {
      const pharmacy = await pharmacyService.createPharmacy(req.body);

      res.status(201).json({
        success: true,
        message: 'Pharmacy created successfully',
        data: pharmacy
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/pharmacy/:id
   * Update pharmacy
   */
  static async updatePharmacy(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new BadRequestError('Pharmacy ID is required');
      }

      const pharmacy = await pharmacyService.updatePharmacy(id, req.body);

      res.status(200).json({
        success: true,
        message: 'Pharmacy updated successfully',
        data: pharmacy
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/pharmacy/:id
   * Delete pharmacy
   */
  static async deletePharmacy(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new BadRequestError('Pharmacy ID is required');
      }

      await pharmacyService.deletePharmacy(id);

      res.status(200).json({
        success: true,
        message: 'Pharmacy deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

