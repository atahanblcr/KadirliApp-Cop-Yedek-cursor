import { Router } from 'express';
import { CampaignController } from '../controllers/campaign.controller';

const router = Router();

/**
 * GET /api/campaigns
 * Get all campaigns (ordered by newest first)
 */
router.get('/', CampaignController.getCampaigns);

/**
 * GET /api/campaigns/:id
 * Get campaign by ID
 */
router.get('/:id', CampaignController.getCampaignById);

/**
 * POST /api/campaigns
 * Create a new campaign
 */
router.post('/', CampaignController.createCampaign);

/**
 * PATCH /api/campaigns/:id
 * Update campaign
 */
router.patch('/:id', CampaignController.updateCampaign);

/**
 * DELETE /api/campaigns/:id
 * Delete campaign
 */
router.delete('/:id', CampaignController.deleteCampaign);

export default router;

