import React, { useState } from 'react';
import Button from '../components/Button';
import '../styles/Swap.css';

interface SwapPair {
  from: string;
  to: string;
  rate: number;
  fee: number;
}

const Swap: React.FC = () => {
  const [swapFrom, setSwapFrom] = useState('AFR');
  const [swapTo, setSwapTo] = useState('SOL');
  const [amount, setAmount] = useState('100');

  const swapPairs: SwapPair[] = [
    { from: 'AFR', to: 'SOL', rate: 0.05, fee: 0.25 },
    { from: 'AFR', to: 'USDC', rate: 1.0, fee: 0.25 },
    { from: 'SOL', to: 'AFR', rate: 20, fee: 0.25 },
  ];

  const currentPair = swapPairs.find(p => p.from === swapFrom && p.to === swapTo) || swapPairs[0];
  const swapAmount = parseFloat(amount) || 0;
  const receiveAmount = swapAmount * currentPair.rate * (1 - currentPair.fee / 100);

  const handleSwap = () => {
    alert(`Swapping ${amount} ${swapFrom} for ${receiveAmount.toFixed(4)} ${swapTo}`);
  };

  const handleReverse = () => {
    const temp = swapFrom;
    setSwapFrom(swapTo);
    setSwapTo(temp);
  };

  return (
    <div className="swap-page">
      <div className="swap-container">
        <div className="swap-header">
          <h1>Swap Tokens</h1>
          <p>Exchange your tokens instantly at the best rates</p>
        </div>

        <div className="swap-card">
          {/* From */}
          <div className="swap-section">
            <label>From</label>
            <div className="input-group">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
              />
              <select value={swapFrom} onChange={(e) => setSwapFrom(e.target.value)}>
                <option>AFR</option>
                <option>SOL</option>
                <option>USDC</option>
              </select>
            </div>
            <div className="balance">Balance: 5,234.50 {swapFrom}</div>
          </div>

          {/* Reverse Button */}
          <button className="reverse-btn" onClick={handleReverse}>⇄</button>

          {/* To */}
          <div className="swap-section">
            <label>To</label>
            <div className="input-group">
              <input
                type="text"
                value={receiveAmount.toFixed(4)}
                readOnly
                placeholder="0.00"
              />
              <select value={swapTo} onChange={(e) => setSwapTo(e.target.value)}>
                <option>SOL</option>
                <option>USDC</option>
                <option>AFR</option>
              </select>
            </div>
            <div className="balance">Balance: 2.5 {swapTo}</div>
          </div>

          {/* Details */}
          <div className="swap-details">
            <div className="detail-row">
              <span>Exchange Rate</span>
              <span>1 {swapFrom} = {currentPair.rate} {swapTo}</span>
            </div>
            <div className="detail-row">
              <span>Network Fee</span>
              <span>{currentPair.fee}%</span>
            </div>
            <div className="detail-row">
              <span>You'll receive</span>
              <span className="highlight">{receiveAmount.toFixed(4)} {swapTo}</span>
            </div>
          </div>

          {/* Action */}
          <Button
            variant="primary"
            onClick={handleSwap}
            className="swap-btn"
          >
            Swap Now
          </Button>
        </div>

        {/* Recent Swaps */}
        <div className="recent-swaps">
          <h3>Popular Trading Pairs</h3>
          <div className="pair-list">
            {['AFR/SOL', 'AFR/USDC', 'SOL/USDC'].map((pair) => (
              <div key={pair} className="pair-item">
                <span>{pair}</span>
                <span className="rate">1 = ~{Math.random() * 100}.00</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Swap;
