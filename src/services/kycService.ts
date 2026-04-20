import axios from 'axios';

export interface KYCUser {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  country: string;
  documentType: 'passport' | 'id_card' | 'driver_license';
  documentNumber: string;
  documentImage: string; // Base64
  selfieImage: string; // Base64
  bankAccountNumber?: string;
  bankName?: string;
}

export interface KYCStatus {
  userId: string;
  status: 'pending' | 'approved' | 'rejected' | 'needs_review';
  tier: 'unverified' | 'basic' | 'intermediate' | 'advanced';
  limits: {
    dailyLimit: number;
    monthlyLimit: number;
  };
  verifiedAt?: string;
  rejectionReason?: string;
}

export interface BankVerification {
  accountNumber: string;
  bankName: string;
  accountHolder: string;
  verificationCode: string; // One-time code sent to bank
  verified: boolean;
}

export class KYCService {
  private apiUrl = import.meta.env.VITE_PAYMENT_API_URL || 'http://localhost:3001';

  /**
   * Start KYC process via Stripe Identity (supports global identity verification)
   */
  async startStripeIdentityVerification(userId: string): Promise<string> {
    try {
      const response = await axios.post(`${this.apiUrl}/api/kyc/stripe-verification`, {
        userId,
        returnUrl: `${window.location.origin}/kyc-result`,
      });

      return response.data.verificationSessionUrl;
    } catch (error) {
      console.error('Stripe verification error:', error);
      throw new Error('Failed to start identity verification');
    }
  }

  /**
   * Submit basic KYC information
   */
  async submitKYC(user: KYCUser): Promise<KYCStatus> {
    try {
      const response = await axios.post(`${this.apiUrl}/api/kyc/submit`, {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        dateOfBirth: user.dateOfBirth,
        country: user.country,
        documentType: user.documentType,
        documentNumber: user.documentNumber,
        documentImage: user.documentImage,
        selfieImage: user.selfieImage,
      });

      return response.data;
    } catch (error) {
      console.error('KYC submission error:', error);
      throw new Error('Failed to submit KYC information');
    }
  }

  /**
   * Verify South African bank account
   * Sends verification code to registered bank account
   */
  async verifyBankAccount(accountNumber: string, bankName: string): Promise<string> {
    try {
      const response = await axios.post(`${this.apiUrl}/api/kyc/verify-bank-sa`, {
        accountNumber,
        bankName,
      });

      return response.data.verificationRequestId;
    } catch (error) {
      console.error('Bank verification error:', error);
      throw new Error('Failed to verify bank account');
    }
  }

  /**
   * Confirm bank verification with code
   */
  async confirmBankVerification(
    verificationRequestId: string,
    verificationCode: string
  ): Promise<BankVerification> {
    try {
      const response = await axios.post(
        `${this.apiUrl}/api/kyc/confirm-bank-verification`,
        {
          verificationRequestId,
          verificationCode,
        }
      );

      return response.data;
    } catch (error) {
      console.error('Bank verification confirmation error:', error);
      throw new Error('Failed to confirm bank verification');
    }
  }

  /**
   * Get KYC status for user
   */
  async getKYCStatus(userId: string): Promise<KYCStatus> {
    try {
      const response = await axios.get(`${this.apiUrl}/api/kyc/status/${userId}`);
      return response.data;
    } catch (error) {
      console.error('KYC status error:', error);
      throw new Error('Failed to get KYC status');
    }
  }

  /**
   * Get KYC tier limits
   */
  getTierLimits(tier: string): { dailyLimit: number; monthlyLimit: number } {
    const limits: Record<string, { dailyLimit: number; monthlyLimit: number }> = {
      unverified: { dailyLimit: 100, monthlyLimit: 500 },
      basic: { dailyLimit: 1000, monthlyLimit: 5000 },
      intermediate: { dailyLimit: 10000, monthlyLimit: 50000 },
      advanced: { dailyLimit: 100000, monthlyLimit: 500000 },
    };
    return limits[tier] || limits.unverified;
  }

  /**
   * South African ID validation
   */
  validateSAIdNumber(idNumber: string): boolean {
    // SA ID format: YYMMDDSSSSSCZ
    if (!/^\d{13}$/.test(idNumber)) return false;

    // Luhn algorithm checksum
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      let digit = parseInt(idNumber[i]);
      if (i % 2 === 0) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
    }

    const checkDigit = (10 - (sum % 10)) % 10;
    return checkDigit === parseInt(idNumber[12]);
  }
}

export const kycService = new KYCService();
