import { Request, Response, NextFunction } from 'express';
import { campaignService } from '../services/campaign.service';
import { BadRequestError } from '../types/errors';

/**
 * Campaign Controller
 * Handles HTTP requests for campaigns
 */
export class CampaignController {
  /**
   * GET /api/campaigns
   * Get all campaigns (ordered by newest first)
   */
  static async getCampaigns(req: Request, res: Response, next: NextFunction) {
    try {
      const campaigns = await campaignService.getCampaigns();

      res.status(200).json({
        success: true,
        data: campaigns
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/campaigns/:id
   * Get campaign by ID
   */
  static async getCampaignById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new BadRequestError('Campaign ID is required');
      }

      const campaign = await campaignService.getCampaignById(id);

      res.status(200).json({
        success: true,
        data: campaign
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/campaigns
   * Create a new campaign
   */
  static async createCampaign(req: Request, res: Response, next: NextFunction) {
    try {
      const campaign = await campaignService.createCampaign(req.body);

      res.status(201).json({
        success: true,
        message: 'Campaign created successfully',
        data: campaign
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/campaigns/:id
   * Update campaign
   */
  static async updateCampaign(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new BadRequestError('Campaign ID is required');
      }

      const campaign = await campaignService.updateCampaign(id, req.body);

      res.status(200).json({
        success: true,
        message: 'Campaign updated successfully',
        data: campaign
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/campaigns/:id
   * Delete campaign
   */
  static async deleteCampaign(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new BadRequestError('Campaign ID is required');
      }

      await campaignService.deleteCampaign(id);

      res.status(200).json({
        success: true,
        message: 'Campaign deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

