// Real USDT Transaction Service for Solana & TRON
import { Connection, PublicKey, Transaction, sendAndConfirmTransaction, Keypair } from '@solana/web3.js';
// @ts-ignore
import { getAssociatedTokenAddress, createTransferInstruction, TOKEN_PROGRAM_ID } from '@solana/spl-token';

// Constants
export const USDT_CONFIG = {
  solana: {
    mainnet: 'EPjFWaLb3odccccccccccccccccccccccccccG',
    devnet: 'EhYXq3bffpgB1mCvPxZBU1dm5MnnPtQqaunTs9qKV1F9',
    decimals: 6,
    rpcUrl: 'https://api.mainnet-beta.solana.com',
    devnetUrl: 'https://api.devnet.solana.com',
  },
  tron: {
    mainnet: 'TR7NHqjeKQxGTCi8q282JOKUYJUARIPEY6',
    shasta: 'TG3XXyExBkPp9nzdajQjthH6ykqS3koN21',
    decimals: 6,
    apiUrl: 'https://api.tronstack.io',
    shastaUrl: 'https://api.shasta.trongrid.io',
  },
};

export interface TransactionResult {
  success: boolean;
  txHash?: string;
  txSignature?: string;
  error?: string;
  amount: number;
  from: string;
  to: string;
  token: 'USDT';
  blockchain: 'solana' | 'tron';
  timestamp: string;
  confirmations?: number;
  fee?: number;
  status: 'confirmed' | 'pending' | 'failed';
}

// ============= SOLANA USDT SERVICE =============
export class SolanaUSDTService {
  private connection: Connection;
  private usdtMintAddress: PublicKey;

  constructor(networkType: 'mainnet' | 'devnet' = 'mainnet') {
    const rpcUrl = networkType === 'mainnet' 
      ? USDT_CONFIG.solana.rpcUrl 
      : USDT_CONFIG.solana.devnetUrl;
    
    this.connection = new Connection(rpcUrl, 'confirmed');
    const mintAddress = networkType === 'mainnet'
      ? USDT_CONFIG.solana.mainnet
      : USDT_CONFIG.solana.devnet;
    this.usdtMintAddress = new PublicKey(mintAddress);
  }

  /**
   * Get USDT balance for a wallet
   */
  async getUSDTBalance(walletAddress: string): Promise<number> {
    try {
      const wallet = new PublicKey(walletAddress);
      const ataAddress = await getAssociatedTokenAddress(
        this.usdtMintAddress,
        wallet,
        true
      );

      const balance = await this.connection.getTokenAccountBalance(ataAddress);
      return balance.value.uiAmount || 0;
    } catch (error) {
      console.error('Error fetching USDT balance:', error);
      return 0;
    }
  }

  /**
   * Transfer USDT from one wallet to another
   */
  async transferUSDT(
    fromKeypair: Keypair,
    toWalletAddress: string,
    amount: number,
  ): Promise<TransactionResult> {
    try {
      const fromWallet = fromKeypair.publicKey;
      const toWallet = new PublicKey(toWalletAddress);

      // Get token accounts
      const fromTokenAccount = await getAssociatedTokenAddress(
        this.usdtMintAddress,
        fromWallet,
        true
      );

      const toTokenAccount = await getAssociatedTokenAddress(
        this.usdtMintAddress,
        toWallet,
        true
      );

      // Create transfer instruction
      const transferInstruction = createTransferInstruction(
        fromTokenAccount,
        toTokenAccount,
        fromWallet,
        Math.floor(amount * Math.pow(10, USDT_CONFIG.solana.decimals)),
        [],
        TOKEN_PROGRAM_ID
      );

      // Create transaction
      const transaction = new Transaction().add(transferInstruction);
      
      // Get recent blockhash
      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = fromWallet;

      // Send and confirm transaction
      const signature = await sendAndConfirmTransaction(
        this.connection,
        transaction,
        [fromKeypair],
        { commitment: 'confirmed' }
      );

      // Get transaction details
      const txDetails = await this.connection.getTransaction(signature, {
        commitment: 'confirmed',
      });

      return {
        success: true,
        txSignature: signature,
        amount,
        from: fromWallet.toString(),
        to: toWalletAddress,
        token: 'USDT',
        blockchain: 'solana',
        timestamp: new Date().toISOString(),
        confirmations: 1,
        fee: txDetails?.meta?.fee ? txDetails.meta.fee / 1e9 : 0.00005,
        status: 'confirmed',
      };
    } catch (error) {
      console.error('Error transferring USDT:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        amount,
        from: fromKeypair.publicKey.toString(),
        to: toWalletAddress,
        token: 'USDT',
        blockchain: 'solana',
        timestamp: new Date().toISOString(),
        status: 'failed',
      };
    }
  }

  /**
   * Get current USDT price in USD
   */
  async getUSDTPrice(): Promise<number> {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=usd'
      );
      const data = await response.json();
      return data.tether.usd || 1.0;
    } catch (error) {
      console.error('Error fetching USDT price:', error);
      return 1.0; // Fallback
    }
  }

  /**
   * Check transaction status
   */
  async getTransactionStatus(signature: string): Promise<string> {
    try {
      const status = await this.connection.getSignatureStatus(signature);
      if (status.value?.confirmationStatus === 'confirmed') return 'confirmed';
      if (status.value?.confirmationStatus === 'finalized') return 'finalized';
      if (status.value?.err) return 'failed';
      return 'pending';
    } catch (error) {
      console.error('Error checking transaction status:', error);
      return 'unknown';
    }
  }

  /**
   * Get transaction history
   */
  async getTransactionHistory(walletAddress: string, limit: number = 10) {
    try {
      const wallet = new PublicKey(walletAddress);
      const signatures = await this.connection.getSignaturesForAddress(wallet, { limit });

      const transactions = [];
      for (const sig of signatures) {
        const tx = await this.connection.getTransaction(sig.signature, {
          commitment: 'confirmed',
        });
        if (tx) {
          transactions.push({
            signature: sig.signature,
            blockTime: sig.blockTime,
            fee: tx.meta?.fee,
            status: sig.err ? 'failed' : 'confirmed',
          });
        }
      }
      return transactions;
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      return [];
    }
  }
}

// ============= TRON USDT SERVICE =============
export class TronUSDTService {
  private apiUrl: string;
  private usdtContractAddress: string;

  constructor(networkType: 'mainnet' | 'shasta' = 'mainnet') {
    this.apiUrl = networkType === 'mainnet'
      ? 'https://api.tronstack.io'
      : 'https://api.shasta.trongrid.io';

    this.usdtContractAddress = networkType === 'mainnet'
      ? USDT_CONFIG.tron.mainnet
      : USDT_CONFIG.tron.shasta;
  }

  private getTronWeb() {
    if (typeof window === 'undefined') {
      return null;
    }

    return window.tronWeb ?? null;
  }

  /**
   * Get USDT balance for a TRON wallet
   */
  async getUSDTBalance(walletAddress: string): Promise<number> {
    try {
      const tronWeb = this.getTronWeb();
      if (!tronWeb) {
        return 0;
      }

      const contract = await tronWeb.contract(this.getUSDTABI(), this.usdtContractAddress);
      const balance = await contract.balanceOf(walletAddress).call();
      return balance.toNumber() / Math.pow(10, USDT_CONFIG.tron.decimals);
    } catch (error) {
      console.error('Error fetching TRON USDT balance:', error);
      return 0;
    }
  }

  /**
   * Transfer USDT on TRON
   */
  async transferUSDT(
    fromAddress: string,
    toAddress: string,
    amount: number,
    privateKey: string
  ): Promise<TransactionResult> {
    try {
      const tronWeb = this.getTronWeb();
      if (!tronWeb) {
        throw new Error('TronLink wallet not detected. Please install and connect TronLink.');
      }

      const contract = await tronWeb.contract(this.getUSDTABI(), this.usdtContractAddress);
      
      // Set the sender
      tronWeb.setPrivateKey(privateKey);

      const amountInSmallestUnit = Math.floor(amount * Math.pow(10, USDT_CONFIG.tron.decimals));

      // Create and send transaction
      const tx = await contract
        .transfer(toAddress, amountInSmallestUnit)
        .send({
          feeLimit: 100000000, // 100 TRX
          callValue: 0,
        });

      // Get transaction info
      const txInfo = await tronWeb.trx.getTransaction(tx);

      return {
        success: true,
        txHash: tx,
        amount,
        from: fromAddress,
        to: toAddress,
        token: 'USDT',
        blockchain: 'tron',
        timestamp: new Date().toISOString(),
        fee: txInfo.raw_data.fee ? txInfo.raw_data.fee / 1e6 : 0.1,
        status: 'confirmed',
      };
    } catch (error) {
      console.error('Error transferring TRON USDT:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        amount,
        from: fromAddress,
        to: toAddress,
        token: 'USDT',
        blockchain: 'tron',
        timestamp: new Date().toISOString(),
        status: 'failed',
      };
    }
  }

  /**
   * Get USDT contract ABI (minimal)
   */
  private getUSDTABI() {
    return [
      {
        constant: true,
        inputs: [{ name: '_owner', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: 'balance', type: 'uint256' }],
        type: 'function',
      },
      {
        constant: false,
        inputs: [
          { name: '_to', type: 'address' },
          { name: '_value', type: 'uint256' },
        ],
        name: 'transfer',
        outputs: [{ name: '', type: 'bool' }],
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'decimals',
        outputs: [{ name: '', type: 'uint8' }],
        type: 'function',
      },
    ];
  }

  /**
   * Get USDT price
   */
  async getUSDTPrice(): Promise<number> {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=usd'
      );
      const data = await response.json();
      return data.tether.usd || 1.0;
    } catch (error) {
      console.error('Error fetching USDT price:', error);
      return 1.0;
    }
  }

  /**
   * Get transaction status
   */
  async getTransactionStatus(txHash: string): Promise<string> {
    try {
      const tronWeb = this.getTronWeb();
      if (tronWeb) {
        const txInfo = await tronWeb.trx.getTransaction(txHash);
        if (txInfo.ret && txInfo.ret[0].contractRet === 'Success') {
          return 'confirmed';
        }
        return 'pending';
      }

      const response = await fetch(`${this.apiUrl}/wallet/gettransactionbyid`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: txHash }),
      });
      const txInfo = await response.json();
      if (txInfo.ret && txInfo.ret[0].contractRet === 'Success') {
        return 'confirmed';
      }
      return 'pending';
    } catch (error) {
      console.error('Error checking TRON transaction status:', error);
      return 'unknown';
    }
  }
}

declare global {
  interface Window {
    tronWeb?: {
      contract: (abi?: unknown, address?: string) => Promise<any> | any;
      setPrivateKey: (privateKey: string) => void;
      trx: {
        getTransaction: (hash: string) => Promise<any>;
      };
    };
  }
}

// ============= UNIFIED USDT SERVICE =============
export class UnifiedUSDTService {
  private solanaService: SolanaUSDTService;
  private tronService: TronUSDTService;

  constructor(solanaNetwork: 'mainnet' | 'devnet' = 'mainnet', tronNetwork: 'mainnet' | 'shasta' = 'mainnet') {
    this.solanaService = new SolanaUSDTService(solanaNetwork);
    this.tronService = new TronUSDTService(tronNetwork);
  }

  /**
   * Get USDT balance across blockchains
   */
  async getMultiChainBalance(solanaWallet: string, tronWallet: string) {
    const [solanaBalance, tronBalance] = await Promise.all([
      this.solanaService.getUSDTBalance(solanaWallet),
      this.tronService.getUSDTBalance(tronWallet),
    ]);

    return {
      solana: solanaBalance,
      tron: tronBalance,
      total: solanaBalance + tronBalance,
    };
  }

  /**
   * Get current USDT price
   */
  async getUSDTPrice(): Promise<number> {
    return this.solanaService.getUSDTPrice();
  }

  /**
   * Transfer USDT on Solana
   */
  async transferUSDTSolana(
    fromKeypair: Keypair,
    toAddress: string,
    amount: number
  ): Promise<TransactionResult> {
    return this.solanaService.transferUSDT(fromKeypair, toAddress, amount);
  }

  /**
   * Transfer USDT on TRON
   */
  async transferUSDTTron(
    fromAddress: string,
    toAddress: string,
    amount: number,
    privateKey: string
  ): Promise<TransactionResult> {
    return this.tronService.transferUSDT(fromAddress, toAddress, amount, privateKey);
  }

  /**
   * Get transaction status
   */
  async getTransactionStatus(
    txHash: string,
    blockchain: 'solana' | 'tron'
  ): Promise<string> {
    if (blockchain === 'solana') {
      return this.solanaService.getTransactionStatus(txHash);
    } else {
      return this.tronService.getTransactionStatus(txHash);
    }
  }
}

// Export singleton instances
export const solanaUSDT = new SolanaUSDTService('mainnet');
export const tronUSDT = new TronUSDTService('mainnet');
export const unifiedUSDT = new UnifiedUSDTService('mainnet', 'mainnet');
