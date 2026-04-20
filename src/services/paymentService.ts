import axios from 'axios';

export interface PaymentRequest {
  amount: number;
  currency: 'USDT' | 'ZAR' | 'USD' | 'EUR';
  method: 'stripe' | 'bank_transfer' | 'luno' | 'payfast';
  country?: 'ZA' | 'US' | 'GB' | 'EU';
  metadata?: Record<string, any>;
}

export interface PaymentResponse {
  transactionId: string;
  status: 'pending' | 'completed' | 'failed';
  amount: number;
  currency: string;
  method: string;
  timestamp: string;
  paymentUrl?: string;
}

export interface BankAccount {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  accountType: 'checking' | 'savings';
  verified: boolean;
}

export class PaymentService {
  private paymentApiUrl = import.meta.env.VITE_PAYMENT_API_URL || 'http://localhost:3001';

  /**
   * Create payment via Stripe (Global)
   */
  async createStripePayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const response = await axios.post(`${this.paymentApiUrl}/api/payments/stripe`, {
        amount: request.amount,
        currency: request.currency,
        metadata: request.metadata,
      });

      return {
        transactionId: response.data.id,
        status: 'pending',
        amount: request.amount,
        currency: request.currency,
        method: 'stripe',
        timestamp: new Date().toISOString(),
        paymentUrl: response.data.url,
      };
    } catch (error) {
      console.error('Stripe payment error:', error);
      throw new Error('Failed to create Stripe payment');
    }
  }

  /**
   * Create payment via SA Bank Transfer (Direct)
   * Supports: FNB, ABSA, Standard Bank, Nedbank
   */
  async createBankTransferPayment(
    request: PaymentRequest,
    bankAccount: BankAccount
  ): Promise<PaymentResponse> {
    try {
      const response = await axios.post(`${this.paymentApiUrl}/api/payments/bank-transfer`, {
        amount: request.amount,
        currency: request.currency,
        bankAccount: {
          bankName: bankAccount.bankName,
          accountNumber: bankAccount.accountNumber,
          accountHolder: bankAccount.accountHolder,
        },
        metadata: request.metadata,
      });

      return {
        transactionId: response.data.transactionId,
        status: 'pending',
        amount: request.amount,
        currency: 'ZAR',
        method: 'bank_transfer',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Bank transfer error:', error);
      throw new Error('Failed to create bank transfer');
    }
  }

  /**
   * Create payment via PayFast (SA Payment Gateway)
   */
  async createPayFastPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const response = await axios.post(`${this.paymentApiUrl}/api/payments/payfast`, {
        amount: request.amount,
        currency: request.currency,
        metadata: request.metadata,
      });

      return {
        transactionId: response.data.paymentReference,
        status: 'pending',
        amount: request.amount,
        currency: 'ZAR',
        method: 'payfast',
        timestamp: new Date().toISOString(),
        paymentUrl: response.data.paymentUrl,
      };
    } catch (error) {
      console.error('PayFast error:', error);
      throw new Error('Failed to create PayFast payment');
    }
  }

  /**
   * Create payment via Luno (Crypto-to-Fiat in SA)
   */
  async createLunoPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const response = await axios.post(`${this.paymentApiUrl}/api/payments/luno`, {
        amount: request.amount,
        fromCurrency: 'USDT',
        toCurrency: request.currency,
        metadata: request.metadata,
      });

      return {
        transactionId: response.data.orderId,
        status: 'pending',
        amount: request.amount,
        currency: request.currency,
        method: 'luno',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Luno error:', error);
      throw new Error('Failed to create Luno payment');
    }
  }

  /**
   * Route payment based on user location & method
   */
  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    switch (request.method) {
      case 'stripe':
        return this.createStripePayment(request);
      case 'bank_transfer':
        if (!request.metadata?.bankAccount) {
          throw new Error('Bank account required for bank transfer');
        }
        return this.createBankTransferPayment(request, request.metadata.bankAccount);
      case 'luno':
        return this.createLunoPayment(request);
      case 'payfast':
        return this.createPayFastPayment(request);
      default:
        throw new Error('Unsupported payment method');
    }
  }

  /**
   * Get available payment methods for location
   */
  getAvailablePaymentMethods(country: string): string[] {
    const methods: Record<string, string[]> = {
      ZA: ['stripe', 'bank_transfer', 'payfast', 'luno'],
      US: ['stripe'],
      GB: ['stripe'],
      EU: ['stripe'],
    };
    return methods[country] || ['stripe'];
  }

  /**
   * Get South African banks list
   */
  getSouthAfricanBanks(): string[] {
    return [
      'FNB',
      'ABSA',
      'Standard Bank',
      'Nedbank',
      'Capitec',
      'African Bank',
      'TymeBank',
      'Discovery Bank',
    ];
  }
}

export const paymentService = new PaymentService();
