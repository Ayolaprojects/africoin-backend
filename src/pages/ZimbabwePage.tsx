import React, { useState } from 'react';
import ZimbabweDashboard from '../components/ZimbabweDashboard';
import '../styles/ZimbabwePage.css';

const ZimbabwePage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'dashboard' | 'info' | 'faq'>('dashboard');

  return (
    <div className="zimbabwe-page">
      {/* Hero Section */}
      <div className="zimbabwe-hero">
        <div className="hero-content">
          <h1>🇿🇼 Welcome to African Coin in Zimbabwe</h1>
          <p>Fast, Secure, and Affordable Financial Services for All Zimbabweans</p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => setActiveSection('dashboard')}>
              Start Using African Coin
            </button>
            <button className="btn-secondary" onClick={() => setActiveSection('info')}>
              Learn More
            </button>
          </div>
        </div>
        <div className="hero-image">
          <div className="zimbabwe-flag">🇿🇼</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="page-tabs">
        <button
          className={`tab-btn ${activeSection === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveSection('dashboard')}
        >
          📊 Dashboard
        </button>
        <button
          className={`tab-btn ${activeSection === 'info' ? 'active' : ''}`}
          onClick={() => setActiveSection('info')}
        >
          ℹ️ About
        </button>
        <button
          className={`tab-btn ${activeSection === 'faq' ? 'active' : ''}`}
          onClick={() => setActiveSection('faq')}
        >
          ❓ FAQ
        </button>
      </div>

      {/* Dashboard Section */}
      {activeSection === 'dashboard' && (
        <div className="section-content">
          <ZimbabweDashboard />
        </div>
      )}

      {/* Info Section */}
      {activeSection === 'info' && (
        <div className="section-content">
          <div className="info-container">
            <h2>About African Coin in Zimbabwe</h2>
            <p>
              African Coin is revolutionizing digital finance in Zimbabwe with secure, fast, and affordable
              payment solutions tailored for Zimbabweans.
            </p>

            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">💚</div>
                <h3>EcoCash Integration</h3>
                <p>Seamless integration with Zimbabwe's most popular mobile money platform</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">🏪</div>
                <h3>PayZone Network</h3>
                <p>Access thousands of PayZone agents across Zimbabwe for cash withdrawals</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">📡</div>
                <h3>Kwese Remit</h3>
                <p>Send and receive international remittances easily</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">🏦</div>
                <h3>Bank Integration</h3>
                <p>Direct transfers to all Zimbabwean bank accounts</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">📱</div>
                <h3>Airtime & Utilities</h3>
                <p>Buy airtime and pay bills directly from African Coin</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">🔐</div>
                <h3>Secure & Reliable</h3>
                <p>Bank-level security with 24/7 customer support</p>
              </div>
            </div>

            <div className="benefits-section">
              <h3>Why Choose African Coin?</h3>
              <ul className="benefits-list">
                <li>💰 Low fees compared to traditional methods</li>
                <li>⚡ Instant transactions with immediate confirmation</li>
                <li>🛡️ Advanced security with encryption and KYC verification</li>
                <li>📊 Detailed transaction history and analytics</li>
                <li>🌍 Multi-currency support (ZWL, USD, USDT)</li>
                <li>👥 Community rewards and referral bonuses</li>
              </ul>
            </div>

            <div className="exchange-rates-section">
              <h3>💱 Current Exchange Rates</h3>
              <div className="rates-table">
                <table>
                  <thead>
                    <tr>
                      <th>Currency</th>
                      <th>To ZWL</th>
                      <th>To USD</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>ZWL (Zimbabwean Dollar)</td>
                      <td>1.00</td>
                      <td>≈ 0.0012</td>
                    </tr>
                    <tr>
                      <td>USD (US Dollar)</td>
                      <td>≈ 850</td>
                      <td>1.00</td>
                    </tr>
                    <tr>
                      <td>USDT (Tether)</td>
                      <td>≈ 850</td>
                      <td>≈ 1.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="rate-disclaimer">*Rates are approximate and updated hourly</p>
            </div>
          </div>
        </div>
      )}

      {/* FAQ Section */}
      {activeSection === 'faq' && (
        <div className="section-content">
          <div className="faq-container">
            <h2>Frequently Asked Questions</h2>

            <div className="faq-grid">
              <div className="faq-item">
                <h4>How do I get started with African Coin?</h4>
                <p>
                  Simply download the app, create an account with your email or phone number, and complete
                  the KYC verification process. You'll be ready to make your first transaction within minutes!
                </p>
              </div>

              <div className="faq-item">
                <h4>What are the transaction fees?</h4>
                <p>
                  Transaction fees vary depending on the payment method. EcoCash transfers start at ZWL 50,
                  while bank transfers are typically ZWL 100-200. Check the app for exact fees.
                </p>
              </div>

              <div className="faq-item">
                <h4>Is my money safe with African Coin?</h4>
                <p>
                  Yes! We use bank-level encryption, two-factor authentication, and secure servers to protect
                  your funds. All transactions are monitored for fraud detection 24/7.
                </p>
              </div>

              <div className="faq-item">
                <h4>Can I send money internationally?</h4>
                <p>
                  Yes! Through our Kwese Remit partnership, you can send money to over 50 countries. Simply
                  select the destination country and follow the simple steps.
                </p>
              </div>

              <div className="faq-item">
                <h4>What if I forget my PIN?</h4>
                <p>
                  You can reset your PIN through the app's security settings using your registered email or
                  phone number. For additional help, contact our support team.
                </p>
              </div>

              <div className="faq-item">
                <h4>How long does a transaction take?</h4>
                <p>
                  EcoCash transfers are instant (within seconds). Bank transfers typically complete within 1-3
                  hours during business hours.
                </p>
              </div>

              <div className="faq-item">
                <h4>What currencies can I use?</h4>
                <p>
                  We support ZWL (Zimbabwean Dollar), USD (US Dollar), and USDT (Tether stablecoin). You can
                  easily convert between currencies at real-time rates.
                </p>
              </div>

              <div className="faq-item">
                <h4>Do you have customer support?</h4>
                <p>
                  Absolutely! Our support team is available 24/7 through chat, email, and phone. We're here
                  to help with any questions or issues.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="zimbabwe-footer">
        <div className="footer-content">
          <p>&copy; 2024 African Coin. All rights reserved. | Fast • Secure • Affordable</p>
          <div className="footer-links">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#contact">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ZimbabwePage;
