'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import jsPDF from 'jspdf'; // Import jsPDF for PDF generation
import './payment.css'; // Import CSS

const PaymentPage = () => {
  const [cart, setCart] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const [address, setAddress] = useState("");
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    expirationDate: "",
    cvv: "",
  });
  const [selectedDelivery, setSelectedDelivery] = useState("standard");
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        setCart(parsedCart);
      } catch (error) {
        console.error("Error parsing cart data from localStorage:", error);
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

  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };

  const handlePaymentDetailsChange = (event) => {
    const { name, value } = event.target;
    setPaymentDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const generatePDF = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    const total = calculateTotal(subtotal, tax);

    const doc = new jsPDF();
    doc.text("Invoice", 20, 10);
    doc.text("Delivery Option: " + selectedDelivery, 20, 20);
    doc.text("Address: " + address, 20, 30);
    doc.text("Items:", 20, 40);

    let yPosition = 50;
    cart.forEach((item) => {
      doc.text(`${item.name} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`, 20, yPosition);
      yPosition += 10;
    });

    doc.text(`Subtotal: $${subtotal}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Tax (5%): $${tax}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Total: $${total}`, 20, yPosition);

    doc.save("invoice.pdf"); // Save the PDF as "invoice.pdf"

    // After payment, clear the cart from localStorage
    localStorage.removeItem('cart');
    setCart([]); // Optionally clear the cart state as well
  };

  const subtotal = calculateSubtotal();
  const tax = calculateTax(subtotal);
  const total = calculateTotal(subtotal, tax);

  if (!isClient) {
    return null;
  }

  return (
    <div className="payment-container">
      <h1>Payment Details</h1>

      <div className="address-section">
        <h2>Billing Address</h2>
        <textarea
          placeholder="Enter your billing address"
          value={address}
          onChange={handleAddressChange}
        />
      </div>

      <div className="payment-details-section">
        <h2>Payment Information</h2>
        <label>Card Number</label>
        <input
          type="text"
          name="cardNumber"
          value={paymentDetails.cardNumber}
          onChange={handlePaymentDetailsChange}
          placeholder="1234 5678 9101 1121"
        />
        <label>Expiration Date</label>
        <input
          type="text"
          name="expirationDate"
          value={paymentDetails.expirationDate}
          onChange={handlePaymentDetailsChange}
          placeholder="MM/YY"
        />
        <label>CVV</label>
        <input
          type="text"
          name="cvv"
          value={paymentDetails.cvv}
          onChange={handlePaymentDetailsChange}
          placeholder="123"
        />
      </div>

      <div className="payment-summary">
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

      <button className="pay-btn" onClick={generatePDF}>
        Pay & Download Bill
      </button>
    </div>
  );
};

export default PaymentPage;
