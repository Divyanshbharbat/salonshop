import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI, paymentAPI, getAuthToken, userAPI } from '../utils/apiClient';
import { useCart } from '../context/CartContext';
import './CheckoutPage.css';

export default function CheckoutPage() {
  const [shippingMethod, setShippingMethod] = useState('default');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [agentId, setAgentId] = useState('');
  const [agents, setAgents] = useState([]);
  const [agentVerified, setAgentVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shippingAddress, setShippingAddress] = useState({ name: '', street: '', city: '', state: '', zip: '', phone: '' });
  const navigate = useNavigate();
  const { items: cartItems, getCartTotal, clearCart } = useCart();
  const { totalPrice } = getCartTotal();

  // Use cart items or mock data as fallback
  const displayItems = cartItems && cartItems.length > 0 ? cartItems : [
    { productName: 'Professional Argan Oil 100ml', quantity: 2, price: 4200, productImage: 'https://images.unsplash.com/photo-1585110396000-c9ffd4d4b35c?w=100&h=100&fit=crop' },
    { productName: 'Deep Hydration Mask 500ml', quantity: 1, price: 6850, productImage: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=100&h=100&fit=crop' }
  ];

  const subtotal = totalPrice || 11050;
  const discount = -Math.round(subtotal * 0.10); // 10% discount
  const tax = Math.round(subtotal * 0.18); // 18% tax
  const shipping = 0;
  const total = subtotal + discount + tax + shipping;

  useEffect(() => {
    // Fetch active agents for dropdown (public endpoint)
    const fetchAgents = async () => {
      try {
        const list = await userAPI.getAgents();
        setAgents(list || []);
      } catch (err) {
        console.warn('Failed to load agents', err);
      }
    };
    fetchAgents();
  }, []);

  const handleVerifyAgent = () => {
    if (agentId) {
      const selected = agents.find(a => a._id === agentId);
      if (selected) {
        alert(`Agent ${selected.firstName} ${selected.lastName} verified successfully!`);
        setAgentVerified(true);
        return;
      }
    }
    alert('Please select a valid Agent');
  };

  // Load external script helper
  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const handlePlaceOrder = async () => {
    if (!getAuthToken()) {
      alert('Please login to place an order');
      navigate('/login');
      return;
    }

    if (displayItems.length === 0) {
      alert('Your cart is empty. Please add items before placing an order.');
      navigate('/');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Basic validation for shipping address
      if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.zip) {
        setError('Please fill the shipping address (street, city, zip)');
        setLoading(false);
        return;
      }

      const orderData = {
        items: displayItems.map(item => ({
          name: item.productName || item.name,
          quantity: item.quantity,
          price: item.price,
          productId: item.productId
        })),
        subtotal,
        discount,
        tax,
        shipping,
        total,
        shippingAddress,
        paymentMethod,
        shippingMethod,
        agentId: agentId || null,
        status: 'PENDING'
      };

      // Create internal order first
      const createdOrder = await orderAPI.create(orderData);
      if (!createdOrder || !createdOrder._id) {
        throw new Error('Failed to create order on server');
      }

      // If payment method is COD, finish immediately
      if (paymentMethod === 'cod') {
        try { await clearCart(); } catch (clearErr) { console.warn('Failed to clear cart:', clearErr); }
        alert('Order placed successfully! Your order has been confirmed.');
        setTimeout(() => navigate('/my-orders'), 2000);
        return;
      }

      // Online payment via Razorpay
      setPaymentProcessing(true);
      // Ask backend for a Razorpay order (this returns the gateway order id)
      const razorOrder = await paymentAPI.createRazorpayOrder(total, createdOrder._id, 'INR');

      // Load Razorpay checkout script
      const loaded = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      if (!loaded) {
        throw new Error('Failed to load Razorpay SDK');
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || window?.__RAZORPAY_KEY_ID || '',
        amount: razorOrder.amount,
        currency: razorOrder.currency,
        name: 'SalonPro',
        description: `Order ${createdOrder.orderNumber}`,
        order_id: razorOrder.id,
        handler: async function (response) {
          try {
            const verifyRes = await paymentAPI.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: createdOrder._id
            });

            if (verifyRes && verifyRes.status === 'success') {
              try { await clearCart(); } catch (clearErr) { console.warn('Failed to clear cart:', clearErr); }
              alert('Payment successful! Thank you.');
              setTimeout(() => navigate('/my-orders'), 1200);
            } else {
              alert('Payment verification failed. Please contact support.');
            }
          } catch (err) {
            console.error('Verification error', err);
            alert('Payment verification failed: ' + (err.message || 'Unknown error'));
          } finally {
            setPaymentProcessing(false);
          }
        },
        prefill: {
          name: '',
          email: ''
        },
        notes: { orderId: createdOrder._id },
        theme: { color: '#F37254' }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        console.error('Payment failed', response);
        alert('Payment failed: ' + (response.error?.description || 'Unknown error'));
        setPaymentProcessing(false);
      });

      rzp.open();

    } catch (err) {
      setError(err.message || 'Failed to place order. Please try again.');
      console.error('Order placement error:', err);
      setPaymentProcessing(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="container">
          <div className="checkout-header">
            <h1>Checkout & Tagging</h1>
            <p>Finalize your professional order and ensure agent attribution for commissions.</p>
          </div>

          <div className="checkout-grid">
            {/* Left Section */}
            <div className="checkout-form">
              {/* Shipping Address */}
              <div className="form-section">
                <div className="section-header">
                  <span className="section-number">1</span>
                  <h2>Shipping Address</h2>
                </div>

                <div className="shipping-form">
                  <input type="text" placeholder="Recipient name" value={shippingAddress.name || ''} onChange={e => setShippingAddress(s => ({ ...s, name: e.target.value }))} />
                  <input type="text" placeholder="Street address" value={shippingAddress.street || ''} onChange={e => setShippingAddress(s => ({ ...s, street: e.target.value }))} />
                  <div className="form-row">
                    <input type="text" placeholder="City" value={shippingAddress.city || ''} onChange={e => setShippingAddress(s => ({ ...s, city: e.target.value }))} />
                    <input type="text" placeholder="State" value={shippingAddress.state || ''} onChange={e => setShippingAddress(s => ({ ...s, state: e.target.value }))} />
                  </div>
                  <div className="form-row">
                    <input type="text" placeholder="ZIP / PIN" value={shippingAddress.zip || ''} onChange={e => setShippingAddress(s => ({ ...s, zip: e.target.value }))} />
                    <input type="tel" placeholder="Phone" value={shippingAddress.phone || ''} onChange={e => setShippingAddress(s => ({ ...s, phone: e.target.value }))} />
                  </div>
                </div>
              </div>

              {/* Agent Attribution */}
              <div className="form-section">
                <div className="section-header">
                  <span className="section-number">2</span>
                  <h2>Agent Attribution</h2>
                </div>

                <p className="section-description">
                  Was this sale assisted by a Salon Agent? Enter their ID to ensure they receive commission.
                </p>

                <div className="agent-input-group">
                  <select value={agentId} onChange={(e) => { setAgentId(e.target.value); setAgentVerified(false); }} className="agent-input">
                    <option value="">— Select Agent (optional) —</option>
                    {agents.map(a => (
                      <option key={a._id} value={a._id}>{a.firstName} {a.lastName} — {a.email}</option>
                    ))}
                  </select>
                  <button className="verify-btn" onClick={handleVerifyAgent} disabled={!agentId}>Verify</button>
                </div>

                {agentVerified && (
                  <div className="agent-verified">
                    <span className="check">✓</span>
                    <span className="verified-text">Agent Verified: {agents.find(a => a._id === agentId)?.firstName || ''} {agents.find(a => a._id === agentId)?.lastName || ''}</span>
                    <span className="tier">Commission Tier • {agents.find(a => a._id === agentId)?.agentProfile?.commissionRate || 0}%</span>
                    <button className="change-btn" onClick={() => { setAgentId(''); setAgentVerified(false); }}>Change</button>
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="form-section">
                <div className="section-header">
                  <span className="section-number">3</span>
                  <h2>Payment Method</h2>
                </div>

                <div className="payment-options">
                  <label className="payment-option">
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={paymentMethod === 'upi'}
                      onChange={() => setPaymentMethod('upi')}
                    />
                    <span className="payment-icon">💳</span>
                    <span className="payment-text">UPI (GPay, PhonePe, Paytm)</span>
                  </label>

                  <label className="payment-option">
                    <input 
                      type="radio" 
                      name="payment"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                    />
                    <span className="payment-icon">💰</span>
                    <span className="payment-text">Credit / Debit Cards</span>
                  </label>

                  <label className="payment-option">
                    <input 
                      type="radio" 
                      name="payment"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                    />
                    <span className="payment-icon">📦</span>
                    <span className="payment-text">Cash on Delivery</span>
                  </label>
                </div>
              </div>

              <div className="form-section">
                <p className="terms">
                  By placing order, you agree to SalonPro Terms of Service and Refund Policy
                </p>
              </div>
            </div>

            {/* Right Section - Order Summary */}
            <div className="order-summary">
              <div className="summary-card">
                <h3>Order Summary</h3>
                <span className="item-count">{displayItems.length} items</span>

                <div className="items-list">
                  {displayItems.map((item, idx) => (
                    <div key={idx} className="summary-item">
                      <img src={item.productImage || item.image} alt={item.productName || item.name} />
                      <div className="item-details">
                        <p className="item-name">{item.productName || item.name}</p>
                        <p className="item-qty">Qty: {item.quantity} x ₹{Math.round(item.price / item.quantity)}</p>
                      </div>
                      <span className="item-price">₹{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="summary-divider"></div>

                <div className="summary-row">
                  <span>Bag Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>

                <div className="summary-row">
                  <span>B2B Volume Discount</span>
                  <span className="discount-amount">₹{Math.abs(discount).toLocaleString()}</span>
                </div>

                <div className="summary-row">
                  <span>Tax (IGST @ 18%)</span>
                  <span>₹{tax.toLocaleString()}</span>
                </div>

                <div className="summary-row">
                  <span>Shipping (Express)</span>
                  <span className={shipping === 0 ? 'free' : ''}>
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </span>
                </div>

                <div className="summary-divider"></div>

                <div className="total-row">
                  <span>TOTAL PAYABLE</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>

                <div className="promo-tip">
                  <span>💡</span>
                  <span>Pro Tip: Add 8 more items to unlock "Wholesale" discount of 5%</span>
                </div>

                {error && <div className="error-message" style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
                
                <button 
                  className="btn-place-order" 
                  onClick={handlePlaceOrder}
                  disabled={loading || (!agentVerified && agentId === '')}
                >
                  {loading ? 'Processing...' : 'PLACE ORDER NOW'}
                </button>

                <div className="security-note">
                  <span>🔒</span>
                  <span>You saved ₹1,105.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
