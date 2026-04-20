import { useCallback } from 'react';
import { storageService } from '../services/storageService';

export const useStorage = (wallet?: string) => {
  const currentWallet = wallet || '';

  const saveTransaction = useCallback((transaction: any) => {
    if (currentWallet) {
      storageService.addTransaction(currentWallet, transaction);
    }
  }, [currentWallet]);

  const getTransactions = useCallback(() => {
    if (currentWallet) {
      return storageService.getTransactions(currentWallet);
    }
    return [];
  }, [currentWallet]);

  const saveSettings = useCallback((settings: any) => {
    if (currentWallet) {
      storageService.saveSettings(currentWallet, settings);
    }
  }, [currentWallet]);

  const getSettings = useCallback(() => {
    if (currentWallet) {
      return storageService.getSettings(currentWallet);
    }
    return {};
  }, [currentWallet]);

  return {
    saveTransaction,
    getTransactions,
    saveSettings,
    getSettings,
  };
};
