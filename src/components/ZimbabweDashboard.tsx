import React, { useState, useEffect } from 'react';
import { zimbabweService } from '../services/zimbabweService';
import '../styles/ZimbabweDashboard.css';

interface ExchangeRate {
  currency: string;
  zwlRate: number;
  usdRate: number;
  timestamp: string;
}

interface ZimbabweTransaction {
  reference: string;
  method: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  date: string;
}

const ZimbabweDashboard: React.FC = () => {
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate | null>(null);
  const [transactions, setTransactions] = useState<ZimbabweTransaction[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'transactions' | 'methods'>('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load exchange rates
      const rates = await zimbabweService.getExchangeRates();
      setExchangeRates(rates);

      // Load transactions
      const txs = await zimbabweService.getZimbabweTransactionHistory('current-user', 10);
      setTransactions(
        txs.map((tx: any) => ({
          reference: tx.reference,
          method: tx.method || tx.transactionType,
          amount: tx.amount,
          status: tx.status,
          date: tx.timestamp,
        }))
      );

      // Load balance
      const bal = await zimbabweService.getZWLBalance('current-user');
      setBalance(bal);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPaymentMethodIcon = (method: string): string => {
    const icons: Record<string, string> = {
      ecocash: '💚',
      ecocash_airtime: '📱',
      payzone: '🏪',
      kwese_remit: '📡',
      bank_transfer: '🏦',
      mobile_money: '📱',
    };
    return icons[method] || '💳';
  };

  const getStatusColor = (status: string): string => {
    return status === 'completed' ? 'completed' : status === 'pending' ? 'pending' : 'failed';
  };

  return (
    <div className="zimbabwe-dashboard">
      <div className="dashboard-header">
        <h1>🇿🇼 Zimbabwe Financial Dashboard</h1>
        <p>Manage your African Coin transactions in Zimbabwe</p>
      </div>

      {/* Exchange Rate Card */}
      <div className="exchange-rate-card">
        <h3>💱 Current Exchange Rates</h3>
        {exchangeRates ? (
          <div className="rates-grid">
            <div className="rate-item">
              <span className="rate-label">ZWL Rate</span>
              <span className="rate-value">1 ZWL</span>
            </div>
            <div className="rate-item">
              <span className="rate-label">USD Equivalent</span>
              <span className="rate-value">${(1 / exchangeRates.usdRate).toFixed(4)}</span>
            </div>
            <div className="rate-item">
              <span className="rate-label">Last Updated</span>
              <span className="rate-value">{new Date(exchangeRates.timestamp).toLocaleTimeString()}</span>
            </div>
          </div>
        ) : (
          <p>Loading exchange rates...</p>
        )}
      </div>

      {/* Tabs */}
      <div className="dashboard-tabs">
        <button
          className={`tab ${selectedTab === 'overview' ? 'active' : ''}`}
          onClick={() => setSelectedTab('overview')}
        >
          📊 Overview
        </button>
        <button
          className={`tab ${selectedTab === 'transactions' ? 'active' : ''}`}
          onClick={() => setSelectedTab('transactions')}
        >
          📜 Transactions
        </button>
        <button
          className={`tab ${selectedTab === 'methods' ? 'active' : ''}`}
          onClick={() => setSelectedTab('methods')}
        >
          💳 Payment Methods
        </button>
      </div>

      {/* Overview Tab */}
      {selectedTab === 'overview' && (
        <div className="tab-content overview">
          <div className="balance-card">
            <h3>Your ZWL Balance</h3>
            <div className="balance-amount">
              {loading ? '...' : `ZWL ${balance.toLocaleString('en-ZW', { maximumFractionDigits: 2 })}`}
            </div>
          </div>

          <div className="quick-actions">
            <h3>Quick Actions</h3>
            <div className="actions-grid">
              <button className="action-btn">
                <span className="icon">💚</span>
                <span className="label">Send EcoCash</span>
              </button>
              <button className="action-btn">
                <span className="icon">🏪</span>
                <span className="label">PayZone Transfer</span>
              </button>
              <button className="action-btn">
                <span className="icon">📡</span>
                <span className="label">Kwese Remit</span>
              </button>
              <button className="action-btn">
                <span className="icon">📱</span>
                <span className="label">Buy Airtime</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transactions Tab */}
      {selectedTab === 'transactions' && (
        <div className="tab-content transactions">
          <h3>Recent Transactions</h3>
          {loading ? (
            <p>Loading transactions...</p>
          ) : transactions.length > 0 ? (
            <div className="transactions-list">
              {transactions.map((tx) => (
                <div key={tx.reference} className="transaction-item">
                  <div className="tx-info">
                    <span className="tx-icon">{getPaymentMethodIcon(tx.method)}</span>
                    <div className="tx-details">
                      <p className="tx-method">{tx.method}</p>
                      <p className="tx-date">{new Date(tx.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="tx-amount-status">
                    <p className="tx-amount">ZWL {tx.amount.toLocaleString()}</p>
                    <span className={`tx-status ${getStatusColor(tx.status)}`}>{tx.status}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No transactions yet</p>
          )}
        </div>
      )}

      {/* Payment Methods Tab */}
      {selectedTab === 'methods' && (
        <div className="tab-content methods">
          <h3>Available Payment Methods</h3>
          <div className="methods-grid">
            <div className="method-card">
              <div className="method-icon">💚</div>
              <h4>EcoCash</h4>
              <p>Send money instantly to any EcoCash number</p>
              <button className="method-btn">Use EcoCash</button>
            </div>

            <div className="method-card">
              <div className="method-icon">📱</div>
              <h4>EcoCash Airtime</h4>
              <p>Buy airtime for any mobile provider</p>
              <button className="method-btn">Buy Airtime</button>
            </div>

            <div className="method-card">
              <div className="method-icon">🏪</div>
              <h4>PayZone</h4>
              <p>Withdraw cash at nearby PayZone agents</p>
              <button className="method-btn">Find Agent</button>
            </div>

            <div className="method-card">
              <div className="method-icon">📡</div>
              <h4>Kwese Remit</h4>
              <p>Send remittances to Zimbabwe</p>
              <button className="method-btn">Send Remittance</button>
            </div>

            <div className="method-card">
              <div className="method-icon">🏦</div>
              <h4>Bank Transfer</h4>
              <p>Transfer to any Zimbabwean bank account</p>
              <button className="method-btn">Bank Transfer</button>
            </div>

            <div className="method-card">
              <div className="method-icon">💳</div>
              <h4>Mobile Money</h4>
              <p>Use multiple mobile money providers</p>
              <button className="method-btn">View Providers</button>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Section */}
      <div className="statistics-section">
        <h3>📈 Your Statistics</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">Total Transactions</span>
            <span className="stat-value">{transactions.length}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Total Volume</span>
            <span className="stat-value">
              ZWL {transactions.reduce((sum, tx) => sum + tx.amount, 0).toLocaleString()}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Average Transaction</span>
            <span className="stat-value">
              ZWL{' '}
              {transactions.length > 0
                ? (transactions.reduce((sum, tx) => sum + tx.amount, 0) / transactions.length).toLocaleString('en-ZW', { maximumFractionDigits: 0 })
                : 0}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Success Rate</span>
            <span className="stat-value">
              {transactions.length > 0
                ? `${Math.round((transactions.filter((tx) => tx.status === 'completed').length / transactions.length) * 100)}%`
                : '0%'}
            </span>
          </div>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="refresh-section">
        <button className="refresh-btn" onClick={loadDashboardData} disabled={loading}>
          {loading ? '⏳ Refreshing...' : '🔄 Refresh Data'}
        </button>
      </div>
    </div>
  );
};

export default ZimbabweDashboard;
