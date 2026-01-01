import { User } from '@prisma/client';
import prisma from '../lib/prisma';
import { otpService } from './otp.service';
import { jwtService } from './jwt.service';
import { NotFoundError, UnauthorizedError, BadRequestError } from '../types/errors';

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string | null;
    phone: string | null;
    fullName: string | null;
    neighborhood: string | null;
    app_metadata?: any;
    user_metadata?: any;
  };
}

/**
 * Auth Service
 * Handles authentication business logic
 */
class AuthService {
  /**
   * Send OTP to phone number
   */
  async sendOTP(phone: string): Promise<void> {
    if (!phone || phone.trim().length === 0) {
      throw new BadRequestError('Phone number is required');
    }

    // Validate phone number format (basic validation)
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      throw new BadRequestError('Invalid phone number format');
    }

    await otpService.sendOTP(cleanPhone);
  }

  /**
   * Verify OTP and return JWT token
   */
  async verifyOTP(phone: string, code: string): Promise<AuthResponse> {
    if (!phone || !code) {
      throw new BadRequestError('Phone number and code are required');
    }

    const cleanPhone = phone.replace(/\D/g, '');

    // Verify OTP
    const isValid = await otpService.verifyOTP(cleanPhone, code);
    if (!isValid) {
      throw new UnauthorizedError('Invalid or expired verification code');
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { phone: cleanPhone }
    });

    if (!user) {
      // Create new user
      user = await prisma.user.create({
        data: {
          phone: cleanPhone,
          notificationPreferences: {
            news: true,
            deaths: true,
            pharmacy: false,
            events: true
          }
        }
      });
    }

    // Generate JWT token
    const accessToken = jwtService.generateToken(user);

    // Return response matching Swift AuthResponseDTO format
    return {
      access_token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        fullName: user.fullName,
        neighborhood: user.neighborhood,
        app_metadata: user.appMetadata,
        user_metadata: user.userMetadata
      }
    };
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<User> {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }

  /**
   * Get all users
   * Returns list of users with id, phone, createdAt
   */
  async getAllUsers(): Promise<Array<{ id: string; phone: string | null; createdAt: Date }>> {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        phone: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return users;
  }
}

// Export singleton instance
export const authService = new AuthService();

