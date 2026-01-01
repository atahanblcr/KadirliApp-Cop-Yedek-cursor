/**
 * OTP Service
 * Handles OTP generation, storage, and verification
 * For now, stores OTPs in-memory (in production, use Redis or database)
 */

interface OTPEntry {
  phone: string;
  code: string;
  expiresAt: Date;
}

class OTPService {
  private otpStore: Map<string, OTPEntry> = new Map();
  private readonly OTP_EXPIRY_MINUTES = 10; // OTP expires in 10 minutes
  private readonly OTP_LENGTH = 6;

  /**
   * Generate a random 6-digit OTP code
   */
  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Send OTP to phone number
   * For now, just logs to console and stores in memory
   */
  async sendOTP(phone: string): Promise<string> {
    // Clean phone number (remove spaces, dashes, etc.)
    const cleanPhone = phone.replace(/\D/g, '');

    // Generate OTP
    const code = this.generateOTP();

    // Store OTP with expiry
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + this.OTP_EXPIRY_MINUTES);

    this.otpStore.set(cleanPhone, {
      phone: cleanPhone,
      code,
      expiresAt
    });

    // Log OTP to console (for development)
    console.log(`📱 OTP for ${cleanPhone}: ${code} (expires in ${this.OTP_EXPIRY_MINUTES} minutes)`);

    // In production, send SMS here using a service like Twilio, AWS SNS, etc.
    // await smsService.send(cleanPhone, `Your verification code is: ${code}`);

    return code;
  }

  /**
   * Verify OTP code
   */
  async verifyOTP(phone: string, code: string): Promise<boolean> {
    const cleanPhone = phone.replace(/\D/g, '');
    const entry = this.otpStore.get(cleanPhone);

    if (!entry) {
      return false;
    }

    // Check if expired
    if (new Date() > entry.expiresAt) {
      this.otpStore.delete(cleanPhone);
      return false;
    }

    // Check if code matches
    if (entry.code !== code) {
      return false;
    }

    // OTP verified successfully, remove it
    this.otpStore.delete(cleanPhone);
    return true;
  }

  /**
   * Clean up expired OTPs (can be called periodically)
   */
  cleanupExpiredOTPs(): void {
    const now = new Date();
    for (const [phone, entry] of this.otpStore.entries()) {
      if (now > entry.expiresAt) {
        this.otpStore.delete(phone);
      }
    }
  }
}

// Export singleton instance
export const otpService = new OTPService();

