'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import from next/navigation
import './cart.css'; // Import styles for the cart page

const CartPage = () => {
  const [cart, setCart] = useState([]); // State to hold cart items
  const [isClient, setIsClient] = useState(false); // State to check if client-side rendering
  const router = useRouter(); // Use the useRouter hook

  useEffect(() => {
    setIsClient(true); // Ensure client-side rendering
  }, []);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        // Ensure each item has a quantity initialized to 1 if missing
        const updatedCart = parsedCart.map(item => ({
          ...item,
          quantity: item.quantity || 1, // Default to 1 if quantity is missing
        }));
        setCart(updatedCart);
      } catch {
        setCart([]); // Fallback to an empty cart if parsing fails
      }
    }
  }, []); 

  // Update the quantity of an item in the cart
  const updateQuantity = (id, action) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: action === 'increase' ? item.quantity + 1 : Math.max(1, item.quantity - 1),
            }
          : item
      )
    );
  };

  // Remove an item from the cart
  const removeItem = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // Calculate the total price of the cart
  const calculateTotal = () => {
    return cart
      .reduce((total, item) => {
        const validPrice = parseFloat(item.price) || 0; // Ensure price is valid
        const validQuantity = parseInt(item.quantity, 10) || 0; // Ensure quantity is valid
        return total + validPrice * validQuantity;
      }, 0)
      .toFixed(2); // Format result to two decimal places
  };

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart]);

  // Proceed to checkout
  const handleCheckout = () => {
    if (isClient) {
      const cartQueryParam = JSON.stringify(cart);
      router.push(`/order?cart=${encodeURIComponent(cartQueryParam)}`);
    }
  };

  // Merging cart logic to handle quantity changes and remove duplicates
  const mergedCart = cart.reduce((acc, item) => {
    if (!item || !item.id || !item.price || !item.quantity) return acc; // Skip invalid items
    const existingItemIndex = acc.findIndex((accItem) => accItem.id === item.id);
    if (existingItemIndex !== -1) {
      acc[existingItemIndex].quantity += item.quantity; // Merge quantities for duplicate items
    } else {
      acc.push(item); // Add new item to the cart
    }
    return acc;
  }, []);

  return (
    <div className="cart-container">
      <h1 className="cart-header">Your Cart</h1>
      <div className="cart-items">
        {mergedCart.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          mergedCart.map((item) => (
            <div key={`${item.id}-${item.quantity}`} className="cart-item">
              <img src={item.image || '/placeholder.png'} alt={item.name || 'Item'} />
              <div className="cart-item-info">
                <h2 className="cart-item-name">{item.name || 'Unnamed Item'}</h2>
                <p className="cart-item-price">${item.price || '0.00'}</p>
                <div className="cart-item-quantity">
                  <button className="quantity-btn" onClick={() => updateQuantity(item.id, 'decrease')}>
                    -
                  </button>
                  <span>{item.quantity || 1}</span>
                  <button className="quantity-btn" onClick={() => updateQuantity(item.id, 'increase')}>
                    +
                  </button>
                </div>
              </div>
              <button className="remove-btn" onClick={() => removeItem(item.id)}>
                Remove
              </button>
            </div>
          ))
        )}
      </div>
      <div className="cart-total">
        <span>Total:</span>
        <span>${calculateTotal()}</span>
      </div>
      <button className="checkout-btn" onClick={handleCheckout}>
        Checkout
      </button>
    </div>
  );
};

export default CartPage;
