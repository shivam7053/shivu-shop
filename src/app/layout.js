'use client';

import Link from 'next/link';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Navigation Bar */}
        <nav className="navbar">
          <div className="navbar-container">
            {/* Navbar Name */}
            <h1 className="navbar-name">ShivuShop</h1>
            <ul className="nav-links">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/cart">Cart</Link></li>
              <li><Link href="/order">Order</Link></li>
              <li><Link href="/payment">Payment</Link></li>
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main>{children}</main>

        {/* Footer Section */}
        <footer className="footer">
          <div className="footer-content">
            <p>&copy; 2024-25 ShivuShop. All Rights Reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
