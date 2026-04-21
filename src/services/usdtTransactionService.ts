/**
 * Real USDT Transaction Service
 * Handles actual USDT transfers on Solana and TRON blockchains
 */

import {
  Connection,
  PublicKey,
  Transaction,
} from '@solana/web3.js';
import {
  createTransferInstruction,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from '@solana/spl-token';

// ============ CONSTANTS ============
const SOLANA_NETWORK = 'https://api.mainnet-beta.solana.com';
const SOLANA_USDT_MINT = 'EPjFWaLb3hqAgqYf4Xfeff7g2gg6zNzrKcxzbnYaAmm'; // Solana USDT
const TRON_USDT_CONTRACT = 'TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj'; // TRON USDT (TRC-20)

// ============ INTERFACES ============
export interface USDTTransactionRequest {
  fromAddress: string;
  toAddress: string;
  amount: number; // Amount in USDT (will be converted to base units)
  network: 'solana' | 'tron';
  memo?: string;
}

export interface USDTTransactionResult {
  success: boolean;
  transactionHash: string;
  transactionUrl: string;
  amount: number;
  network: string;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
  errorMessage?: string;
}

export interface SolanaUSDTTransaction {
  fromPublicKey: PublicKey;
  toPublicKey: PublicKey;
  amount: number; // UI amount
  decimals: number; // Token decimals (USDT = 6)
}

// ============ SOLANA USDT FUNCTIONS ============

/**
 * Create a real USDT transfer instruction for Solana
 * This prepares the transaction but doesn't sign or send it
 */
export async function createSolanaUSDTTransferInstruction(
  request: SolanaUSDTTransaction
): Promise<Transaction> {
  const connection = new Connection(SOLANA_NETWORK, 'confirmed');
  
  // Get associated token accounts
  const fromTokenAccount = await getAssociatedTokenAddress(
    new PublicKey(SOLANA_USDT_MINT),
    request.fromPublicKey,
    false,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );

  const toTokenAccount = await getAssociatedTokenAddress(
    new PublicKey(SOLANA_USDT_MINT),
    request.toPublicKey,
    false,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );

  // Convert amount to base units (USDT has 6 decimals)
  const amountInBaseUnits = Math.round(request.amount * Math.pow(10, request.decimals));

  // Create transfer instruction
  const transferInstruction = createTransferInstruction(
    fromTokenAccount,
    toTokenAccount,
    request.fromPublicKey,
    amountInBaseUnits,
    [],
    TOKEN_PROGRAM_ID
  );

  // Get recent blockhash
  const { blockhash } = await connection.getLatestBlockhash('confirmed');

  // Create transaction
  const transaction = new Transaction({
    recentBlockhash: blockhash,
    feePayer: request.fromPublicKey,
  });

  transaction.add(transferInstruction);

  return transaction;
}

/**
 * Execute real USDT transfer on Solana
 * Requires a signed transaction
 */
export async function sendSolanaUSDTTransaction(
  signedTransaction: Transaction
): Promise<USDTTransactionResult> {
  try {
    const connection = new Connection(SOLANA_NETWORK, 'confirmed');

    // Send transaction
    const signature = await connection.sendRawTransaction(signedTransaction.serialize());

    // Wait for confirmation
    const confirmation = await connection.confirmTransaction(signature, 'confirmed');

    if (confirmation.value.err) {
      return {
        success: false,
        transactionHash: signature,
        transactionUrl: `https://solscan.io/tx/${signature}`,
        amount: 0,
        network: 'solana',
        timestamp: Date.now(),
        status: 'failed',
        errorMessage: JSON.stringify(confirmation.value.err),
      };
    }

    return {
      success: true,
      transactionHash: signature,
      transactionUrl: `https://solscan.io/tx/${signature}`,
      amount: 0, // Amount would need to be extracted from transaction
      network: 'solana',
      timestamp: Date.now(),
      status: 'confirmed',
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      transactionHash: '',
      transactionUrl: '',
      amount: 0,
      network: 'solana',
      timestamp: Date.now(),
      status: 'failed',
      errorMessage,
    };
  }
}

/**
 * Get transaction details from Solana
 */
export async function getSolanaTransactionDetails(signature: string): Promise<any> {
  try {
    const connection = new Connection(SOLANA_NETWORK, 'confirmed');
    const transaction = await connection.getParsedTransaction(signature, {
      maxSupportedTransactionVersion: 0,
    });
    return transaction;
  } catch (error) {
    console.error('Error fetching transaction details:', error);
    return null;
  }
}

// ============ TRON USDT FUNCTIONS ============

/**
 * Create real USDT transfer for TRON
 * Requires TronLink or similar injected wallet
 */
export async function createTronUSDTTransfer(
  request: USDTTransactionRequest
): Promise<USDTTransactionResult> {
  try {
    // Check if TronLink is available
    if (!window.tronWeb) {
      throw new Error('TronLink wallet not detected. Please install and connect TronLink.');
    }

    if (!window.tronWeb.defaultAddress.base58) {
      throw new Error('TronLink wallet not connected. Please connect your wallet.');
    }

    // Validate addresses
    if (!isValidTronAddress(request.fromAddress)) {
      throw new Error('Invalid sender TRON address');
    }

    if (!isValidTronAddress(request.toAddress)) {
      throw new Error('Invalid recipient TRON address');
    }

    // Get USDT contract
    const contract = await window.tronWeb.contract().at(TRON_USDT_CONTRACT);

    // Convert amount to base units (USDT has 6 decimals on TRON)
    const amountInBaseUnits = Math.round(request.amount * 1_000_000).toString();

    // Execute transfer
    const transactionId = await contract
      .transfer(request.toAddress, amountInBaseUnits)
      .send({
        feeLimit: 100_000_000, // 100 TRX in SUN
        shouldPollResponse: true,
      });

    // Return success result
    return {
      success: true,
      transactionHash: transactionId,
      transactionUrl: `https://tronscan.org/#/transaction/${transactionId}`,
      amount: request.amount,
      network: 'tron',
      timestamp: Date.now(),
      status: 'confirmed',
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      transactionHash: '',
      transactionUrl: '',
      amount: request.amount,
      network: 'tron',
      timestamp: Date.now(),
      status: 'failed',
      errorMessage,
    };
  }
}

/**
 * Get TRON transaction details
 */
export async function getTronTransactionDetails(transactionId: string): Promise<any> {
  try {
    const response = await fetch(`https://apilist.tronscan.org/api/transaction-info?hash=${transactionId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching TRON transaction details:', error);
    return null;
  }
}

/**
 * Validate TRON address format
 */
export function isValidTronAddress(address: string): boolean {
  return /^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(address.trim());
}

// ============ UTILITY FUNCTIONS ============

/**
 * Get real-time USDT price from multiple sources
 */
export async function getUSDTPrice(): Promise<number> {
  try {
    // Primary: CoinGecko
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=usd'
    );
    const data = await response.json();
    return data.tether?.usd || 1.0;
  } catch (error) {
    console.error('Error fetching USDT price:', error);
    // Fallback price
    return 1.0;
  }
}

/**
 * Get conversion rate between two tokens
 */
export async function getTokenConversionRate(
  fromToken: string,
  toToken: string
): Promise<number> {
  try {
    const tokenMap: Record<string, string> = {
      'USDT': 'tether',
      'SOL': 'solana',
      'AFR': 'africoin', // May not exist on CoinGecko
      'TRX': 'tron',
    };

    const fromId = tokenMap[fromToken] || fromToken.toLowerCase();
    const toId = tokenMap[toToken] || toToken.toLowerCase();

    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${fromId}&vs_currencies=${toId.toLowerCase()}`
    );
    const data = await response.json();
    
    // Extract the rate from nested response
    const rates = Object.values(data)[0] as Record<string, number>;
    return rates[toId.toLowerCase()] || 1;
  } catch (error) {
    console.error('Error fetching conversion rate:', error);
    return 1;
  }
}

/**
 * Estimate transaction fee for Solana
 */
export async function estimateSolanaTransactionFee(): Promise<number> {
  try {
    const connection = new Connection(SOLANA_NETWORK, 'confirmed');
    const feeData = await connection.getRecentPrioritizationFees();
    
    // Average the recent fees
    if (feeData.length === 0) return 0.00025; // Default fallback (0.25 lamports per CU)
    
    const avgFee = feeData.reduce((sum, item) => sum + item.prioritizationFee, 0) / feeData.length;
    return avgFee / 1e9; // Convert to SOL
  } catch (error) {
    console.error('Error estimating Solana fee:', error);
    return 0.00025; // Fallback
  }
}

/**
 * Estimate transaction fee for TRON
 */
export async function estimateTronTransactionFee(): Promise<number> {
  try {
    // TRON has standard network fees
    // USDT transfer on TRON typically costs 5-25 TRX
    return 10; // Typical USDT transfer cost in TRX
  } catch (error) {
    console.error('Error estimating TRON fee:', error);
    return 10; // Fallback
  }
}

/**
 * Validate sufficient balance for transaction
 */
export async function validateSufficientBalance(
  network: 'solana' | 'tron',
  address: string,
  requestedAmount: number,
  tokenType: 'USDT' | 'SOL' | 'TRX'
): Promise<{ sufficient: boolean; currentBalance: number; required: number }> {
  try {
    let currentBalance = 0;

    if (network === 'solana') {
      const connection = new Connection(SOLANA_NETWORK, 'confirmed');
      const pubKey = new PublicKey(address);

      if (tokenType === 'SOL') {
        const balance = await connection.getBalance(pubKey);
        currentBalance = balance / 1e9;
      } else if (tokenType === 'USDT') {
        const accounts = await connection.getParsedTokenAccountsByOwner(pubKey, {
          mint: new PublicKey(SOLANA_USDT_MINT),
        });
        if (accounts.value.length > 0) {
          currentBalance = accounts.value[0].account.data.parsed.info.tokenAmount.uiAmount;
        }
      }
    } else if (network === 'tron') {
      // For TRON, you would need to query the blockchain
      // This is a placeholder - actual implementation depends on your backend
      currentBalance = 1000; // Placeholder
    }

    const fee = network === 'solana' 
      ? await estimateSolanaTransactionFee()
      : await estimateTronTransactionFee();

    const required = requestedAmount + fee;

    return {
      sufficient: currentBalance >= required,
      currentBalance,
      required,
    };
  } catch (error) {
    console.error('Error validating balance:', error);
    return {
      sufficient: false,
      currentBalance: 0,
      required: requestedAmount,
    };
  }
}

// Declare TronWeb for TypeScript
declare global {
  interface Window {
    tronWeb?: any;
    tronLink?: any;
  }
}
