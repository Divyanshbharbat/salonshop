import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../utils/apiClient';
import './LoginPage.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('customer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.login(email, password);
      
      // Store user data and token
      localStorage.setItem('user', JSON.stringify(response));

      // Dispatch auth change event so CartContext can refetch
      window.dispatchEvent(new Event('authChange'));

      // Navigate based on user role from backend (fallback to selector)
      const role = response.role?.toUpperCase() || userType.toUpperCase();
      if (role === 'ADMIN') {
        navigate('/admin');
      } else if (role === 'AGENT') {
        navigate('/agent-dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>Welcome Back</h1>
            <p>Sign in to your SalonPro account</p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label>Login As</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="userType"
                    value="customer"
                    checked={userType === 'customer'}
                    onChange={(e) => setUserType(e.target.value)}
                  />
                  Customer
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="userType"
                    value="agent"
                    checked={userType === 'agent'}
                    onChange={(e) => setUserType(e.target.value)}
                  />
                  Agent
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="userType"
                    value="admin"
                    checked={userType === 'admin'}
                    onChange={(e) => setUserType(e.target.value)}
                  />
                  Admin
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label className="checkbox-label">
                <input type="checkbox" /> Remember me
              </label>
            </div>

            <button type="submit" className="btn-login-submit" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>

            <div className="login-footer">
              <p>Don't have an account? <button type="button" className="link-button" onClick={() => navigate('/signup')}>Sign Up</button></p>
              <p><button type="button" className="link-button" onClick={() => alert('Password reset coming soon')}>Forgot Password?</button></p>
            </div>
          </form>
        </div>

        <div className="login-benefits">
          <h3>Why Login?</h3>
          <ul>
            <li>Track your orders in real-time</li>
            <li>Access exclusive deals and offers</li>
            <li>Manage your wishlist</li>
            <li>Faster checkout process</li>
            <li>Earn rewards and commissions</li>
          </ul>
        </div>
      </div>
  );
}
