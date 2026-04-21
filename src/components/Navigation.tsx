import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Navigation.css';

interface NavigationProps {
  preloadRoute?: (path: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ preloadRoute }) => {
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
    { label: '🇿🇼 Zimbabwe', path: '/zimbabwe' },
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
              onMouseEnter={() => preloadRoute?.(item.path)}
              onFocus={() => preloadRoute?.(item.path)}
              onTouchStart={() => preloadRoute?.(item.path)}
              onClick={(e) => {
                e.preventDefault();
                preloadRoute?.(item.path);
                navigate(item.path);
                setIsOpen(false);
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="nav-cta">
          <div className="wallet-connect">
            <button
              type="button"
              onClick={() => {
                preloadRoute?.('/dashboard');
                navigate('/dashboard');
                setIsOpen(false);
              }}
            >
              Open Wallet
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
