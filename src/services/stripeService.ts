/* Stripe Payment Service */

interface PaymentConfig {
  amount: number;
  currency: string;
  description?: string;
  metadata?: Record<string, any>;
}

export class StripeService {
  async createPaymentIntent(config: PaymentConfig): Promise<any> {
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) throw new Error('Payment intent creation failed');
      return await response.json();
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }

  async processCardPayment(
    token: string,
    config: PaymentConfig
  ): Promise<any> {
    try {
      const response = await fetch('/api/process-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          ...config,
        }),
      });

      if (!response.ok) throw new Error('Payment processing failed');
      return await response.json();
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  }

  async verifyWebhook(_signature: string, _body: string): Promise<boolean> {
    try {
      // Webhook verification would happen server-side in production
      return true;
    } catch (error) {
      console.error('Webhook verification failed:', error);
      return false;
    }
  }
}

export const stripeService = new StripeService();
