import { Request, Response, NextFunction } from 'express';
import { jwtService } from '../services/jwt.service';
import { UnauthorizedError } from '../types/errors';

/**
 * Extend Express Request to include user info
 */
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        phone?: string;
        email?: string;
      };
    }
  }
}

/**
 * Authentication middleware
 * Verifies JWT token and attaches user info to request
 */
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = jwtService.extractTokenFromHeader(authHeader);

    if (!token) {
      throw new UnauthorizedError('No token provided');
    }

    // Verify token
    const payload = jwtService.verifyToken(token);

    // Attach user info to request
    req.user = {
      userId: payload.userId,
      phone: payload.phone,
      email: payload.email
    };

    next();
  } catch (error) {
    if (error instanceof Error && error.message.includes('token')) {
      return next(new UnauthorizedError('Invalid or expired token'));
    }
    next(error);
  }
};

