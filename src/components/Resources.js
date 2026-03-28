import React from 'react';
import './Resources.css';

const Resources = () => {
  return (
    <div className="resources-page container">
      <section className="hero-section">
        <h1>Pharmacy Resources</h1>
        <p>Tools, guides, and information for licensed pharmacists</p>
      </section>

      <section className="content-section">
        <div className="resource-category">
          <h2>Regulatory Compliance</h2>
          <ul>
            <li>DEA Compliance Guidelines</li>
            <li>FDA Drug Registration Requirements</li>
            <li>State Board of Pharmacy Regulations</li>
            <li>Controlled Substances Ordering System</li>
          </ul>
        </div>

        <div className="resource-category">
          <h2>Industry Standards</h2>
          <ul>
            <li>USP &lt;800&gt; Hazardous Drugs Handling</li>
            <li>NABP Best Practices Guide</li>
            <li>Pharmacy Operations Manual Template</li>
            <li>Inventory Management Protocols</li>
          </ul>
        </div>

        <div className="resource-category">
          <h2>Market Intelligence</h2>
          <ul>
            <li>Drug Shortage Notifications</li>
            <li>Pricing Trends Reports</li>
            <li>Therapeutic Class Analysis</li>
            <li>Supplier Performance Metrics</li>
          </ul>
        </div>

        <div className="resource-category">
          <h2>Training Materials</h2>
          <ul>
            <li>Clinical Drug Interaction Checker</li>
            <li>Compounding Safety Procedures</li>
            <li>Prescription Verification Training</li>
            <li>Insurance Claim Processing</li>
          </ul>
        </div>

        <div className="resource-downloads">
          <h2>Downloadable Resources</h2>
          <div className="downloads-grid">
            <div className="download-item">
              <h3>Pharmacy Onboarding Checklist</h3>
              <p>Complete guide to getting started on PharmaTrade platform</p>
              <button className="download-btn">Download PDF</button>
            </div>
            <div className="download-item">
              <h3>Compliance Audit Template</h3>
              <p>Self-assessment tool for regulatory readiness</p>
              <button className="download-btn">Download PDF</button>
            </div>
            <div className="download-item">
              <h3>Chain of Custody Forms</h3>
              <p>Documentation templates for controlled substances</p>
              <button className="download-btn">Download PDF</button>
            </div>
            <div className="download-item">
              <h3>Emergency Contact Directory</h3>
              <p>State board of pharmacy contact information</p>
              <button className="download-btn">Download PDF</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Resources;