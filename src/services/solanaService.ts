import {
  Connection,
  PublicKey,
  type ConfirmedSignatureInfo,
  type ParsedTransactionWithMeta,
} from '@solana/web3.js';

const SOLANA_NETWORK = 'https://api.mainnet-beta.solana.com';
const USDT_MINT = 'EPjFWaLb3hqAgqYf4Xfeff7g2gg6zNzrKcxzbnYaAmm'; // USDT on Solana

export class SolanaService {
  private connection: Connection;

  constructor() {
    this.connection = new Connection(SOLANA_NETWORK, 'confirmed');
  }

  /**
   * Get wallet balance in SOL
   */
  async getBalance(publicKey: PublicKey): Promise<number> {
    try {
      const balance = await this.connection.getBalance(publicKey);
      return balance / 1e9; // Convert lamports to SOL
    } catch (error) {
      console.error('Error getting balance:', error);
      throw error;
    }
  }

  /**
   * Get USDT token balance
   */
  async getUSDTBalance(publicKey: PublicKey): Promise<number> {
    try {
      // Get associated token account for USDT
      const accounts = await this.connection.getParsedTokenAccountsByOwner(publicKey, {
        mint: new PublicKey(USDT_MINT),
      });

      if (accounts.value.length === 0) return 0;
      
      const balance = accounts.value[0].account.data.parsed.info.tokenAmount.uiAmount;
      return balance || 0;
    } catch (error) {
      console.error('Error getting USDT balance:', error);
      return 0;
    }
  }

  /**
   * Get any token balance
   */
  async getTokenBalance(publicKey: PublicKey, tokenMint: string): Promise<number> {
    try {
      const accounts = await this.connection.getParsedTokenAccountsByOwner(publicKey, {
        mint: new PublicKey(tokenMint),
      });

      if (accounts.value.length === 0) return 0;
      return accounts.value[0].account.data.parsed.info.tokenAmount.uiAmount || 0;
    } catch (error) {
      console.error('Error getting token balance:', error);
      return 0;
    }
  }

  /**
   * Get transaction history
   */
  async getTransactionHistory(publicKey: PublicKey, limit: number = 10): Promise<ParsedTransactionWithMeta[]> {
    try {
      const signatures = await this.connection.getSignaturesForAddress(publicKey, {
        limit,
      });

      const transactions = await Promise.all(
        signatures.map((sig: ConfirmedSignatureInfo) =>
          this.connection.getParsedTransaction(sig.signature, {
            maxSupportedTransactionVersion: 0,
          })
        )
      );

      return transactions.filter(
        (tx): tx is ParsedTransactionWithMeta => tx !== null
      );
    } catch (error) {
      console.error('Error getting transaction history:', error);
      return [];
    }
  }

  /**
   * Check USDT price in USD
   */
  async getUSDTPrice(): Promise<number> {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=usd'
      );
      const data = await response.json();
      return data.tether?.usd || 1;
    } catch (error) {
      console.error('Error getting USDT price:', error);
      return 1;
    }
  }

  /**
   * Get SOL price in USD
   */
  async getSOLPrice(): Promise<number> {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd'
      );
      const data = await response.json();
      return data.solana?.usd || 140;
    } catch (error) {
      console.error('Error getting SOL price:', error);
      return 140;
    }
  }

  /**
   * Swap tokens via Jupiter (requires backend)
   */
  async swapTokens(
    inputMint: string,
    outputMint: string,
    amount: number,
    slippage: number = 1
  ): Promise<any> {
    try {
      const response = await fetch('https://quote-api.jup.ag/v6/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputMint,
          outputMint,
          amount: amount * 1e6,
          slippageBps: slippage * 100,
        }),
      });

      if (!response.ok) throw new Error('Swap quote failed');
      return await response.json();
    } catch (error) {
      console.error('Error getting swap quote:', error);
      throw error;
    }
  }
}

export const solanaService = new SolanaService();
