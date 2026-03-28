import React from 'react';
import { Link } from 'react-router-dom';
import './Homepage.css';

const Homepage = () => {
  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>PharmaTrade Exchange</h1>
          <p>Secure B2B marketplace connecting licensed pharmacies for trusted pharmaceutical trading</p>
          <div className="hero-buttons">
            <Link to="/products" className="btn btn-primary">Browse Products</Link>
            <Link to="/login" className="btn btn-secondary">Login as Pharmacist</Link>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="trust-section">
        <div className="trust-container">
          <div className="trust-item">
            <div className="trust-icon">🔒</div>
            <h3>Verified Pharmacies</h3>
            <p>All participants verified through state licensing boards</p>
          </div>
          <div className="trust-item">
            <div className="trust-icon">🛡️</div>
            <h3>Regulatory Compliance</h3>
            <p>Fully compliant with DEA, FDA, and state regulations</p>
          </div>
          <div className="trust-item">
            <div className="trust-icon">🚚</div>
            <h3>Secure Logistics</h3>
            <p>Temperature-controlled shipping with chain of custody</p>
          </div>
          <div className="trust-item">
            <div className="trust-icon">📋</div>
            <h3>Documentation</h3>
            <p>Complete audit trail for all transactions</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2>How PharmaTrade Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Verify License</h3>
            <p>Confirm your pharmacy license and credentials</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Browse Inventory</h3>
            <p>Access inventory from licensed pharmacies nationwide</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Place Orders</h3>
            <p>Securely purchase from trusted pharmacy partners</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Receive & Verify</h3>
            <p>Track shipments and confirm receipt</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <h3>1,200+</h3>
            <p>Verified Pharmacies</p>
          </div>
          <div className="stat-item">
            <h3>$125M+</h3>
            <p>Traded Annually</p>
          </div>
          <div className="stat-item">
            <h3>48</h3>
            <p>States Served</p>
          </div>
          <div className="stat-item">
            <h3>99.9%</h3>
            <p>Uptime Guarantee</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <h2>Why Choose PharmaTrade</h2>
        <div className="features-container">
          <div className="feature">
            <h3>Real-Time Inventory</h3>
            <p>Access live inventory from pharmacies across the country with real-time updates to ensure accuracy and availability.</p>
          </div>
          <div className="feature">
            <h3>Competitive Pricing</h3>
            <p>Find competitive prices from licensed pharmacies to optimize your procurement costs.</p>
          </div>
          <div className="feature">
            <h3>Quality Assurance</h3>
            <p>All products sourced from verified pharmacies with proper storage and handling certifications.</p>
          </div>
          <div className="feature">
            <h3>Secure Transactions</h3>
            <p>Enterprise-grade security ensures all transactions and communications are protected.</p>
          </div>
          <div className="feature">
            <h3>Compliance Tracking</h3>
            <p>Automated compliance reporting to simplify regulatory requirements.</p>
          </div>
          <div className="feature">
            <h3>Supply Chain Visibility</h3>
            <p>End-to-end tracking of pharmaceuticals from seller to buyer.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Join the Leading B2B Pharmacy Network</h2>
          <p>Connect with licensed pharmacies across the nation to streamline your pharmaceutical procurement and sales</p>
          <Link to="/register" className="btn btn-primary">Register Your Pharmacy</Link>
        </div>
      </section>
    </div>
  );
};

export default Homepage;