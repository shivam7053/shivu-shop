'use client';

import Link from 'next/link'; // Import Link for routing
import './home.css'; // Import Home Page-specific styles

const products = [
  { id: 1, name: 'Product 1', description: 'A short description of Product 1.', price: 29.99, image: '/images/product1.jpg' },
  { id: 2, name: 'Product 2', description: 'A short description of Product 2.', price: 39.99, image: '/images/product2.jpg' },
  // Add more products as needed
];

const HomePage = () => {
  return (
    <div className="home-container">
      <h1>Welcome to Our E-Commerce Store!</h1>
      <p>Shop the best products at unbeatable prices.</p>
      <div className="product-list">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} className="product-image" />
            <h2 className="product-title">{product.name}</h2>
            <p className="product-description">{product.description}</p>
            <p className="product-price">${product.price}</p>
            <Link href={`/product/${product.id}`}>
              <button className="product-button">View Product</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
