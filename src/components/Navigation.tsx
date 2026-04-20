import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import '../styles/Navigation.css';

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Services', path: '/services' },
    { label: 'Swap', path: '/swap' },
    { label: 'Payments', path: '/payments' },
    { label: 'Transactions', path: '/transactions' },
  ];

  return (
    <header className="nav">
      <div className="nav-container">
        <div className="nav-left">
          <div className="nav-logo">
            <span className="logo-text">🪙</span>
          </div>
          <div className="nav-title">
            <span className="nav-brand">AFRICOIN</span>
            <span className="nav-subtitle">App</span>
          </div>
        </div>

        <button className="nav-toggle" onClick={toggleMenu} aria-label="Toggle menu">
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`nav-links ${isOpen ? 'is-open' : ''}`}>
          {navItems.map((item) => (
            <a
              key={item.path}
              href={item.path}
              onClick={(e) => {
                e.preventDefault();
                navigate(item.path);
                setIsOpen(false);
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="nav-cta">
          <WalletMultiButton />
        </div>
      </div>
    </header>
  );
};

export default Navigation;
