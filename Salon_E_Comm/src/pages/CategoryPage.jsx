import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/common/ProductCard';
import { productAPI } from '../utils/apiClient';
import './CategoryPage.css';

export default function CategoryPage() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      setLoading(true);
      try {
        const res = await productAPI.getAll({ category });
        const list = Array.isArray(res) ? res : [];
        const filtered = list.filter(p => (p.category || '').toLowerCase() === (category || '').toLowerCase());
        setProducts(filtered);
      } catch (err) {
        console.error('Failed to load category products', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [category]);

  return (
    <div className="category-page">
      <div className="category-header">
        <div className="container">
          <h1 className="category-title">{category}</h1>
          <p className="category-count">{products.length} products found</p>
        </div>
      </div>

      <div className="container">
        {loading ? (
          <div className="loading">Loading products...</div>
        ) : products.length > 0 ? (
          <div className="products-grid">
            {products.map(product => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="no-products">
            <p>No products found in {category}</p>
            <p>Browse other categories or check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
