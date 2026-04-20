import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import WalletCard from '../components/WalletCard';
import '../styles/Home.css';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const services = [
    {
      title: 'Cross-border BRICS settlements',
      description: 'Instant low-fee Africoin settlements for merchants trading across South Africa, India and Brazil.',
      image: '🌍'
    },
    {
      title: 'Merchant QR & card payments',
      description: 'Retail stores accept Africoin via QR codes and virtual cards, reducing chargebacks.',
      image: '📱'
    },
    {
      title: 'AI-driven risk analytics',
      description: 'Real-time AI monitors Africoin transactions for fraud, AML flags and abnormal flows.',
      image: '🤖'
    },
    {
      title: 'Tokenized resource backing',
      description: 'Tokenized gold and oil reserves provide transparent, on-chain collateral.',
      image: '💎'
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % services.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + services.length) % services.length);
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-left">
          <div className="hero-badge">
            <span className="badge-icon">⚡</span>
            Solana-native, resource-backed digital currency
          </div>
          <h1 className="hero-title">
            AFRICOIN<br />
            <span className="gradient-text">for Global Trade & BRICS</span>
          </h1>
          <p className="hero-subtitle">
            A resource-backed stablecoin on Solana, over-collateralized by tokenized gold and oil, designed for high-speed, ultra-low-fee cross-border settlement.
          </p>
          <div className="hero-cta">
            <Button onClick={() => navigate('/dashboard')} variant="primary">
              Launch App
            </Button>
            <Button onClick={() => navigate('/payments')} variant="ghost">
              Make Payment
            </Button>
          </div>
          <div className="hero-pills">
            <div className="pill">🛡️ 150% over-collateralized</div>
            <div className="pill">🌍 BRICS-focused settlement</div>
            <div className="pill">⚙️ AI-enhanced analytics</div>
          </div>
        </div>
        <div className="hero-right">
          <WalletCard balance={5234.50} token="AFR" change={12.5} />
        </div>
      </section>

      {/* Services Carousel */}
      <section className="services-section">
        <div className="section-header">
          <div className="section-kicker">SERVICES & SUCCESS</div>
          <h2 className="section-title">
            Africoin <span>in action</span>
          </h2>
          <p className="section-subtitle">
            A snapshot of core services and real-world deployments powered by Africoin.
          </p>
        </div>

        <div className="carousel">
          <button className="carousel-btn prev" onClick={prevSlide}>←</button>
          
          <div className="carousel-content">
            <div className="service-card">
              <div className="service-icon">{services[currentSlide].image}</div>
              <h3>{services[currentSlide].title}</h3>
              <p>{services[currentSlide].description}</p>
            </div>
          </div>

          <button className="carousel-btn next" onClick={nextSlide}>→</button>
        </div>

        <div className="carousel-dots">
          {services.map((_, idx) => (
            <button
              key={idx}
              className={`dot ${idx === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(idx)}
            />
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="features-section">
        <h2>Africoin Token Metrics</h2>
        <div className="metrics-grid">
          <div className="metric-item">
            <div className="metric-label">Peg & Stability</div>
            <div className="metric-value">~1.00 USD</div>
            <div className="metric-sub">Soft peg via over-collateralization</div>
          </div>
          <div className="metric-item">
            <div className="metric-label">Network Fees</div>
            <div className="metric-value">&lt; 0.1%</div>
            <div className="metric-sub">Ultra-low settlement cost</div>
          </div>
          <div className="metric-item">
            <div className="metric-label">Supply</div>
            <div className="metric-value">1B</div>
            <div className="metric-sub">AFR fixed maximum supply</div>
          </div>
          <div className="metric-item">
            <div className="metric-label">Governance</div>
            <div className="metric-value">DAO</div>
            <div className="metric-sub">On-chain voting</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Ready to start?</h2>
        <p>Connect your Solana wallet and begin trading with Africoin</p>
        <Button onClick={() => navigate('/dashboard')} variant="primary" size="large">
          Get Started
        </Button>
      </section>
    </div>
  );
};

export default Home;
