import React from 'react';
import '../styles/WalletCard.css';

interface WalletCardProps {
  balance: number;
  token: string;
  change?: number;
}

const WalletCard: React.FC<WalletCardProps> = ({ balance, token, change }) => {
  return (
    <div className="wallet-card">
      <div className="wallet-header">
        <h3>{token}</h3>
        <span className="wallet-status">Live on Solana</span>
      </div>
      <div className="wallet-balance">
        <div className="balance-label">Balance</div>
        <div className="balance-value">${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        {change !== undefined && (
          <div className={`balance-change ${change >= 0 ? 'positive' : 'negative'}`}>
            {change >= 0 ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%
          </div>
        )}
      </div>
      <div className="wallet-meta">
        <span>150% Collateral Ratio</span>
      </div>
    </div>
  );
};

export default WalletCard;
