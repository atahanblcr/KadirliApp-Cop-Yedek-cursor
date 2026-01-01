import { Announcement, AnnouncementType } from '@prisma/client';
import prisma from '../lib/prisma';
import { BadRequestError, NotFoundError } from '../types/errors';

export interface CreateAnnouncementDto {
  title: string;
  description: string;
  type: AnnouncementType;
  institutionName?: string;
  imageUrl?: string;
  fileUrl?: string;
  targetNeighborhoods?: string[];
}

/**
 * Announcement Service
 * Handles announcement business logic
 */
class AnnouncementService {
  /**
   * Get all announcements (ordered by newest first)
   */
  async getAnnouncements(type?: AnnouncementType): Promise<Announcement[]> {
    const where = type ? { type } : {};

    const announcements = await prisma.announcement.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      }
    });

    return announcements;
  }

  /**
   * Get announcement by ID
   */
  async getAnnouncementById(id: string): Promise<Announcement> {
    const announcement = await prisma.announcement.findUnique({
      where: { id }
    });

    if (!announcement) {
      throw new NotFoundError('Announcement not found');
    }

    return announcement;
  }

  /**
   * Create a new announcement
   */
  async createAnnouncement(data: CreateAnnouncementDto): Promise<Announcement> {
    // Validate required fields
    if (!data.title || !data.description || !data.type) {
      throw new BadRequestError('Title, description, and type are required');
    }

    // Validate type enum
    const validTypes = Object.values(AnnouncementType);
    if (!validTypes.includes(data.type)) {
      throw new BadRequestError(`Invalid type. Must be one of: ${validTypes.join(', ')}`);
    }

    const announcement = await prisma.announcement.create({
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        institutionName: data.institutionName,
        imageUrl: data.imageUrl,
        fileUrl: data.fileUrl,
        targetNeighborhoods: data.targetNeighborhoods || []
      }
    });

    return announcement;
  }

  /**
   * Update announcement
   */
  async updateAnnouncement(id: string, data: Partial<CreateAnnouncementDto>): Promise<Announcement> {
    // Check if exists
    await this.getAnnouncementById(id);

    const updateData: any = {};
    
    if (data.title) updateData.title = data.title;
    if (data.description) updateData.description = data.description;
    if (data.type) {
      const validTypes = Object.values(AnnouncementType);
      if (!validTypes.includes(data.type)) {
        throw new BadRequestError(`Invalid type. Must be one of: ${validTypes.join(', ')}`);
      }
      updateData.type = data.type;
    }
    if (data.institutionName !== undefined) updateData.institutionName = data.institutionName;
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
    if (data.fileUrl !== undefined) updateData.fileUrl = data.fileUrl;
    if (data.targetNeighborhoods !== undefined) updateData.targetNeighborhoods = data.targetNeighborhoods;

    const announcement = await prisma.announcement.update({
      where: { id },
      data: updateData
    });

    return announcement;
  }

  /**
   * Delete announcement
   */
  async deleteAnnouncement(id: string): Promise<void> {
    await this.getAnnouncementById(id);
    await prisma.announcement.delete({
      where: { id }
    });
  }
}

// Export singleton instance
export const announcementService = new AnnouncementService();

