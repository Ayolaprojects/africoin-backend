import axios from 'axios';

export interface BalanceSnapshot {
  timestamp: string;
  walletId: string;
  balance: number;
  currency: string;
  usdValue: number;
}

export interface BalanceHistory {
  walletId: string;
  currency: string;
  snapshots: BalanceSnapshot[];
  currentBalance: number;
  highestBalance: number;
  lowestBalance: number;
  averageBalance: number;
}

export interface BalanceAlert {
  id: string;
  type: 'low_balance' | 'high_balance' | 'rapid_change' | 'suspicious_activity';
  walletId: string;
  message: string;
  threshold?: number;
  enabled: boolean;
  createdAt: string;
}

export interface PortfolioSnapshot {
  timestamp: string;
  totalBalance: number;
  totalUSDValue: number;
  wallets: {
    walletId: string;
    currency: string;
    balance: number;
    usdValue: number;
    percentage: number;
  }[];
  dayChange: number;
  dayChangePercent: number;
  monthChange: number;
  monthChangePercent: number;
}

export class BalanceService {
  private apiUrl = import.meta.env.VITE_PAYMENT_API_URL || 'http://localhost:3001';

  /**
   * Get current balance for a wallet
   */
  async getBalance(walletId: string): Promise<BalanceSnapshot> {
    try {
      const response = await axios.get(
        `${this.apiUrl}/api/balance/${walletId}/current`
      );

      return response.data;
    } catch (error) {
      console.error('Get balance error:', error);
      throw new Error('Failed to fetch balance');
    }
  }

  /**
   * Get balance history for a wallet over time
   */
  async getBalanceHistory(
    walletId: string,
    days: number = 30
  ): Promise<BalanceHistory> {
    try {
      const response = await axios.get(
        `${this.apiUrl}/api/balance/${walletId}/history?days=${days}`
      );

      return response.data;
    } catch (error) {
      console.error('Balance history error:', error);
      throw new Error('Failed to fetch balance history');
    }
  }

  /**
   * Get all balances for a user (portfolio)
   */
  async getPortfolioBalance(userId: string): Promise<PortfolioSnapshot> {
    try {
      const response = await axios.get(
        `${this.apiUrl}/api/balance/portfolio/${userId}/current`
      );

      return response.data;
    } catch (error) {
      console.error('Portfolio balance error:', error);
      throw new Error('Failed to fetch portfolio balance');
    }
  }

  /**
   * Get portfolio history
   */
  async getPortfolioHistory(
    userId: string,
    days: number = 30
  ): Promise<PortfolioSnapshot[]> {
    try {
      const response = await axios.get(
        `${this.apiUrl}/api/balance/portfolio/${userId}/history?days=${days}`
      );

      return response.data;
    } catch (error) {
      console.error('Portfolio history error:', error);
      return [];
    }
  }

  /**
   * Set balance alert threshold
   */
  async setBalanceAlert(
    walletId: string,
    type: 'low_balance' | 'high_balance' | 'rapid_change',
    threshold: number
  ): Promise<BalanceAlert> {
    try {
      const response = await axios.post(
        `${this.apiUrl}/api/balance/alerts`,
        { walletId, type, threshold }
      );

      return response.data;
    } catch (error) {
      console.error('Set alert error:', error);
      throw new Error('Failed to set balance alert');
    }
  }

  /**
   * Get balance alerts
   */
  async getBalanceAlerts(walletId: string): Promise<BalanceAlert[]> {
    try {
      const response = await axios.get(
        `${this.apiUrl}/api/balance/alerts/${walletId}`
      );

      return response.data;
    } catch (error) {
      console.error('Get alerts error:', error);
      return [];
    }
  }

  /**
   * Update alert status
   */
  async updateAlert(
    alertId: string,
    enabled: boolean
  ): Promise<BalanceAlert> {
    try {
      const response = await axios.put(
        `${this.apiUrl}/api/balance/alerts/${alertId}`,
        { enabled }
      );

      return response.data;
    } catch (error) {
      console.error('Update alert error:', error);
      throw new Error('Failed to update alert');
    }
  }

  /**
   * Record balance snapshot (called periodically by backend)
   */
  async recordSnapshot(snapshot: BalanceSnapshot): Promise<void> {
    try {
      await axios.post(
        `${this.apiUrl}/api/balance/snapshot`,
        snapshot
      );
    } catch (error) {
      console.error('Record snapshot error:', error);
    }
  }

  /**
   * Get balance statistics
   */
  async getBalanceStats(walletId: string, days: number = 30): Promise<{
    current: number;
    highest: number;
    lowest: number;
    average: number;
    change: number;
    changePercent: number;
    transactionCount: number;
    inboundTotal: number;
    outboundTotal: number;
  }> {
    try {
      const response = await axios.get(
        `${this.apiUrl}/api/balance/${walletId}/stats?days=${days}`
      );

      return response.data;
    } catch (error) {
      console.error('Balance stats error:', error);
      throw new Error('Failed to fetch balance statistics');
    }
  }

  /**
   * Export balance history as CSV
   */
  exportBalanceHistoryAsCSV(history: BalanceHistory): string {
    let csv = 'Balance History - ' + history.currency + '\n';
    csv += 'Date,Balance,USD Value\n';

    history.snapshots.forEach(snapshot => {
      csv += `${snapshot.timestamp},${snapshot.balance},${snapshot.usdValue}\n`;
    });

    return csv;
  }

  /**
   * Download balance history
   */
  downloadBalanceHistory(history: BalanceHistory): void {
    const csv = this.exportBalanceHistoryAsCSV(history);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `balance-history-${history.currency}.csv`);
    link.click();
    URL.revokeObjectURL(link.href);
  }

  /**
   * Calculate balance trend
   */
  calculateTrend(snapshots: BalanceSnapshot[]): 'up' | 'down' | 'neutral' {
    if (snapshots.length < 2) return 'neutral';
    
    const latest = snapshots[snapshots.length - 1].balance;
    const previous = snapshots[0].balance;
    
    if (latest > previous) return 'up';
    if (latest < previous) return 'down';
    return 'neutral';
  }

  /**
   * Calculate volatility
   */
  calculateVolatility(snapshots: BalanceSnapshot[]): number {
    if (snapshots.length < 2) return 0;

    const balances = snapshots.map(s => s.balance);
    const mean = balances.reduce((a, b) => a + b, 0) / balances.length;
    const variance = balances.reduce((sum, balance) => {
      return sum + Math.pow(balance - mean, 2);
    }, 0) / balances.length;

    return Math.sqrt(variance);
  }
}

export const balanceService = new BalanceService();
