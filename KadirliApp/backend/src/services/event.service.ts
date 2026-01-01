import { Event } from '@prisma/client';
import prisma from '../lib/prisma';
import { BadRequestError, NotFoundError } from '../types/errors';

export interface CreateEventDto {
  title: string;
  description?: string;
  eventDate: Date | string;
  locationName?: string;
  latitude?: number;
  longitude?: number;
  imageUrl?: string;
  isActive?: boolean;
}

export interface EventFilterParams {
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
}

/**
 * Event Service
 * Handles event business logic
 */
class EventService {
  /**
   * Get active events (from today onwards, ordered by eventDate)
   * Supports date range filtering
   */
  async getEvents(filters?: EventFilterParams): Promise<Event[]> {
    const where: any = {};

    // Default: only active events from today onwards
    if (filters?.isActive !== false) {
      where.isActive = true;
    }

    // Date filtering
    if (filters?.startDate || filters?.endDate) {
      where.eventDate = {};
      
      if (filters.startDate) {
        const startDate = new Date(filters.startDate);
        if (isNaN(startDate.getTime())) {
          throw new BadRequestError('Invalid startDate format. Use YYYY-MM-DD');
        }
        startDate.setHours(0, 0, 0, 0);
        where.eventDate.gte = startDate;
      } else {
        // Default: from today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        where.eventDate.gte = today;
      }

      if (filters.endDate) {
        const endDate = new Date(filters.endDate);
        if (isNaN(endDate.getTime())) {
          throw new BadRequestError('Invalid endDate format. Use YYYY-MM-DD');
        }
        endDate.setHours(23, 59, 59, 999);
        where.eventDate.lte = endDate;
      }
    } else {
      // Default: from today onwards
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      where.eventDate = {
        gte: today
      };
    }

    const events = await prisma.event.findMany({
      where,
      orderBy: {
        eventDate: 'asc'
      }
    });

    return events;
  }

  /**
   * Get event by ID
   */
  async getEventById(id: string): Promise<Event> {
    const event = await prisma.event.findUnique({
      where: { id }
    });

    if (!event) {
      throw new NotFoundError('Event not found');
    }

    return event;
  }

  /**
   * Create a new event
   */
  async createEvent(data: CreateEventDto): Promise<Event> {
    // Validate required fields
    if (!data.title || !data.eventDate) {
      throw new BadRequestError('Title and eventDate are required');
    }

    // Parse eventDate if it's a string
    let eventDate: Date;
    if (typeof data.eventDate === 'string') {
      eventDate = new Date(data.eventDate);
      if (isNaN(eventDate.getTime())) {
        throw new BadRequestError('Invalid eventDate format. Use ISO 8601 format');
      }
    } else {
      eventDate = data.eventDate;
    }

    // Validate coordinates if provided
    if (data.latitude !== undefined && (data.latitude < -90 || data.latitude > 90)) {
      throw new BadRequestError('Latitude must be between -90 and 90');
    }
    if (data.longitude !== undefined && (data.longitude < -180 || data.longitude > 180)) {
      throw new BadRequestError('Longitude must be between -180 and 180');
    }

    const event = await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        eventDate,
        locationName: data.locationName,
        latitude: data.latitude,
        longitude: data.longitude,
        imageUrl: data.imageUrl,
        isActive: data.isActive !== undefined ? data.isActive : true
      }
    });

    return event;
  }

  /**
   * Update event
   */
  async updateEvent(id: string, data: Partial<CreateEventDto>): Promise<Event> {
    // Check if exists
    await this.getEventById(id);

    const updateData: any = {};
    
    if (data.title) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.locationName !== undefined) updateData.locationName = data.locationName;
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    
    if (data.latitude !== undefined) {
      if (data.latitude < -90 || data.latitude > 90) {
        throw new BadRequestError('Latitude must be between -90 and 90');
      }
      updateData.latitude = data.latitude;
    }
    if (data.longitude !== undefined) {
      if (data.longitude < -180 || data.longitude > 180) {
        throw new BadRequestError('Longitude must be between -180 and 180');
      }
      updateData.longitude = data.longitude;
    }
    
    if (data.eventDate) {
      let eventDate: Date;
      if (typeof data.eventDate === 'string') {
        eventDate = new Date(data.eventDate);
        if (isNaN(eventDate.getTime())) {
          throw new BadRequestError('Invalid eventDate format. Use ISO 8601 format');
        }
      } else {
        eventDate = data.eventDate;
      }
      updateData.eventDate = eventDate;
    }

    const event = await prisma.event.update({
      where: { id },
      data: updateData
    });

    return event;
  }

  /**
   * Delete event
   */
  async deleteEvent(id: string): Promise<void> {
    await this.getEventById(id);
    await prisma.event.delete({
      where: { id }
    });
  }
}

// Export singleton instance
export const eventService = new EventService();

