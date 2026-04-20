import React from 'react';
import '../styles/Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>Africoin Ltd.</h4>
          <p>Resource-backed stablecoin on Solana</p>
        </div>
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="https://solscan.io/">View on Solscan</a></li>
            <li><a href="/">Documentation</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Resources</h4>
          <ul>
            <li><a href="/">Whitepaper</a></li>
            <li><a href="/">Business Plan</a></li>
            <li><a href="/">Support</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 Africoin Ltd. • Johannesburg, South Africa • Resource-backed stablecoin • BRICS-focused • Solana-native</p>
      </div>
    </footer>
  );
};

export default Footer;
