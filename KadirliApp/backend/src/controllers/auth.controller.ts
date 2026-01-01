import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { BadRequestError } from '../types/errors';

/**
 * Auth Controller
 * Handles HTTP requests for authentication
 */
export class AuthController {
  /**
   * POST /api/auth/otp
   * Send OTP to phone number
   */
  static async sendOTP(req: Request, res: Response, next: NextFunction) {
    try {
      const { phone } = req.body;

      if (!phone) {
        throw new BadRequestError('Phone number is required');
      }

      await authService.sendOTP(phone);

      res.status(200).json({
        success: true,
        message: 'OTP sent successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/verify
   * Verify OTP and return JWT token
   * Accepts both 'token' and 'code' field names for compatibility
   */
  static async verifyOTP(req: Request, res: Response, next: NextFunction) {
    try {
      const { phone, token, code } = req.body;
      
      // Support both 'token' (from Swift) and 'code' field names
      const otpCode = token || code;

      if (!phone || !otpCode) {
        throw new BadRequestError('Phone number and token/code are required');
      }

      const response = await authService.verifyOTP(phone, otpCode);

      res.status(200).json({
        success: true,
        data: response
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/users
   * Get all users (protected route)
   * Returns list of users with id, phone, createdAt
   */
  static async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await authService.getAllUsers();

      res.status(200).json({
        success: true,
        data: users
      });
    } catch (error) {
      next(error);
    }
  }
}

