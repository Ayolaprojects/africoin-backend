import { useCallback } from 'react';
import { stripeService } from '../services/stripeService';

export const useStripe = () => {
  const createPaymentIntent = useCallback(async (
    amount: number,
    currency: string,
    description?: string
  ) => {
    try {
      return await stripeService.createPaymentIntent({
        amount,
        currency,
        description,
      });
    } catch (error) {
      console.error('Payment intent creation failed:', error);
      throw error;
    }
  }, []);

  const processPayment = useCallback(async (
    token: string,
    amount: number,
    currency: string
  ) => {
    try {
      return await stripeService.processCardPayment(token, {
        amount,
        currency,
      });
    } catch (error) {
      console.error('Payment processing failed:', error);
      throw error;
    }
  }, []);

  return {
    createPaymentIntent,
    processPayment,
  };
};
