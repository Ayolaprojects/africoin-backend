import React, { useState } from 'react';
import Button from '../components/Button';
import '../styles/Transactions.css';

interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'swap' | 'payment';
  from: string;
  to: string;
  amount: number;
  token: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  hash?: string;
}

const Transactions: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'send' | 'receive' | 'swap'>('all');

  const transactions: Transaction[] = [
    { id: '1', type: 'receive', from: 'Partner A', to: 'You', amount: 1000, token: 'AFR', date: '2024-02-19', status: 'completed', hash: '5jX9...2kL4' },
    { id: '2', type: 'send', from: 'You', to: 'Partner B', amount: 500, token: 'AFR', date: '2024-02-18', status: 'completed', hash: '3aB8...9mK1' },
    { id: '3', type: 'swap', from: 'AFR', to: 'SOL', amount: 250, token: 'SOL', date: '2024-02-17', status: 'completed', hash: '7cD2...4nP9' },
    { id: '4', type: 'payment', from: 'You', to: 'Merchant', amount: 150, token: 'AFR', date: '2024-02-16', status: 'completed', hash: '1eF5...6qT3' },
    { id: '5', type: 'receive', from: 'Friend', to: 'You', amount: 50, token: 'SOL', date: '2024-02-15', status: 'pending', hash: '9uH7...8sV2' },
  ];

  const filteredTxs = filter === 'all' ? transactions : transactions.filter(tx => tx.type === filter);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'send':
        return '📤';
      case 'receive':
        return '📥';
      case 'swap':
        return '⇄';
      case 'payment':
        return '💳';
      default:
        return '•';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'status-completed';
      case 'pending':
        return 'status-pending';
      case 'failed':
        return 'status-failed';
      default:
        return '';
    }
  };

  return (
    <div className="transactions-page">
      <div className="transactions-container">
        <div className="page-header">
          <h1>Transaction History</h1>
          <p>View and manage all your Africoin transactions</p>
        </div>

        {/* Filters */}
        <div className="filter-tabs">
          {(['all', 'send', 'receive', 'swap'] as const).map((f) => (
            <button
              key={f}
              className={`filter-tab ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="stats-summary">
          <div className="stat">
            <span className="stat-label">Total Transactions</span>
            <span className="stat-value">{filteredTxs.length}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Total Sent</span>
            <span className="stat-value">
              ${filteredTxs.filter(tx => tx.type === 'send').reduce((sum, tx) => sum + tx.amount, 0).toLocaleString()}
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">Total Received</span>
            <span className="stat-value">
              ${filteredTxs.filter(tx => tx.type === 'receive').reduce((sum, tx) => sum + tx.amount, 0).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="transactions-table">
          <div className="table-header">
            <div className="col-type">Type</div>
            <div className="col-from">From</div>
            <div className="col-to">To</div>
            <div className="col-amount">Amount</div>
            <div className="col-date">Date</div>
            <div className="col-status">Status</div>
            <div className="col-action">Action</div>
          </div>

          {filteredTxs.map((tx) => (
            <div key={tx.id} className="table-row">
              <div className="col-type">
                <span className="type-icon">{getTypeIcon(tx.type)}</span>
                <span className="type-label">{tx.type}</span>
              </div>
              <div className="col-from">{tx.from}</div>
              <div className="col-to">{tx.to}</div>
              <div className="col-amount">{tx.amount} {tx.token}</div>
              <div className="col-date">{tx.date}</div>
              <div className={`col-status ${getStatusColor(tx.status)}`}>
                {tx.status}
              </div>
              <div className="col-action">
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => alert(`View details for transaction ${tx.id}`)}
                >
                  Details
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Export */}
        <div className="export-section">
          <Button variant="ghost">📥 Export CSV</Button>
          <Button variant="ghost">📊 Export Report</Button>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
