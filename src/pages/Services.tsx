import React from 'react';
import '../styles/Services.css';

const Services: React.FC = () => {
  const services = [
    {
      icon: '🌍',
      title: 'Cross-border Settlements',
      description: 'BRICS-focused instant settlements with ultra-low fees',
      features: ['Fast transactions', 'Low fees', 'BRICS support']
    },
    {
      icon: '📱',
      title: 'QR & Card Payments',
      description: 'Merchant payment solutions with instant settlement',
      features: ['QR payments', 'Virtual cards', 'Point of sale']
    },
    {
      icon: '🤖',
      title: 'AI Risk Analytics',
      description: 'Real-time fraud detection and AML monitoring',
      features: ['Fraud detection', 'AML compliance', 'Real-time monitoring']
    },
    {
      icon: '💎',
      title: 'Resource Backing',
      description: 'Transparent tokenized gold and oil collateral',
      features: ['150% collateralization', 'On-chain transparency', 'Oracle pricing']
    },
    {
      icon: '🔐',
      title: 'Secure Wallets',
      description: 'Enterprise-grade security for your digital assets',
      features: ['Multi-sig support', 'Cold storage', 'Biometric auth']
    },
    {
      icon: '📊',
      title: 'Dashboard Analytics',
      description: 'Real-time portfolio tracking and insights',
      features: ['Real-time data', 'Charts & reports', 'Export capability']
    }
  ];

  return (
    <div className="services-page">
      <div className="services-container">
        <div className="page-header">
          <h1>Services & Features</h1>
          <p>Comprehensive financial solutions for BRICS trade and global settlement</p>
        </div>

        <div className="services-grid">
          {services.map((service, idx) => (
            <div key={idx} className="service-card">
              <div className="service-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <ul className="features-list">
                {service.features.map((feature, fidx) => (
                  <li key={fidx}>✓ {feature}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Integration Partners */}
        <section className="integration-section">
          <h2>Integration Partners</h2>
          <div className="partners-grid">
            <div className="partner">PHANTOM</div>
            <div className="partner">BACKPACK</div>
            <div className="partner">STRIPE</div>
            <div className="partner">SOLANA</div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Services;
