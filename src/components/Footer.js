// src/components/Footer.js
'use client';

import './footer.css'; // Import the footer's specific styles

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p className="footer-text">
          © {new Date().getFullYear()} E-Commerce Store. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
