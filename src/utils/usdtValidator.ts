// USDT Transaction Validation and Security Checks
import { VALIDATION, ERROR_MESSAGES } from '../config/usdtConfig';

export interface ValidationResult {
  valid: boolean;
  error?: string;
  warnings?: string[];
}

export class USDTValidator {
  /**
   * Validate recipient address format
   */
  static validateAddress(address: string, blockchain: 'solana' | 'tron' | 'ethereum'): ValidationResult {
    if (!address || typeof address !== 'string') {
      return { valid: false, error: 'Address is required' };
    }

    const pattern = blockchain === 'solana' 
      ? VALIDATION.ADDRESS_PATTERNS.SOLANA
      : blockchain === 'tron'
      ? VALIDATION.ADDRESS_PATTERNS.TRON
      : VALIDATION.ADDRESS_PATTERNS.ETHEREUM;

    if (!pattern.test(address)) {
      return { valid: false, error: ERROR_MESSAGES.INVALID_ADDRESS };
    }

    return { valid: true };
  }

  /**
   * Validate transfer amount
   */
  static validateAmount(amount: number, token: 'USDT' | 'SOL' | 'TRX'): ValidationResult {
    if (!amount || isNaN(amount)) {
      return { valid: false, error: ERROR_MESSAGES.INVALID_AMOUNT };
    }

    const minAmount = VALIDATION.MIN_TRANSFER_AMOUNT[token];
    const maxAmount = VALIDATION.MAX_TRANSFER_AMOUNT[token];

    if (amount < minAmount) {
      return {
        valid: false,
        error: `Minimum transfer amount is ${minAmount} ${token}`,
      };
    }

    if (amount > maxAmount) {
      return {
        valid: false,
        error: `Maximum transfer amount is ${maxAmount} ${token}`,
      };
    }

    return { valid: true };
  }

  /**
   * Validate transfer parameters
   */
  static validateTransfer(
    fromAddress: string,
    toAddress: string,
    amount: number,
    blockchain: 'solana' | 'tron' | 'ethereum',
    balance: number
  ): ValidationResult {
    // Check addresses
    const fromValidation = this.validateAddress(fromAddress, blockchain);
    if (!fromValidation.valid) {
      return { valid: false, error: `Invalid sender address: ${fromValidation.error}` };
    }

    const toValidation = this.validateAddress(toAddress, blockchain);
    if (!toValidation.valid) {
      return { valid: false, error: `Invalid recipient address: ${toValidation.error}` };
    }

    // Check same address
    if (fromAddress.toLowerCase() === toAddress.toLowerCase()) {
      return { valid: false, error: 'Cannot send to the same address' };
    }

    // Check amount
    const amountValidation = this.validateAmount(amount, 'USDT');
    if (!amountValidation.valid) {
      return amountValidation;
    }

    // Check balance
    if (balance < amount) {
      return { valid: false, error: ERROR_MESSAGES.INSUFFICIENT_BALANCE };
    }

    return { valid: true };
  }

  /**
   * Get transaction warnings
   */
  static getWarnings(amount: number, balance: number): string[] {
    const warnings: string[] = [];

    // Warn if transferring large percentage of balance
    if (amount > balance * 0.9) {
      warnings.push('You are transferring more than 90% of your balance');
    }

    // Warn if amount is very small
    if (amount < 1) {
      warnings.push('This is a very small transfer amount');
    }

    // Warn if amount is very large
    if (amount > 100000) {
      warnings.push('This is a large transfer amount, please verify the details');
    }

    return warnings;
  }

  /**
   * Validate transaction hash
   */
  static validateTransactionHash(hash: string, blockchain: 'solana' | 'tron' | 'ethereum'): ValidationResult {
    if (!hash || typeof hash !== 'string') {
      return { valid: false, error: 'Transaction hash is required' };
    }

    // Solana: Base58 encoded string, typically 88 characters
    if (blockchain === 'solana' && !/^[1-9A-HJ-NP-Za-km-z]{87,88}$/.test(hash)) {
      return { valid: false, error: 'Invalid Solana transaction signature' };
    }

    // TRON: Hex string, 64 characters (32 bytes)
    if (blockchain === 'tron' && !/^[a-fA-F0-9]{64}$/.test(hash)) {
      return { valid: false, error: 'Invalid TRON transaction hash' };
    }

    // Ethereum: Hex string with 0x prefix, 66 characters total
    if (blockchain === 'ethereum' && !/^0x[a-fA-F0-9]{64}$/.test(hash)) {
      return { valid: false, error: 'Invalid Ethereum transaction hash' };
    }

    return { valid: true };
  }

  /**
   * Check if address is watchlist address (high risk)
   */
  static async isHighRiskAddress(address: string): Promise<boolean> {
    // This would connect to a service like Chainalysis or similar
    // For now, just return false, but add your implementation here
    try {
      // Example: Check against a blocklist
      const response = await fetch(`https://risk-api.example.com/check?address=${address}`);
      if (response.ok) {
        const data = await response.json();
        return data.isHighRisk || false;
      }
    } catch (error) {
      console.error('Error checking address risk:', error);
    }
    return false;
  }

  /**
   * Validate private key format
   */
  static validatePrivateKey(privateKey: string, blockchain: 'solana' | 'tron'): ValidationResult {
    if (!privateKey) {
      return { valid: false, error: 'Private key is required' };
    }

    if (blockchain === 'solana') {
      // Solana private keys are typically 64 bytes (128 hex chars) or base58
      if (!(/^[a-fA-F0-9]{128}$/.test(privateKey) || /^[1-9A-HJ-NP-Za-km-z]{88}$/.test(privateKey))) {
        return { valid: false, error: 'Invalid Solana private key format' };
      }
    }

    if (blockchain === 'tron') {
      // TRON private keys are 64 hex characters
      if (!/^[a-fA-F0-9]{64}$/.test(privateKey)) {
        return { valid: false, error: 'Invalid TRON private key format' };
      }
    }

    return { valid: true };
  }

  /**
   * Sanitize user input
   */
  static sanitizeInput(input: string): string {
    return input.trim().replace(/[^\w\-./]/g, '');
  }
}

/**
 * Real-time transaction monitor
 */
export class TransactionMonitor {
  private pollInterval: number = 2000; // 2 seconds
  private maxPolls: number = 30; // Maximum 1 minute of polling
  private activePolls: Map<string, NodeJS.Timeout> = new Map();

  /**
   * Monitor transaction until confirmation
   */
  async monitorTransaction(
    txHash: string,
    blockchain: 'solana' | 'tron' | 'ethereum',
    onStatusChange?: (status: string) => void,
    onConfirmed?: (confirmations: number) => void,
    onError?: (error: string) => void
  ): Promise<boolean> {
    return new Promise((resolve) => {
      let pollCount = 0;

      const poll = setInterval(async () => {
        pollCount++;

        try {
          // This would be replaced with actual blockchain queries
          const status = await this.checkTransactionStatus(txHash, blockchain);
          onStatusChange?.(status);

          if (status === 'confirmed' || status === 'finalized') {
            clearInterval(poll);
            this.activePolls.delete(txHash);
            onConfirmed?.(1);
            resolve(true);
          }

          if (status === 'failed') {
            clearInterval(poll);
            this.activePolls.delete(txHash);
            onError?.('Transaction failed');
            resolve(false);
          }

          if (pollCount >= this.maxPolls) {
            clearInterval(poll);
            this.activePolls.delete(txHash);
            onError?.('Transaction confirmation timeout');
            resolve(false);
          }
        } catch (error) {
          if (pollCount >= this.maxPolls) {
            clearInterval(poll);
            this.activePolls.delete(txHash);
            onError?.(error instanceof Error ? error.message : 'Unknown error');
            resolve(false);
          }
        }
      }, this.pollInterval);

      this.activePolls.set(txHash, poll);
    });
  }

  /**
   * Check transaction status
   */
  private async checkTransactionStatus(txHash: string, blockchain: string): Promise<string> {
    // This would be implemented to check actual blockchain status
    // Placeholder implementation
    return 'pending';
  }

  /**
   * Stop monitoring all transactions
   */
  stopAll() {
    for (const poll of this.activePolls.values()) {
      clearInterval(poll);
    }
    this.activePolls.clear();
  }
}

// Export singleton instance
export const transactionMonitor = new TransactionMonitor();
