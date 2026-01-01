import { TaxiRequest, TaxiRequestStatus, Prisma } from '@prisma/client';
import prisma from '../lib/prisma';
import { BadRequestError, NotFoundError, ForbiddenError } from '../types/errors';

// Type for TaxiRequest with relations
type TaxiRequestWithRelations = Prisma.TaxiRequestGetPayload<{
  include: {
    user: {
      select: {
        id: true;
        phone: true;
        fullName: true;
      };
    };
    taxi: {
      include: {
        category: true;
        owner: {
          select: {
            id: true;
            phone: true;
            fullName: true;
          };
        };
      };
    };
  };
}>;

export interface CreateTaxiRequestDto {
  taxiId: string;
  pickupLatitude: number;
  pickupLongitude: number;
  passengerPhone?: string;
}

/**
 * Taxi Request Service
 * Handles taxi request business logic
 */
class TaxiRequestService {
  /**
   * Create a taxi request (protected - requires userId)
   */
  async createRequest(userId: string, data: CreateTaxiRequestDto): Promise<TaxiRequest> {
    // Validate required fields
    if (!data.taxiId || data.pickupLatitude === undefined || data.pickupLongitude === undefined) {
      throw new BadRequestError('taxiId, pickupLatitude, and pickupLongitude are required');
    }

    // Validate coordinates
    if (typeof data.pickupLatitude !== 'number' || data.pickupLatitude < -90 || data.pickupLatitude > 90) {
      throw new BadRequestError('pickupLatitude must be a number between -90 and 90');
    }
    if (typeof data.pickupLongitude !== 'number' || data.pickupLongitude < -180 || data.pickupLongitude > 180) {
      throw new BadRequestError('pickupLongitude must be a number between -180 and 180');
    }

    // Verify taxi (GuideItem) exists
    const taxi = await prisma.guideItem.findUnique({
      where: { id: data.taxiId }
    });

    if (!taxi) {
      throw new NotFoundError('Taxi not found');
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Get user's phone if not provided
    const passengerPhone = data.passengerPhone || user.phone || null;

    const request = await prisma.taxiRequest.create({
      data: {
        taxiId: data.taxiId,
        userId,
        passengerPhone,
        pickupLatitude: data.pickupLatitude,
        pickupLongitude: data.pickupLongitude,
        status: TaxiRequestStatus.pending
      },
      include: {
        user: {
          select: {
            id: true,
            phone: true,
            fullName: true
          }
        },
        taxi: {
          include: {
            category: true,
            owner: {
              select: {
                id: true,
                phone: true,
                fullName: true
              }
            }
          }
        }
      }
    });

    return request;
  }

  /**
   * Get user's own requests (protected - requires userId)
   */
  async getMyRequests(userId: string): Promise<TaxiRequest[]> {
    const requests = await prisma.taxiRequest.findMany({
      where: {
        userId
      },
      include: {
        taxi: {
          include: {
            category: true,
            owner: {
              select: {
                id: true,
                phone: true,
                fullName: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return requests;
  }

  /**
   * Get driver's requests (protected - requires userId of driver)
   * Driver must own a GuideItem (taxi)
   */
  async getDriverRequests(userId: string): Promise<TaxiRequest[]> {
    // Find the driver's taxi (GuideItem)
    const taxi = await prisma.guideItem.findFirst({
      where: {
        ownerId: userId
      }
    });

    if (!taxi) {
      // Driver doesn't have a taxi registered
      return [];
    }

    // Get requests for this taxi (pending and accepted statuses)
    const requests = await prisma.taxiRequest.findMany({
      where: {
        taxiId: taxi.id,
        status: {
          in: [TaxiRequestStatus.pending, TaxiRequestStatus.accepted]
        }
      },
      include: {
        user: {
          select: {
            id: true,
            phone: true,
            fullName: true
          }
        },
        taxi: {
          include: {
            category: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return requests;
  }

  /**
   * Get request by ID
   */
  async getRequestById(id: string): Promise<TaxiRequestWithRelations> {
    const request = await prisma.taxiRequest.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            phone: true,
            fullName: true
          }
        },
        taxi: {
          include: {
            category: true,
            owner: {
              select: {
                id: true,
                phone: true,
                fullName: true
              }
            }
          }
        }
      }
    });

    if (!request) {
      throw new NotFoundError('Taxi request not found');
    }

    return request;
  }

  /**
   * Update request status (protected)
   * Driver can accept/reject, Passenger can cancel
   */
  async updateRequestStatus(
    id: string,
    userId: string,
    status: TaxiRequestStatus
  ): Promise<TaxiRequest> {
    // Check if request exists
    const request = await this.getRequestById(id);

    // Validate status enum
    const validStatuses = Object.values(TaxiRequestStatus);
    if (!validStatuses.includes(status)) {
      throw new BadRequestError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    // Check authorization
    const isPassenger = request.userId === userId;
    const isDriver = request.taxi?.ownerId === userId;

    if (!isPassenger && !isDriver) {
      throw new ForbiddenError('You can only update your own requests or requests sent to your taxi');
    }

    // Validate status transitions
    if (isPassenger) {
      // Passenger can only cancel
      if (status !== TaxiRequestStatus.cancelled) {
        throw new ForbiddenError('Passengers can only cancel requests');
      }
    } else if (isDriver) {
      // Driver can accept, reject, or mark as in_progress/completed
      if (status === TaxiRequestStatus.cancelled) {
        throw new ForbiddenError('Drivers cannot cancel requests. Use rejected status instead.');
      }
    }

    const updatedRequest = await prisma.taxiRequest.update({
      where: { id },
      data: { status },
      include: {
        user: {
          select: {
            id: true,
            phone: true,
            fullName: true
          }
        },
        taxi: {
          include: {
            category: true,
            owner: {
              select: {
                id: true,
                phone: true,
                fullName: true
              }
            }
          }
        }
      }
    });

    return updatedRequest;
  }

  /**
   * Delete request (only passenger can delete their own requests)
   */
  async deleteRequest(id: string, userId: string): Promise<void> {
    // Check if request exists
    const request = await this.getRequestById(id);

    // Check if user is the passenger
    if (request.userId !== userId) {
      throw new ForbiddenError('You can only delete your own requests');
    }

    await prisma.taxiRequest.delete({
      where: { id }
    });
  }
}

// Export singleton instance
export const taxiRequestService = new TaxiRequestService();

