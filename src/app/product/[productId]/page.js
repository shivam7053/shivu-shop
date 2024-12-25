'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './product.css'; // Import styles specific to Product Details Page
import React from 'react';

// Sample product list
const products = [
  { id: 1, name: 'Product 1', description: 'Detailed description of Product 1.', image: '/images/product1.jpg', price: 29.99 },
  { id: 2, name: 'Product 2', description: 'Detailed description of Product 2.', image: '/images/product2.jpg', price: 39.99 },
  // Add more products as needed
];

const ProductDetailsPage = ({ params }) => {
  const [product, setProduct] = useState(null);
  const [isClient, setIsClient] = useState(false); // To ensure client-side rendering
  const router = useRouter();

  // Unwrap params using React.use()
  const { productId } = React.use(params);

  useEffect(() => {
    setIsClient(true); // Ensure that we are client-side before interacting with localStorage

    // Find the product based on the productId from params
    const selectedProduct = products.find((p) => p.id === parseInt(productId, 10));
    setProduct(selectedProduct);
  }, [productId]);

  const addToCart = () => {
    if (!isClient || !product) return; // Ensure client-side only actions

    // Get the current cart from localStorage, or initialize an empty array if not present
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];

    // Add the selected product to the cart
    storedCart.push(product);

    // Save the updated cart back to localStorage
    localStorage.setItem('cart', JSON.stringify(storedCart));

    // Optionally, you can update the state or show an alert
    alert(`${product.name} has been added to your cart!`);
  };

  if (!product) {
    return <p>Loading product details...</p>;
  }

  return (
    <div className="product-details">
      <button onClick={() => router.back()} className="back-button">
        Back
      </button>
      <div className="product-card">
        <img src={product.image || '/placeholder.png'} alt={product.name || 'Product'} className="product-image" />
        <h1 className="product-title">{product.name || 'Unnamed Product'}</h1>
        <p className="product-description">{product.description || 'No description available.'}</p>
        <p className="product-price">Price: ${product.price?.toFixed(2) || '0.00'}</p>
        <button className="add-to-cart-button" onClick={addToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
