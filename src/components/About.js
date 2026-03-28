import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-page container">
      <section className="hero-section">
        <h1>About PharmaTrade</h1>
        <p>Your trusted B2B marketplace for licensed pharmacies</p>
      </section>

      <section className="content-section">
        <h2>Our Mission</h2>
        <p>
          At PharmaTrade, we're committed to creating a secure, compliant, and efficient marketplace 
          for licensed pharmacies to trade pharmaceuticals. Our platform addresses the challenges 
          of supply shortages, surplus inventory, and regional imbalances in pharmaceutical distribution.
        </p>
        
        <h2>Who We Serve</h2>
        <p>
          PharmaTrade exclusively serves licensed pharmacies and healthcare institutions. 
          Our rigorous verification process ensures that every participant meets the highest 
          standards of regulatory compliance and professional integrity.
        </p>
        
        <h2>Security & Compliance</h2>
        <p>
          We maintain the highest standards of security and regulatory compliance. 
          All transactions are monitored for adherence to DEA, FDA, and state regulations. 
          Our platform maintains complete chain of custody documentation for every transaction.
        </p>
        
        <div className="values-grid">
          <div className="value-item">
            <h3>Trust</h3>
            <p>Rigorous verification of all participating pharmacies</p>
          </div>
          <div className="value-item">
            <h3>Integrity</h3>
            <p>Fully compliant with federal and state regulations</p>
          </div>
          <div className="value-item">
            <h3>Efficiency</h3>
            <p>Streamlined processes to reduce procurement costs</p>
          </div>
          <div className="value-item">
            <h3>Security</h3>
            <p>Enterprise-grade protection for all transactions</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;