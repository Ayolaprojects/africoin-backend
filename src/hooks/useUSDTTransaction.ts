import { useState, useCallback } from 'react';
import { unifiedUSDT, TransactionResult } from '../services/usdtService';

interface UseUSDTTransactionOptions {
  onSuccess?: (result: TransactionResult) => void;
  onError?: (error: string) => void;
}

export function useUSDTTransaction(options: UseUSDTTransactionOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastTransaction, setLastTransaction] = useState<TransactionResult | null>(null);

  const sendUSDT = useCallback(
    async (
      fromAddress: string,
      toAddress: string,
      amount: number,
      blockchain: 'solana' | 'tron',
      credentials?: any
    ) => {
      setIsLoading(true);
      setError(null);

      try {
        let result: TransactionResult;

        if (blockchain === 'solana' && credentials?.keypair) {
          result = await unifiedUSDT.transferUSDTSolana(
            credentials.keypair,
            toAddress,
            amount
          );
        } else if (blockchain === 'tron' && credentials?.privateKey) {
          result = await unifiedUSDT.transferUSDTTron(
            fromAddress,
            toAddress,
            amount,
            credentials.privateKey
          );
        } else {
          throw new Error('Invalid credentials for transaction');
        }

        if (result.success) {
          setLastTransaction(result);
          options.onSuccess?.(result);
        } else {
          setError(result.error || 'Transaction failed');
          options.onError?.(result.error || 'Transaction failed');
        }

        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        options.onError?.(errorMessage);
        return {
          success: false,
          error: errorMessage,
          amount,
          from: fromAddress,
          to: toAddress,
          token: 'USDT',
          blockchain,
          timestamp: new Date().toISOString(),
          status: 'failed',
        } as TransactionResult;
      } finally {
        setIsLoading(false);
      }
    },
    [options]
  );

  const getBalance = useCallback(
    async (solanaWallet: string, tronWallet: string) => {
      try {
        return await unifiedUSDT.getMultiChainBalance(solanaWallet, tronWallet);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch balance';
        setError(errorMessage);
        return null;
      }
    },
    []
  );

  const getPrice = useCallback(async () => {
    try {
      return await unifiedUSDT.getUSDTPrice();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch price';
      setError(errorMessage);
      return 1.0;
    }
  }, []);

  const checkStatus = useCallback(
    async (txHash: string, blockchain: 'solana' | 'tron') => {
      try {
        return await unifiedUSDT.getTransactionStatus(txHash, blockchain);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to check status';
        setError(errorMessage);
        return 'unknown';
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    sendUSDT,
    getBalance,
    getPrice,
    checkStatus,
    isLoading,
    error,
    lastTransaction,
    clearError,
  };
}
