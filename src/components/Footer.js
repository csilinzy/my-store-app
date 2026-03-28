// src/components/Footer.js
import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>My Store</h3>
          <p>Your one-stop shop for all your needs. Quality products at competitive prices.</p>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li><a href="/">Home</a></li>
            <li><a href="/products">Products</a></li>
            <li><a href="/categories">Categories</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Customer Service</h4>
          <ul className="footer-links">
            <li><a href="/help">Help Center</a></li>
            <li><a href="/returns">Returns</a></li>
            <li><a href="/shipping">Shipping Info</a></li>
            <li><a href="/faq">FAQ</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Contact Us</h4>
          <address className="contact-info">
            <p>📧 info@mystore.com</p>
            <p>📞 (123) 456-7890</p>
            <p>📍 123 Shop Street, City, Country</p>
          </address>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} My Store. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;