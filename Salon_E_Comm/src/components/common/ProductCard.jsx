import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { getAuthToken } from '../../utils/apiClient';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddCart = async (e) => {
    e.stopPropagation();
    
    if (!getAuthToken()) {
      alert('Please login to add items to cart');
      navigate('/login');
      return;
    }

    let productId = product._id || product.id;
    
    if (!productId) {
      alert('Product ID is missing');
      return;
    }

    // Convert numeric IDs to slug format (1 -> "product-1")
    if (typeof productId === 'number') {
      productId = `product-${productId}`;
    }

    setIsAdding(true);
    try {
      await addToCart(productId, 1);
      alert(`✓ ${product.name} added to cart!`);
    } catch (err) {
      console.error('Add to cart error:', err);
      alert(`Failed to add to cart: ${err.message}`);
    } finally {
      setIsAdding(false);
    }
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    console.log('Wishlist toggled:', product.name);
    alert(`${isWishlisted ? 'Removed from' : 'Added to'} wishlist`);
  };

  const handleProductClick = () => {
    // Use _id from API products, or id from mock data
    const productId = product._id || product.id || 1;
    navigate(`/product/${productId}`);
  };

  const imgPlaceholder = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400'><rect width='100%' height='100%' fill='%23f3f4f6'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-size='22'>Image unavailable</text></svg>";

  return (
    <div className="product-card" key={product._id || product.id}>
      <div className="product-image-wrapper" onClick={handleProductClick}>
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
          onError={(e) => { e.target.onerror = null; e.target.src = imgPlaceholder; }}
        />

        {product.badge && (
          <div className="product-badge">{product.badge}</div>
        )}

        {discount > 0 && (
          <div className="product-discount">-{discount}%</div>
        )}

        {typeof product.inventoryCount !== 'undefined' && product.inventoryCount <= 0 && (
          <div className="product-stock out">Out of stock</div>
        )}

        <div className="product-image-actions" aria-hidden>
          <button className="action-btn view" onClick={(e) => { e.stopPropagation(); handleProductClick(); }}>View</button>
          <button className="action-btn add" onClick={(e) => { e.stopPropagation(); handleAddCart(e); }}>{isAdding ? 'Adding...' : 'Add'}</button>
        </div>

        <button className="product-wishlist" onClick={handleWishlist} aria-label="Wishlist">
          {isWishlisted ? '♥' : '♡'}
        </button>
      </div>
      
      <div className="product-info">
        <p className="product-category">{product.category}</p>
        <h3 className="product-name" onClick={handleProductClick}>{product.name}</h3>
        
        <div className="product-rating">
          <span className="stars">★★★★★</span>
          <span className="rating-value">{product.rating}</span>
          <span className="reviews">({product.reviews})</span>
        </div>

        <div className="product-price">
          <span className="price">₹{product.price.toLocaleString()}</span>
          {product.originalPrice && (
            <span className="original-price">₹{product.originalPrice.toLocaleString()}</span>
          )}
        </div>

        <button className="btn-add-cart" onClick={handleAddCart} disabled={isAdding}>
          {isAdding ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
