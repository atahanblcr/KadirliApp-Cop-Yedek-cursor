import { Campaign } from '@prisma/client';
import prisma from '../lib/prisma';
import { BadRequestError, NotFoundError } from '../types/errors';

export interface CreateCampaignDto {
  title: string;
  businessName: string;
  description?: string;
  discountCode?: string;
  imageUrls?: string[];
}

/**
 * Campaign Service
 * Handles campaign business logic
 */
class CampaignService {
  /**
   * Get all campaigns (ordered by newest first)
   */
  async getCampaigns(): Promise<Campaign[]> {
    const campaigns = await prisma.campaign.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return campaigns;
  }

  /**
   * Get campaign by ID
   */
  async getCampaignById(id: string): Promise<Campaign> {
    const campaign = await prisma.campaign.findUnique({
      where: { id }
    });

    if (!campaign) {
      throw new NotFoundError('Campaign not found');
    }

    return campaign;
  }

  /**
   * Create a new campaign
   */
  async createCampaign(data: CreateCampaignDto): Promise<Campaign> {
    // Validate required fields
    if (!data.title || !data.businessName) {
      throw new BadRequestError('Title and businessName are required');
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

    const campaign = await prisma.campaign.create({
      data: {
        title: data.title,
        businessName: data.businessName,
        description: data.description,
        discountCode: data.discountCode,
        imageUrls: data.imageUrls || []
      }
    });

    return campaign;
  }

  /**
   * Update campaign
   */
  async updateCampaign(id: string, data: Partial<CreateCampaignDto>): Promise<Campaign> {
    // Check if exists
    await this.getCampaignById(id);

    const updateData: any = {};
    
    if (data.title) updateData.title = data.title;
    if (data.businessName) updateData.businessName = data.businessName;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.discountCode !== undefined) updateData.discountCode = data.discountCode;
    
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

    const campaign = await prisma.campaign.update({
      where: { id },
      data: updateData
    });

    return campaign;
  }

  /**
   * Delete campaign
   */
  async deleteCampaign(id: string): Promise<void> {
    await this.getCampaignById(id);
    await prisma.campaign.delete({
      where: { id }
    });
  }
}

// Export singleton instance
export const campaignService = new CampaignService();

