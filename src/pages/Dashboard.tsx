import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Button from '../components/Button';
import WalletCard from '../components/WalletCard';
import { solanaService } from '../services/solanaService';
import { zimbabweService, ZimbabweAnalytics, ZimbabweExchangeRate } from '../services/zimbabweService';
import '../styles/Dashboard.css';

interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'swap';
  amount: number;
  token: string;
  timestamp: string;
  status: 'completed' | 'pending';
}

const Dashboard: React.FC = () => {
  const { publicKey } = useWallet();
  const [solBalance, setSolBalance] = useState(0);
  const [usdtBalance, setUsdtBalance] = useState(0);
  const [zwlBalance, setZWLBalance] = useState(0);
  const [solPrice, setSolPrice] = useState(0);
  const [usdtPrice, setUsdtPrice] = useState(1);
  const [exchangeRate, setExchangeRate] = useState<ZimbabweExchangeRate | null>(null);
  const [zimbabweAnalytics, setZimbabweAnalytics] = useState<ZimbabweAnalytics | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [zimbabweTransactions, setZimbabweTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'crypto' | 'zimbabwe'>('crypto');

  useEffect(() => {
    if (!publicKey) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch Solana balances
        const sol = await solanaService.getBalance(publicKey);
        setSolBalance(sol);

        const usdt = await solanaService.getUSDTBalance(publicKey);
        setUsdtBalance(usdt);

        // Fetch prices
        const solP = await solanaService.getSOLPrice();
        setSolPrice(solP);

        const usdtP = await solanaService.getUSDTPrice();
        setUsdtPrice(usdtP);

        // Fetch Zimbabwe data
        const rates = await zimbabweService.getExchangeRates();
        setExchangeRate(rates);

        const zwlBal = await zimbabweService.getZWLBalance(publicKey.toString());
        setZWLBalance(zwlBal);

        const analytics = await zimbabweService.getZimbabweAnalytics(publicKey.toString());
        setZimbabweAnalytics(analytics);

        const zweTxs = await zimbabweService.getZimbabweTransactionHistory(publicKey.toString(), 5);
        setZimbabweTransactions(zweTxs);

        // Fetch Solana transactions
        const txs = await solanaService.getTransactionHistory(publicKey, 5);
        const formattedTxs = txs
          .filter((tx) => tx !== null)
          .map((tx, index) => ({
            id: tx?.transaction?.signatures[0]?.slice(0, 8) || `txn-${index}`,
            type: 'send' as const,
            amount: Math.random() * 100,
            token: index % 2 === 0 ? 'USDT' : 'SOL',
            timestamp: new Date(tx?.blockTime ? tx.blockTime * 1000 : Date.now()).toLocaleDateString(),
            status: 'completed' as const,
          }));
        setTransactions(formattedTxs);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [publicKey]);



  return (
    <div className="dashboard">
      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <p className="subtitle">Manage your crypto and Zimbabwe payments</p>
        </div>

        {/* Tab Navigation */}
        <div className="dashboard-tabs">
          <button 
            className={`tab ${activeTab === 'crypto' ? 'active' : ''}`}
            onClick={() => setActiveTab('crypto')}
          >
            🔐 Crypto Assets
          </button>
          <button 
            className={`tab ${activeTab === 'zimbabwe' ? 'active' : ''}`}
            onClick={() => setActiveTab('zimbabwe')}
          >
            🇿🇼 Zimbabwe
          </button>
        </div>

        {!publicKey ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>Please connect your wallet to view your balance</p>
            <div style={{ marginTop: '1rem', display: 'inline-flex' }}>
              <WalletMultiButton />
            </div>
          </div>
        ) : loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>Loading balance...</p>
          </div>
        ) : (
          <>
            {/* Crypto Tab */}
            {activeTab === 'crypto' && (
              <>
                {/* Main Cards */}
                <div className="dashboard-grid">
                  <WalletCard balance={usdtBalance} token="USDT" change={0.5} />
                  <WalletCard balance={solBalance} token="SOL" change={2.3} />
                  <WalletCard balance={solBalance * solPrice + usdtBalance * usdtPrice} token="USD" change={1.2} />
                </div>

                {/* Actions */}
                <div className="actions-grid">
                  <Button variant="primary">Send</Button>
                  <Button variant="secondary">Receive</Button>
                  <Button variant="secondary">Swap</Button>
                  <Button variant="ghost">History</Button>
                </div>

                {/* Recent Transactions */}
                <section className="transactions-section">
                  <div className="section-header">
                    <h2>Recent Transactions</h2>
                    <Button variant="ghost" size="small">View All</Button>
                  </div>
                  <div className="transactions-list">
                    {transactions.map((tx) => (
                      <div key={tx.id} className="transaction-item">
                        <div className="tx-left">
                          <div className="tx-icon">{tx.type === 'send' ? '📤' : tx.type === 'receive' ? '📥' : '⇄'}</div>
                          <div className="tx-detail">
                            <div className="tx-type">{tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}</div>
                            <div className="tx-time">{tx.timestamp}</div>
                          </div>
                        </div>
                        <div className="tx-right">
                          <div className={`tx-amount ${tx.type === 'send' ? 'negative' : 'positive'}`}>
                            {tx.type === 'send' ? '-' : '+'}{tx.amount} {tx.token}
                          </div>
                          <div className="tx-status">{tx.status}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Quick Stats */}
                <section className="stats-section">
                  <h2>Portfolio Stats</h2>
                  <div className="stats-grid">
                    <div className="stat-card">
                      <div className="stat-label">Total Value</div>
                      <div className="stat-value">${(solBalance * solPrice + usdtBalance * usdtPrice).toLocaleString()}</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-label">24h Change</div>
                      <div className="stat-value positive">+$145.30</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-label">Transactions</div>
                      <div className="stat-value">{transactions.length}</div>
                    </div>
                  </div>
                </section>
              </>
            )}

            {/* Zimbabwe Tab */}
            {activeTab === 'zimbabwe' && (
              <>
                {/* Zimbabwe Balances */}
                <div className="zimbabwe-section">
                  <div className="zimbabwe-header">
                    <h2>🇿🇼 Zimbabwe Payments & Banking</h2>
                  </div>

                  {/* Exchange Rates */}
                  {exchangeRate && (
                    <div className="exchange-rate-card">
                      <h3>Live Exchange Rates</h3>
                      <div className="rates-grid">
                        <div className="rate-item">
                          <div className="rate-label">ZWL Rate</div>
                          <div className="rate-value">1 USD = ZWL {exchangeRate.zwlRate.toFixed(2)}</div>
                        </div>
                        <div className="rate-item">
                          <div className="rate-label">Your ZWL Balance</div>
                          <div className="rate-value">ZWL {zwlBalance.toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Payment Methods */}
                  <div className="payment-methods">
                    <h3>Payment Methods Available</h3>
                    <div className="methods-grid">
                      <div className="method-card">
                        <div className="method-icon">💚</div>
                        <div className="method-name">EcoCash</div>
                        <div className="method-desc">Airtime & Money Transfer</div>
                      </div>
                      <div className="method-card">
                        <div className="method-icon">🏪</div>
                        <div className="method-name">PayZone</div>
                        <div className="method-desc">Bill Payments & Services</div>
                      </div>
                      <div className="method-card">
                        <div className="method-icon">📡</div>
                        <div className="method-name">Kwese Remit</div>
                        <div className="method-desc">Money Transfers</div>
                      </div>
                      <div className="method-card">
                        <div className="method-icon">🏦</div>
                        <div className="method-name">Bank Transfer</div>
                        <div className="method-desc">Zimbabwe Banks</div>
                      </div>
                    </div>
                  </div>

                  {/* Analytics */}
                  {zimbabweAnalytics && (
                    <section className="zimbabwe-analytics">
                      <h3>Your Zimbabwe Activity</h3>
                      <div className="analytics-grid">
                        <div className="analytics-card">
                          <div className="analytics-label">Total Transactions</div>
                          <div className="analytics-value">{zimbabweAnalytics.totalTransactions}</div>
                        </div>
                        <div className="analytics-card">
                          <div className="analytics-label">Total Volume</div>
                          <div className="analytics-value">ZWL {zimbabweAnalytics.totalVolume.toLocaleString()}</div>
                        </div>
                        <div className="analytics-card">
                          <div className="analytics-label">Avg Transaction</div>
                          <div className="analytics-value">ZWL {zimbabweAnalytics.averageTransaction.toLocaleString()}</div>
                        </div>
                        <div className="analytics-card">
                          <div className="analytics-label">Top Method</div>
                          <div className="analytics-value">{zimbabweAnalytics.topPaymentMethod}</div>
                        </div>
                      </div>
                    </section>
                  )}

                  {/* Zimbabwe Transaction History */}
                  {zimbabweTransactions.length > 0 && (
                    <section className="zimbabwe-transactions">
                      <div className="section-header">
                        <h3>Recent Zimbabwe Transactions</h3>
                        <Button variant="ghost" size="small">View All</Button>
                      </div>
                      <div className="zimbabwe-tx-list">
                        {zimbabweTransactions.map((tx: any, idx: number) => (
                          <div key={idx} className="zimbabwe-tx-item">
                            <div className="tx-left">
                              <div className="tx-method">
                                {tx.method === 'ecocash' ? '💚' : tx.method === 'payzone' ? '🏪' : '📡'} {tx.method.toUpperCase()}
                              </div>
                              <div className="tx-detail">
                                <div>{tx.reference}</div>
                                <div className="tx-time">{tx.timestamp}</div>
                              </div>
                            </div>
                            <div className="tx-right">
                              <div className="tx-amount">ZWL {tx.amount.toLocaleString()}</div>
                              <span className={`tx-status ${tx.status}`}>{tx.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Quick Actions */}
                  <div className="zimbabwe-actions">
                    <Button variant="primary">Send EcoCash</Button>
                    <Button variant="secondary">Transfer via Bank</Button>
                    <Button variant="secondary">Buy Airtime</Button>
                    <Button variant="ghost">View Rates</Button>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
