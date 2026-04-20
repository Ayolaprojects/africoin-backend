// Zimbabwe Payment & Banking Service
export interface EcoCashTransaction {
  phoneNumber: string;
  amount: number;
  transactionType: 'airtime' | 'money_transfer' | 'bill_payment';
  reference: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface CassavaTransaction {
  method: 'payzone' | 'kwese_remit';
  amount: number;
  recipient: string;
  reference: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface ZimbabweExchangeRate {
  currency: string;
  zwlRate: number;
  usdRate: number;
  timestamp: string;
}

export interface ZimbabweBankAccount {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  accountType: 'savings' | 'checking';
  currency: 'ZWL' | 'USD';
}

export interface ZimbabweAnalytics {
  totalTransactions: number;
  totalVolume: number; // in ZWL
  averageTransaction: number;
  topPaymentMethod: string;
  transactionsByMethod: Record<string, number>;
  monthlyTrend: Array<{ month: string; volume: number }>;
}

class ZimbabweService {
  private apiBaseUrl = 'https://api.africoin.io/v1/zimbabwe';

  // EcoCash Integration
  async initiateEcoCash(transaction: Omit<EcoCashTransaction, 'reference' | 'timestamp' | 'status'>): Promise<EcoCashTransaction> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/ecocash/initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...transaction,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error('EcoCash initiation failed');
      
      const data = await response.json();
      return {
        ...transaction,
        reference: data.reference,
        timestamp: new Date().toISOString(),
        status: 'pending',
      };
    } catch (error) {
      console.error('EcoCash error:', error);
      throw error;
    }
  }

  async confirmEcoCashPin(reference: string, pin: string): Promise<EcoCashTransaction> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/ecocash/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference, pin }),
      });

      if (!response.ok) throw new Error('EcoCash PIN confirmation failed');
      
      return await response.json();
    } catch (error) {
      console.error('EcoCash PIN error:', error);
      throw error;
    }
  }

  // Cassava Integration (PayZone & Kwese Remit)
  async initiateCassava(transaction: Omit<CassavaTransaction, 'reference' | 'timestamp' | 'status'>): Promise<CassavaTransaction> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/cassava/initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...transaction,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error('Cassava initiation failed');
      
      const data = await response.json();
      return {
        ...transaction,
        reference: data.reference,
        timestamp: new Date().toISOString(),
        status: 'pending',
      };
    } catch (error) {
      console.error('Cassava error:', error);
      throw error;
    }
  }

  async confirmCassavaTransaction(reference: string, otp: string): Promise<CassavaTransaction> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/cassava/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference, otp }),
      });

      if (!response.ok) throw new Error('Cassava confirmation failed');
      
      return await response.json();
    } catch (error) {
      console.error('Cassava confirmation error:', error);
      throw error;
    }
  }

  // Exchange Rates
  async getExchangeRates(): Promise<ZimbabweExchangeRate> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/exchange-rates`);
      if (!response.ok) throw new Error('Failed to fetch exchange rates');
      
      return await response.json();
    } catch (error) {
      console.error('Exchange rate error:', error);
      // Return fallback rates
      return {
        currency: 'ZWL',
        zwlRate: 1,
        usdRate: 1000, // Approximate fallback
        timestamp: new Date().toISOString(),
      };
    }
  }

  // Transaction History
  async getZimbabweTransactionHistory(userId: string, limit: number = 10): Promise<(EcoCashTransaction | CassavaTransaction)[]> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/transactions?userId=${userId}&limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch transaction history');
      
      return await response.json();
    } catch (error) {
      console.error('Transaction history error:', error);
      return [];
    }
  }

  // Analytics
  async getZimbabweAnalytics(userId: string): Promise<ZimbabweAnalytics> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/analytics?userId=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch analytics');
      
      return await response.json();
    } catch (error) {
      console.error('Analytics error:', error);
      return {
        totalTransactions: 0,
        totalVolume: 0,
        averageTransaction: 0,
        topPaymentMethod: 'None',
        transactionsByMethod: {},
        monthlyTrend: [],
      };
    }
  }

  // Bank Accounts
  async saveBankAccount(userId: string, account: ZimbabweBankAccount): Promise<ZimbabweBankAccount> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/bank-accounts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...account }),
      });

      if (!response.ok) throw new Error('Failed to save bank account');
      
      return await response.json();
    } catch (error) {
      console.error('Bank account save error:', error);
      throw error;
    }
  }

  async getBankAccounts(userId: string): Promise<ZimbabweBankAccount[]> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/bank-accounts?userId=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch bank accounts');
      
      return await response.json();
    } catch (error) {
      console.error('Bank account fetch error:', error);
      return [];
    }
  }

  // ZWL Balance (mock implementation)
  async getZWLBalance(userId: string): Promise<number> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/balance?userId=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch ZWL balance');
      
      const data = await response.json();
      return data.zwlBalance || 0;
    } catch (error) {
      console.error('ZWL balance error:', error);
      return 0;
    }
  }

  // Zimbabwean Banks List
  getZimbabweanBanks(): string[] {
    return [
      'ZWB - Zimbabwe Banking Corporation',
      'CBZ Bank',
      'CABS - Consolidated African Banks',
      'MBCA - Metbank',
      'Econet - EcoCash Provider',
      'NetOne - NetOne Money',
      'Telecel - Telecel Money',
      'FBC Bank Zimbabwe',
      'TN Bank',
      'Stanbic Bank Zimbabwe',
    ];
  }

  // Available Payment Methods for Zimbabwe
  getAvailablePaymentMethods(): string[] {
    return [
      'ecocash',
      'ecocash_airtime',
      'payzone',
      'kwese_remit',
      'bank_transfer',
      'mobile_money',
    ];
  }

  // Mobile Money Providers
  getMobileMoneyProviders(): string[] {
    return [
      'EcoCash',
      'NetOne Money',
      'Telecel Money',
      'Innbucks',
      'ZIPIT',
      'OneWallet',
    ];
  }
}

export const zimbabweService = new ZimbabweService();
