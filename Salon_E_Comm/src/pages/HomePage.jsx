import React, { useState, useEffect } from 'react';
import ProductCard from '../components/common/ProductCard';
import CategoryCard from '../components/common/CategoryCard';
import { productAPI, categoryAPI } from '../utils/apiClient';
import './HomePage.css';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch products from API
  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('[HomePage] Fetching products from API...');
      const apiProducts = await productAPI.getAll({ status: 'ACTIVE' });
      console.log('[HomePage] API returned:', apiProducts);

      if (Array.isArray(apiProducts)) {
        setProducts(apiProducts);
        setTrendingProducts(apiProducts.slice(0, 6));
        if (apiProducts.length === 0) {
          setError('No products available');
        }
      } else {
        setError('Invalid product data from server');
        setProducts([]);
        setTrendingProducts([]);
      }
    } catch (err) {
      console.error('[HomePage] Failed to fetch from API:', err.message);
      setError('Failed to load products');
      setProducts([]);
      setTrendingProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // Load categories from backend
    const loadCategories = async () => {
      try {
        const cats = await categoryAPI.getAll();
        setCategories(Array.isArray(cats) ? cats : []);
      } catch (err) {
        console.error('[HomePage] Failed to load categories from API', err.message || err);
        // fallback to empty list (or keep previously hardcoded data) - do not show dummy categories
        setCategories([]);
      }
    };
    loadCategories();

    const handler = () => fetchProducts();
    window.addEventListener('productsUpdated', handler);
    return () => window.removeEventListener('productsUpdated', handler);
  }, []);



  const handleShopRange = () => {
    console.log('Shop the range clicked');
    alert('Opening product range...');
  };



  return (
    <>
      {/* Hero Banner */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">B2B EXCLUSIVE</div>
          <h1 className="hero-title">Upgrade Your Salon.</h1>
          <p className="hero-description">
            Get up to 40% discount on L'Oreal and Dyson professional range for licensed salon owners.
          </p>
          <button className="btn-hero" onClick={handleShopRange}>SHOP THE RANGE</button>
        </div>
        <div className="hero-image">
          <img
            src="https://orchidlifesciences.com/wp-content/uploads/2024/06/01-14-01-1024x704.jpg"
            alt="Salon Products"
            className="hero-img"
          />
          <div className="hero-image-overlay" />
        </div>
      </section>

      {/* Promo Banner */}
      <section
        className="home-banner"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1506619216599-9d16a6b01fe6?w=1600&h=420&fit=crop')" }}
      >
        <div className="home-banner-overlay" />
        <div className="home-banner-content">
          <h2>Professional Salon Essentials</h2>
          <p>Exclusive offers for licensed salon owners — bulk pricing on premium brands.</p>
          <button className="btn-hero" onClick={handleShopRange}>Shop Now</button>
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <div className="categories-grid">
            {categories.map(category => (
              <CategoryCard key={category._id} category={category} />
            ))}
          </div>
        </div>
      </section>



      {/* Trending Products */}
      <section className="trending-section">
        <div className="container">
          <h2 className="section-title">Trending in Salon Supplies</h2>
              {error && <p className="error" style={{ color: 'var(--danger)', marginBottom: 10 }}>{error}</p>}
          <div className="products-grid">
            {trendingProducts.map(product => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">FAST</div>
              <h3>Fast Delivery</h3>
              <p>Quick and reliable delivery to your doorstep</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">SAFE</div>
              <h3>Secure Payments</h3>
              <p>100% secure transactions with multiple payment options</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">REAL</div>
              <h3>Authentic Products</h3>
              <p>Guaranteed genuine professional products</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">HELP</div>
              <h3>Expert Support</h3>
              <p>24/7 customer support from industry experts</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
