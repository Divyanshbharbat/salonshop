import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI, getAuthToken } from '../utils/apiClient';
import './MyOrdersPage.css';

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    if (!getAuthToken()) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      const response = await orderAPI.getMyOrders();
      console.log('📦 Orders fetched:', response);
      const ordersList = response && response.value ? response.value : (response || []);
      setOrders(ordersList);
      setError('');
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: '#FFA500',
      PAID: '#4CAF50',
      PROCESSING: '#2196F3',
      SHIPPED: '#9C27B0',
      DELIVERED: '#4CAF50',
      CANCELLED: '#F44336',
      REFUNDED: '#FF9800'
    };
    return colors[status] || '#757575';
  };

  const getPaymentStatusBadge = (paymentStatus) => {
    const badges = {
      UNPAID: { label: 'Unpaid', color: '#FF6B6B' },
      PAID: { label: 'Paid', color: '#4CAF50' },
      FAILED: { label: 'Failed', color: '#F44336' }
    };
    return badges[paymentStatus] || { label: paymentStatus, color: '#757575' };
  };

  if (loading) {
    return (
      <div className="my-orders-page">
        <div className="container">
          <h1>My Orders</h1>
          <p className="loading">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-orders-page">
        <div className="container">
          <h1>My Orders</h1>
          <div className="error-message">{error}</div>
          <button onClick={fetchOrders} className="retry-btn">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="my-orders-page">
      <div className="container">
        <div className="orders-header">
          <h1>My Orders</h1>
          <p className="order-count">{orders.length} order{orders.length !== 1 ? 's' : ''}</p>
        </div>

        {orders.length === 0 ? (
          <div className="empty-state">
            <p className="empty-icon">📦</p>
            <h2>No Orders Yet</h2>
            <p>You haven't placed any orders. Start shopping now!</p>
            <button className="shop-btn" onClick={() => navigate('/')}>
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>{order.orderNumber}</h3>
                    <p className="order-date">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="order-status">
                    <span 
                      className="status-badge" 
                      style={{ backgroundColor: getStatusColor(order.status) }}
                    >
                      {order.status}
                    </span>
                    <span 
                      className="payment-badge"
                      style={{ backgroundColor: getPaymentStatusBadge(order.paymentStatus).color }}
                    >
                      {getPaymentStatusBadge(order.paymentStatus).label}
                    </span>
                  </div>
                </div>

                <div className="order-summary">
                  <div className="summary-item">
                    <span className="label">Items:</span>
                    <span className="value">{order.items.length}</span>
                  </div>
                  <div className="summary-item">
                    <span className="label">Subtotal:</span>
                    <span className="value">₹{order.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="summary-item">
                    <span className="label">Tax:</span>
                    <span className="value">₹{Math.round(order.tax).toLocaleString()}</span>
                  </div>
                  <div className="summary-item">
                    <span className="label">Shipping:</span>
                    <span className="value">₹{order.shippingCost.toLocaleString()}</span>
                  </div>
                  <div className="summary-item total">
                    <span className="label">Total:</span>
                    <span className="value">₹{order.total.toLocaleString()}</span>
                  </div>
                </div>

                <div className="order-payment">
                  <span className="payment-method">
                    💳 {order.paymentMethod?.toUpperCase() || 'CARD'}
                  </span>
                </div>

                <button 
                  className="expand-btn"
                  onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                >
                  {expandedOrder === order._id ? '▼ Hide Details' : '▶ View Details'}
                </button>

                {expandedOrder === order._id && (
                  <div className="order-details">
                    <h4>Order Items:</h4>
                    <div className="items-list">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="item-row">
                          <div className="item-name">{item.name}</div>
                          <div className="item-qty">Qty: {item.quantity}</div>
                          <div className="item-price">₹{item.priceAtPurchase.toLocaleString()}</div>
                          <div className="item-total">
                            ₹{(item.priceAtPurchase * item.quantity).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>

                    <h4 style={{ marginTop: '20px' }}>Order Timeline:</h4>
                    <div className="timeline">
                      {order.timeline?.map((event, idx) => (
                        <div key={idx} className="timeline-event">
                          <span className="event-status">{event.status}</span>
                          <span className="event-date">
                            {new Date(event.timestamp).toLocaleDateString('en-IN')}
                          </span>
                          {event.note && <p className="event-note">{event.note}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
