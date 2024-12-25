'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './order.css';

const OrderPage = () => {
  const [cart, setCart] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState('standard');
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        if (Array.isArray(parsedCart)) {
          setCart(parsedCart);
        } else {
          console.error("Cart data is not an array:", parsedCart);
        }
      } catch (error) {
        console.error("Error parsing cart data from localStorage:", error);
        setCart([]);
      }
    }
  }, []);

  const calculateSubtotal = () => {
    return cart
      .reduce((total, item) => total + parseFloat(item.price) * parseInt(item.quantity, 10), 0)
      .toFixed(2);
  };

  const calculateTax = (subtotal) => {
    return (parseFloat(subtotal) * 0.05).toFixed(2);
  };

  const calculateTotal = (subtotal, tax) => {
    return (parseFloat(subtotal) + parseFloat(tax)).toFixed(2);
  };

  const handleDeliveryChange = (event) => {
    setSelectedDelivery(event.target.value);
  };

  const confirmOrder = () => {
    alert(`Order confirmed with ${selectedDelivery} delivery!`);
    router.push('/payment'); // Navigate to the payment page
  };

  const subtotal = calculateSubtotal();
  const tax = calculateTax(subtotal);
  const total = calculateTotal(subtotal, tax);

  if (!isClient) {
    return null;
  }

  return (
    <div className="order-container">
      <h1 className="order-header">Review Your Order</h1>
      <div className="order-items">
        {cart.length > 0 ? (
          cart.map((item) => (
            <div key={item.id} className="order-item">
              <img src={item.image} alt={item.name} />
              <div className="order-item-info">
                <h2 className="order-item-name">{item.name}</h2>
                <p className="order-item-price">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))
        ) : (
          <p>Your cart is empty.</p>
        )}
      </div>

      <div className="order-summary">
        <div className="summary-item">
          <span>Subtotal:</span>
          <span>${subtotal}</span>
        </div>
        <div className="summary-item">
          <span>Tax (5%):</span>
          <span>${tax}</span>
        </div>
        <div className="summary-item">
          <span>Total:</span>
          <span>${total}</span>
        </div>
      </div>

      <div className="delivery-options">
        <h2>Delivery Options</h2>
        <div>
          <label>
            <input
              type="radio"
              value="standard"
              checked={selectedDelivery === 'standard'}
              onChange={handleDeliveryChange}
            />
            Standard Delivery (Free)
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              value="express"
              checked={selectedDelivery === 'express'}
              onChange={handleDeliveryChange}
            />
            Express Delivery ($9.99)
          </label>
        </div>
      </div>

      <button className="confirm-btn" onClick={confirmOrder}>
        Go to Payment
      </button>
    </div>
  );
};

export default OrderPage;
