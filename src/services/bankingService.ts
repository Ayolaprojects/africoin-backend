import axios, { AxiosInstance } from 'axios';

export interface BankAccount {
  id: string;
  bankCode: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  currency: string;
  country: string;
  verified: boolean;
  createdAt: Date;
}

export interface BankTransaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  timestamp: Date;
  bankRef: string;
}

export interface LocalBankConfig {
  code: string;
  name: string;
  country: string;
  apiBase: string;
  supportedCurrencies: string[];
  fees: {
    domestic: number;
    international: number;
  };
}

export interface InternationalBankConfig {
  code: string;
  name: string;
  country: string;
  swiftCode: string;
  supportedCurrencies: string[];
  fees: {
    incoming: number;
    outgoing: number;
  };
}

export class BankingService {
  private api: AxiosInstance;
  private localBanks: Map<string, LocalBankConfig> = new Map();
  private internationalBanks: Map<string, InternationalBankConfig> = new Map();

  constructor(apiUrl: string = 'http://localhost:3001/api') {
    this.api = axios.create({
      baseURL: `${apiUrl}/banking`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    this.initializeBanks();
  }

  private initializeBanks(): void {
    // South African Banks (Local)
    this.localBanks.set('FNB', {
      code: 'FNBSAZAJNXX',
      name: 'First National Bank',
      country: 'ZA',
      apiBase: 'https://api.fnb.co.za',
      supportedCurrencies: ['ZAR', 'USD', 'EUR'],
      fees: {
        domestic: 0.5,
        international: 2.5,
      },
    });

    this.localBanks.set('ABSA', {
      code: 'ABSAZAJJXXX',
      name: 'ABSA Bank South Africa',
      country: 'ZA',
      apiBase: 'https://api.absa.co.za',
      supportedCurrencies: ['ZAR', 'USD', 'EUR', 'GBP'],
      fees: {
        domestic: 0.5,
        international: 2.5,
      },
    });

    this.localBanks.set('STANDARD', {
      code: 'STANZAJAJXXX',
      name: 'Standard Bank',
      country: 'ZA',
      apiBase: 'https://api.standardbank.co.za',
      supportedCurrencies: ['ZAR', 'USD', 'EUR', 'GBP'],
      fees: {
        domestic: 0.5,
        international: 2.5,
      },
    });

    this.localBanks.set('NEDBANK', {
      code: 'NEDSZAJJXXX',
      name: 'Nedbank Limited',
      country: 'ZA',
      apiBase: 'https://api.nedbank.co.za',
      supportedCurrencies: ['ZAR', 'USD', 'EUR'],
      fees: {
        domestic: 0.5,
        international: 2.5,
      },
    });

    this.localBanks.set('BIDVEST', {
      code: 'BIVCZAJJXXX',
      name: 'Bidvest Bank',
      country: 'ZA',
      apiBase: 'https://api.bidvestbank.co.za',
      supportedCurrencies: ['ZAR', 'USD', 'EUR', 'GBP'],
      fees: {
        domestic: 0.5,
        international: 2.5,
      },
    });

    // Nigerian Banks (Local)
    this.localBanks.set('GTB', {
      code: 'GUARANTY',
      name: 'Guaranty Trust Bank',
      country: 'NG',
      apiBase: 'https://api.gtbank.com',
      supportedCurrencies: ['NGN', 'USD'],
      fees: {
        domestic: 0.75,
        international: 2.0,
      },
    });

    this.localBanks.set('ACCESS', {
      code: 'ACCESS',
      name: 'Access Bank Nigeria',
      country: 'NG',
      apiBase: 'https://api.accessbankng.com',
      supportedCurrencies: ['NGN', 'USD', 'EUR'],
      fees: {
        domestic: 0.75,
        international: 2.0,
      },
    });

    // Kenyan Banks (Local)
    this.localBanks.set('KCB', {
      code: 'KCB',
      name: 'Kenya Commercial Bank',
      country: 'KE',
      apiBase: 'https://api.kcbgroup.com',
      supportedCurrencies: ['KES', 'USD'],
      fees: {
        domestic: 0.5,
        international: 2.0,
      },
    });

    // International Banks (SWIFT)
    this.internationalBanks.set('HSBC', {
      code: 'HSBC',
      name: 'HSBC Bank',
      country: 'GB',
      swiftCode: 'HBKAGB42',
      supportedCurrencies: ['USD', 'EUR', 'GBP', 'JPY', 'CNY'],
      fees: {
        incoming: 0.0,
        outgoing: 1.5,
      },
    });

    this.internationalBanks.set('CHASE', {
      code: 'CHASE',
      name: 'JPMorgan Chase',
      country: 'US',
      swiftCode: 'CHASUS33',
      supportedCurrencies: ['USD', 'EUR', 'GBP'],
      fees: {
        incoming: 0.0,
        outgoing: 2.0,
      },
    });

    this.internationalBanks.set('DEUTSCHE', {
      code: 'DEUTSCHE',
      name: 'Deutsche Bank',
      country: 'DE',
      swiftCode: 'DEUTDEDD',
      supportedCurrencies: ['EUR', 'USD', 'GBP', 'JPY'],
      fees: {
        incoming: 0.0,
        outgoing: 1.75,
      },
    });
  }

  /**
   * Get all local banks
   */
  getLocalBanks(): LocalBankConfig[] {
    return Array.from(this.localBanks.values());
  }

  /**
   * Get all international banks
   */
  getInternationalBanks(): InternationalBankConfig[] {
    return Array.from(this.internationalBanks.values());
  }

  /**
   * Get banks by country
   */
  getBanksByCountry(country: string): LocalBankConfig[] {
    return Array.from(this.localBanks.values()).filter((bank) => bank.country === country);
  }

  /**
   * Link bank account
   */
  async linkBankAccount(
    bankCode: string,
    accountNumber: string,
    accountHolder: string,
    country: string
  ): Promise<BankAccount> {
    const response = await this.api.post('/accounts/link', {
      bankCode,
      accountNumber,
      accountHolder,
      country,
    });
    return response.data;
  }

  /**
   * Verify bank account
   */
  async verifyBankAccount(accountId: string, verificationCode: string): Promise<BankAccount> {
    const response = await this.api.post(`/accounts/${accountId}/verify`, {
      code: verificationCode,
    });
    return response.data;
  }

  /**
   * Get linked bank accounts
   */
  async getLinkedAccounts(): Promise<BankAccount[]> {
    const response = await this.api.get('/accounts');
    return response.data.data;
  }

  /**
   * Send domestic bank transfer
   */
  async sendDomesticTransfer(
    fromAccountId: string,
    toAccountNumber: string,
    toBankCode: string,
    amount: number,
    currency: string,
    narration: string
  ): Promise<BankTransaction> {
    const response = await this.api.post('/transfers/domestic', {
      fromAccountId,
      toAccountNumber,
      toBankCode,
      amount,
      currency,
      narration,
    });
    return response.data;
  }

  /**
   * Send international bank transfer (SWIFT)
   */
  async sendInternationalTransfer(
    fromAccountId: string,
    toSwiftCode: string,
    toIban: string,
    toName: string,
    amount: number,
    currency: string,
    narration: string
  ): Promise<BankTransaction> {
    const response = await this.api.post('/transfers/international', {
      fromAccountId,
      toSwiftCode,
      toIban,
      toName,
      amount,
      currency,
      narration,
    });
    return response.data;
  }

  /**
   * Receive international transfer
   */
  async getReceiveDetails(accountId: string, currency: string): Promise<any> {
    const response = await this.api.get(
      `/accounts/${accountId}/receive-details?currency=${currency}`
    );
    return response.data;
  }

  /**
   * Get transfer history
   */
  async getTransferHistory(
    accountId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<BankTransaction[]> {
    const response = await this.api.get(
      `/accounts/${accountId}/transfers?limit=${limit}&offset=${offset}`
    );
    return response.data.data;
  }

  /**
   * Calculate transfer fees
   */
  async calculateFees(
    fromCountry: string,
    toCountry: string,
    amount: number,
    currency: string
  ): Promise<{ fee: number; total: number; rate: number }> {
    const response = await this.api.post('/fees/calculate', {
      fromCountry,
      toCountry,
      amount,
      currency,
    });
    return response.data;
  }

  /**
   * Get exchange rates
   */
  async getExchangeRates(
    fromCurrency: string,
    toCurrency: string
  ): Promise<{ rate: number; timestamp: Date }> {
    const response = await this.api.get(
      `/rates?from=${fromCurrency}&to=${toCurrency}`
    );
    return response.data;
  }

  /**
   * Remove bank account
   */
  async removeBankAccount(accountId: string): Promise<{ success: boolean }> {
    const response = await this.api.delete(`/accounts/${accountId}`);
    return response.data;
  }

  /**
   * Get bank details
   */
  async getBankDetails(bankCode: string): Promise<LocalBankConfig | InternationalBankConfig | null> {
    return this.localBanks.get(bankCode) || this.internationalBanks.get(bankCode) || null;
  }

  /**
   * Validate account number
   */
  async validateAccountNumber(bankCode: string, accountNumber: string): Promise<{ valid: boolean; accountHolder?: string }> {
    const response = await this.api.post('/validate/account', {
      bankCode,
      accountNumber,
    });
    return response.data;
  }

  /**
   * Get supported countries
   */
  getSupportedCountries(): string[] {
    const countries = new Set<string>();
    this.localBanks.forEach((bank) => countries.add(bank.country));
    this.internationalBanks.forEach((bank) => countries.add(bank.country));
    return Array.from(countries).sort();
  }
}

export default new BankingService();
