import React, { useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import Button from '../components/Button';
import WalletCard from '../components/WalletCard';
import { solanaService } from '../services/solanaService';
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
  useConnection();
  const { publicKey } = useWallet();
  const [solBalance, setSolBalance] = useState(0);
  const [usdtBalance, setUsdtBalance] = useState(0);
  const [solPrice, setSolPrice] = useState(0);
  const [usdtPrice, setUsdtPrice] = useState(1);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!publicKey) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch balances
        const sol = await solanaService.getBalance(publicKey);
        setSolBalance(sol);

        const usdt = await solanaService.getUSDTBalance(publicKey);
        setUsdtBalance(usdt);

        // Fetch prices
        const solP = await solanaService.getSOLPrice();
        setSolPrice(solP);

        const usdtP = await solanaService.getUSDTPrice();
        setUsdtPrice(usdtP);

        // Fetch transactions
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
          <p className="subtitle">Manage your USDT and SOL holdings</p>
        </div>

        {!publicKey ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>Please connect your wallet to view your balance</p>
          </div>
        ) : loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>Loading balance...</p>
          </div>
        ) : (
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
      </div>
    </div>
  );
};

export default Dashboard;
