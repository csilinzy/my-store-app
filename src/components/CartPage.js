// src/components/CartPage.js
import React from 'react';
import { useCart } from '../context/CartContext';
import './CartPage.css';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, getTotalPrice } = useCart();

  // Filter out openFDA sourced products that aren't in stock
  const availableItems = cart.items.filter(item => !item.isFromOpenFDA);

  if (availableItems.length === 0) {
    return (
      <div className="cart-page">
        <h2>Your Pharmacy Shopping Cart</h2>
        {cart.items.length > 0 ? (
          <>
            <p>You have items from the FDA database in your cart, but they are not currently in stock.</p>
            <p>Please contact support for availability of these items.</p>
            <div className="unavailable-items">
              <h3>Unavailable Items:</h3>
              {cart.items.filter(item => item.isFromOpenFDA).map(item => (
                <div key={item.id} className="unavailable-item">
                  <h4>{item.name}</h4>
                  <p>{item.commonName ? `Also known as: ${item.commonName}` : ''}</p>
                  <p>Dosage: {item.dosage || 'N/A'}</p>
                  <p>NDC: {item.ndc || 'N/A'}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p>Your cart is empty</p>
        )}
        <button className="continue-shopping-btn">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h2>Your Pharmacy Shopping Cart</h2>
      <div className="cart-items">
        {availableItems.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="item-image">
              <img src={item.image} alt={item.name} />
            </div>
            <div className="item-details">
              <h3>{item.name}</h3>
              <p className="item-common-name">{item.commonName ? `Also known as: ${item.commonName}` : ''}</p>
              <p className="item-dosage">{item.dosage ? `Dosage: ${item.dosage}` : ''}</p>
              <p className="item-ndc">NDC: {item.ndc || 'N/A'}</p>
              <p className="item-price">${item.price.toFixed(2)}</p>
            </div>
            <div className="item-quantity">
              <button 
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button 
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
              >
                +
              </button>
            </div>
            <div className="item-total">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
            <button 
              className="remove-btn"
              onClick={() => removeFromCart(item.id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      
      {cart.items.some(item => item.isFromOpenFDA) && (
        <div className="unavailable-items-notice">
          <p>Note: Some items from your search are from the FDA database but are not currently in stock.</p>
        </div>
      )}
      
      <div className="cart-summary">
        <h3>Order Summary</h3>
        <div className="summary-row">
          <span>Subtotal:</span>
          <span>${getTotalPrice().toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Shipping:</span>
          <span>$5.99</span>
        </div>
        <div className="summary-row total">
          <span>Total:</span>
          <span>${(getTotalPrice() + 5.99).toFixed(2)}</span>
        </div>
        <button className="checkout-btn">Proceed to Checkout</button>
      </div>
    </div>
  );
};

export default CartPage;