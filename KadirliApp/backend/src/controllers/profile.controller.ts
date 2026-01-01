import { Request, Response, NextFunction } from 'express';
import { profileService } from '../services/profile.service';
import { BadRequestError } from '../types/errors';

/**
 * Profile Controller
 * Handles HTTP requests for user profiles
 */
export class ProfileController {
  /**
   * PATCH /api/profiles
   * Update user profile (requires authentication)
   */
  static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new BadRequestError('User ID is required');
      }

      const { fullName, neighborhood } = req.body;

      const updatedUser = await profileService.updateProfile(
        userId,
        fullName,
        neighborhood
      );

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          id: updatedUser.id,
          email: updatedUser.email,
          phone: updatedUser.phone,
          fullName: updatedUser.fullName,
          neighborhood: updatedUser.neighborhood
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/profiles
   * Get current user profile (requires authentication)
   */
  static async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new BadRequestError('User ID is required');
      }

      const user = await profileService.getProfile(userId);

      res.status(200).json({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          phone: user.phone,
          fullName: user.fullName,
          neighborhood: user.neighborhood,
          notificationPreferences: user.notificationPreferences
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

