import { User } from '@prisma/client';
import prisma from '../lib/prisma';
import { NotFoundError, BadRequestError } from '../types/errors';

/**
 * Profile Service
 * Handles user profile operations
 */
class ProfileService {
  /**
   * Update user profile
   */
  async updateProfile(
    userId: string,
    fullName?: string,
    neighborhood?: string
  ): Promise<User> {
    // Validate input
    if (!fullName && !neighborhood) {
      throw new BadRequestError('At least one field (fullName or neighborhood) must be provided');
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!existingUser) {
      throw new NotFoundError('User not found');
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(fullName !== undefined && { fullName }),
        ...(neighborhood !== undefined && { neighborhood })
      }
    });

    return updatedUser;
  }

  /**
   * Get user profile
   */
  async getProfile(userId: string): Promise<User> {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }
}

// Export singleton instance
export const profileService = new ProfileService();

