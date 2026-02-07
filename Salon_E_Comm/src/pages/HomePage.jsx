import React, { useState, useEffect } from 'react';
import ProductCard from '../components/common/ProductCard';
import CategoryCard from '../components/common/CategoryCard';
import { productAPI, categoryAPI } from '../utils/apiClient';
import { Button } from '../components/ui/button';
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
      {/* add a badge here with primary border and rpimary/20 bg sayi8ng "Trusted by 10,000+ salons" and a blue dot before text that pings every few sec, tailwind animate ping class. */}
      <div className="mx-auto w-fit flex items-center gap-2 px-3 py-1 rounded-full border border-(--primary-color) bg-(--primary-color)/20 mt-2 md:mt-8">
        <div className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-(--primary-color) opacity-75 duration-1000"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-(--primary-color)"></span>
        </div>
        <span className="text-sm font-medium text-(--primary-color)">Trusted by 10,000+ salons</span>
      </div>

      {/* Hero Banner */}
      <section className="relative grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-10 items-center pt-2 md:py-10 w-screen md:max-w-7xl mx-auto overflow-hidden px-4 md:px-0 bg-transparent">
        {/* Background Banner */}
        <div className="absolute top-[10%] bottom-[10%] left-0 right-[-15%] bg-linear-to-br from-[#0066cc]/25 to-[#00a8cc]/8 rounded-[60px] -z-10 md:transform-[perspective(1500px)_rotateY(12deg)] origin-left pointer-events-none shadow-[0_30px_60px_rgba(0,102,204,0.08)] hidden md:block" />

        <div className="w-full md:w-auto order-2 md:order-1 relative z-10 px-4 md:pl-20 md:transform-[perspective(1500px)_rotateY(12deg)] origin-left ">
          <div className="inline-block bg-linear-to-r from-[#0066cc] to-[#00a8cc] bg-clip-text text-transparent px-3.5 py-2 rounded font-extrabold text-[11px] uppercase md:mb-5 tracking-widest border border-[#0066cc]/20">B2B EXCLUSIVE</div>
          <h1 className="text-4xl md:text-5xl lg:text-[68px] font-extrabold text-neutral-900 leading-[1.15] tracking-tight">Upgrade Your Salon.</h1>
          <p className="text-base text-neutral-700 leading-tight font-medium max-w-lg">
            Exclusive B2B pricing on trusted salon brands. <br />
            Save more with bulk deals, fast delivery, and verified quality.
          </p>
          <div className="w-full flex flex-col md:flex-row flex-wrap gap-2 md:gap-4 mt-4">
            <Button size="lg" className="px-10" onClick={handleShopRange}>
              SHOP THE RANGE
            </Button>
            <Button variant="outline" size="lg" className="px-6 border-(--primary-color) text-(--primary-color) hover:bg-(--primary-color)/10">
              Verify as Salon Owner
            </Button>
          </div>
        </div>

        <div className="order-1 md:order-2 relative z-10 overflow-hidden rounded-xl shadow-2xl aspect-4/3 md:aspect-auto md:h-[400px] flex items-center md:transform-[perspective(1500px)_rotateY(-12deg)] origin-right">
          <img
            src="https://orchidlifesciences.com/wp-content/uploads/2024/06/01-14-01-1024x704.jpg"
            alt="Salon Products"
            className="w-full h-full object-cover block rounded-xl"
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/18 to-black/8 pointer-events-none rounded-xl" />
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
