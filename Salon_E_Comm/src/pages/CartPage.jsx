import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getAuthToken } from '../utils/apiClient';
import './CartPage.css';

export default function CartPage() {
  const { cart, items, loading, removeFromCart, updateCartItem, getCartTotal } = useCart();
  const navigate = useNavigate();
  const { totalPrice, totalItems } = getCartTotal();
  const [updatingId, setUpdatingId] = useState(null);

  console.log('📦 CartPage loaded:', { cart, items, loading, totalPrice, totalItems });

  if (!getAuthToken()) {
    return (
      <div className="cart-empty">
        <h2>Please Login to View Cart</h2>
        <p>You need to be logged in to see your shopping cart</p>
        <button onClick={() => navigate('/login')} className="btn-login">Go to Login</button>
      </div>
    );
  }

  if (loading) {
    return <div className="cart-loading"><h2>Loading your cart...</h2></div>;
  }

  if (!items || items.length === 0) {
    console.log('⚠️ Cart is empty. Items:', items);
    return (
      <div className="cart-empty">
        <h2>Your Cart is Empty</h2>
        <p>Add some products to your cart to get started!</p>
        <button onClick={() => navigate('/')} className="btn-continue">Continue Shopping</button>
      </div>
    );
  }

  const handleRemove = async (productId) => {
    try {
      await removeFromCart(productId);
    } catch (err) {
      alert(`Error removing item: ${err.message}`);
    }
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setUpdatingId(productId);
    try {
      await updateCartItem(productId, newQuantity);
    } catch (err) {
      alert(`Error updating quantity: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="cart-page">
      <div className="container">
        <h1>Shopping Cart</h1>

        <div className="cart-content">
          {/* Cart Items */}
          <div className="cart-items">
            <div className="items-header">
              <span>Product</span>
              <span>Price</span>
              <span>Quantity</span>
              <span>Total</span>
              <span>Action</span>
            </div>

            {items.map(item => (
              <div key={item.productId} className="cart-item">
                <div className="item-product">
                  {item.productImage && (
                    <img src={item.productImage} alt={item.productName} />
                  )}
                  <div className="product-info">
                    <h4>{item.productName}</h4>
                    <p>Product ID: {item.productId}</p>
                  </div>
                </div>

                <div className="item-price">
                  ₹{item.price.toLocaleString()}
                </div>

                <div className="item-quantity">
                  <button
                    onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                    disabled={updatingId === item.productId}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.productId, parseInt(e.target.value))}
                    disabled={updatingId === item.productId}
                  />
                  <button
                    onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                    disabled={updatingId === item.productId}
                  >
                    +
                  </button>
                </div>

                <div className="item-total">
                  ₹{(item.price * item.quantity).toLocaleString()}
                </div>

                <button
                  className="btn-remove"
                  onClick={() => handleRemove(item.productId)}
                  disabled={updatingId === item.productId}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="cart-summary">
            <h3>Order Summary</h3>

            <div className="summary-row">
              <span>Subtotal ({totalItems} items)</span>
              <span>₹{totalPrice.toLocaleString()}</span>
            </div>

            <div className="summary-row">
              <span>Shipping</span>
              <span>FREE</span>
            </div>

            <div className="summary-row">
              <span>Tax</span>
              <span>Calculated at checkout</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-total">
              <span>Total</span>
              <span>₹{totalPrice.toLocaleString()}</span>
            </div>

            <button className="btn-checkout" onClick={() => navigate('/checkout')}>
              Proceed to Checkout
            </button>

            <button className="btn-continue-shopping" onClick={() => navigate('/')}>
              Continue Shopping
            </button>

            <div className="security-badges">
              <span>🔒 Secure Checkout</span>
              <span>✓ Verified Products</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
