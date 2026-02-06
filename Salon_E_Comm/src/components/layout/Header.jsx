import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { getAuthToken, removeAuthToken, categoryAPI } from '../../utils/apiClient';
import './Header.css';

export default function Header() {
  const navigate = useNavigate();
  const { getCartTotal } = useCart();
  const { totalItems } = getCartTotal();
  const [searchValue, setSearchValue] = useState('');
  const isLoggedIn = !!getAuthToken();

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const cats = await categoryAPI.getAll();
        setCategories(Array.isArray(cats) ? cats : []);
      } catch (err) {
        console.error('[Header] Failed to load categories', err.message || err);
      }
    };
    load();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      console.log('Searching for:', searchValue);
      alert(`Searching for products: "${searchValue}"`);
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    removeAuthToken();
    localStorage.removeItem('user');
    
    // Dispatch auth change event so CartContext clears
    window.dispatchEvent(new Event('authChange'));
    
    alert('Logged out successfully');
    navigate('/');
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  const handleBecomeAgent = () => {
    if (!isLoggedIn) {
      navigate('/signup');
    } else {
      navigate('/become-seller');
    }
  };

  const handleCart = () => {
    if (!isLoggedIn) {
      alert('Please login to view your cart');
      navigate('/login');
    } else {
      navigate('/cart');
    }
  };

  const handleHome = () => {
    navigate('/');
  };

  const handleCategoryClick = (category) => {
    navigate(`/category/${category}`);
  };

  return (
    <header className="header">
      <div className="header-top">
        <div className="container">
          <div className="header-top-content">
            <p className="header-promo">🎉 B2B EXCLUSIVE: Get up to 40% discount on professional ranges</p>
            <div className="header-top-links">
              <button className="header-link" onClick={handleBecomeAgent}>Become a Seller</button>
              <span className="separator">|</span>
              <button className="header-link" onClick={() => navigate('/help')}>Help Center</button>
            </div>
          </div>
        </div>
      </div>

      <div className="header-main">
        <div className="container">
          <div className="header-content">
            <div className="logo" onClick={handleHome} style={{ cursor: 'pointer' }}>
              <span className="logo-icon">S</span>
              <span className="logo-text">SalonPro</span>
            </div>

            <form className="search-bar" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search for professional products, brands and more"
                className="search-input"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <button type="submit" className="search-btn">🔍</button>
            </form>

            <div className="header-actions">
              {!isLoggedIn ? (
                <>
                  <button className="btn-login" onClick={handleLogin}>Login</button>
                  <button className="btn-signup" onClick={handleSignup}>Sign Up</button>
                </>
              ) : (
                <>
                  <button className="btn-login" onClick={() => navigate('/my-orders')}>📦 My Orders</button>
                  <button className="btn-login" onClick={handleLogout}>Logout</button>
                </>
              )}
              <button className="cart-icon" onClick={handleCart}>
                🛒
                {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
              </button>
              <button className="btn-menu">☰</button>
            </div>
          </div>
        </div>
      </div>

      <div className="header-nav">
        <div className="container">
          <nav className="navbar">
            {/* Categories are loaded from backend */}
            { (categories && categories.length > 0) ? (
              categories.map(c => (
                <button key={c._id} className="nav-item" onClick={() => handleCategoryClick(c.name)}>{c.name}</button>
              ))
            ) : (
              <div style={{ color: 'var(--muted)' }}>No categories</div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

