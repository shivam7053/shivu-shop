// src/components/Header.js
'use client';

import Link from 'next/link';
import './header.css'; // Import the header's specific styles

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <Link href="/">
          <h1 className="header-title">E-Commerce Store</h1>
        </Link>
        <nav className="nav">
          <Link href="/cart" className="nav-link">
            Cart
          </Link>
          <Link href="/orders" className="nav-link">
            Orders
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
