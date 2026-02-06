import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { productAPI, getAuthToken } from "../utils/apiClient";
import { useCart } from "../context/CartContext";
import "./ProductDetailPage.css";


export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [selectedBulk, setSelectedBulk] = useState(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addingToCart, setAddingToCart] = useState(false);

  // Load product from API
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError('');
      try {
        console.log('[ProductDetailPage] Fetching product with ID:', id);
        
        // Try to fetch from API first
        const apiProduct = await productAPI.getById(id);
        
        console.log('[ProductDetailPage] API returned:', apiProduct);
        
        if (apiProduct) {
          setProduct({
            ...apiProduct,
            description: apiProduct.description || `Premium ${apiProduct.name} for professional use`,
            ingredients: apiProduct.ingredients || [
              "Premium ingredients",
              "Professional grade",
              "Long-lasting formula",
            ],
            technicalSpecs: apiProduct.technicalSpecs || [
              "Professional quality",
              "High performance",
              "Best in class",
            ],
            bulkOptions: apiProduct.bulkOptions || [
              {
                units: "10 - 49 Units",
                price: Math.floor(apiProduct.price * 0.95),
                discount: "5% OFF",
              },
              {
                units: "50 - 99 Units",
                price: Math.floor(apiProduct.price * 0.85),
                discount: "15% OFF",
              },
              {
                units: "100+ Units",
                price: Math.floor(apiProduct.price * 0.75),
                discount: "Contact for Quote",
              },
            ],
            reviews_data: apiProduct.reviews_data || [
              {
                author: "Professional User",
                title: "VERIFIED BUYER",
                rating: 5,
                date: new Date().toLocaleDateString(),
                content: "Excellent product quality and service. Highly recommended!",
                verified: true,
              },
            ],
          });
        }
      } catch (err) {
        console.error('Failed to fetch product from API:', err.message);
        setError('Product not found or failed to load');
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!getAuthToken()) {
      alert('Please login to add items to cart');
      navigate('/login');
      return;
    }

    if (!product) {
      alert('Product not found');
      return;
    }

    // Use _id from API, fallback to id from mock data
    const productId = product._id || product.id?.toString();
    
    if (!productId) {
      alert('Product ID is missing');
      return;
    }

    console.log('Adding to cart:', { productId, quantity, product: product.name });

    setAddingToCart(true);
    try {
      const result = await addToCart(productId, quantity);
      console.log('Add to cart result:', result);
      alert(`✓ Added ${quantity} × ${product.name} to your cart!`);
      setQuantity(1);
    } catch (err) {
      console.error('Add to cart failed:', err);
      alert(`Failed to add to cart: ${err.message}`);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = () => {
    alert(`Proceeding to checkout with ${quantity} item(s)`);
  };

  if (loading) {
    return <h2 style={{ textAlign: "center", marginTop: "50px" }}>Loading...</h2>;
  }

  if (error) {
    return <h2 style={{ textAlign: "center", color: "red", marginTop: "50px" }}>{error}</h2>;
  }

  return (
    <div className="product-detail">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <span>Home</span> / <span>{product.category}</span> / <span>{product.name}</span>
        </div>

        {/* Main Product Section */}
        <div className="product-main">
          {/* Image Gallery */}
          <div className="product-gallery">
            <img src={product.image} alt={product.name} />
          </div>

          {/* Product Info */}
          <div className="product-info">
            <div className="badges">
              <span className="badge">{product.badge}</span>
              {product.category && <span className="badge">{product.category}</span>}
            </div>

            <h1>{product.name}</h1>

            <div className="rating-section">
              <span>{"★".repeat(Math.round(product.rating))}</span>
              <span>({product.reviews} reviews)</span>
            </div>

            <div className="price-display">
              <span className="price">₹{product.price}</span>
              {product.originalPrice > 0 && (
                <>
                  <span className="original">₹{product.originalPrice}</span>
                  <span className="discount">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="quantity-section">
              <label>Quantity</label>
              <div className="quantity-box">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                <input type="number" value={quantity} readOnly />
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>

            {/* Bulk Purchase Options */}
            <div className="bulk-section">
              <h4>Bulk Purchase Tips</h4>
              <div className="bulk-options">
                {product.bulkOptions.map((option, idx) => (
                  <div
                    key={idx}
                    className={`bulk-card ${selectedBulk === idx ? "selected" : ""}`}
                    onClick={() => setSelectedBulk(idx)}
                  >
                    <h4>{option.units}</h4>
                    <p>₹{option.price}</p>
                    <small>{option.discount}</small>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <button 
                onClick={handleAddToCart}
                disabled={addingToCart}
                style={{opacity: addingToCart ? 0.6 : 1}}
              >
                {addingToCart ? 'Adding...' : 'Add to Cart'}
              </button>
              <button onClick={handleBuyNow}>Buy Now</button>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="details-section">
          <h3>About the Product</h3>
          <p>{product.description}</p>

          <div className="specs-grid">
            <div>
              <h4>Ingredients</h4>
              <ul>
                {product.ingredients.map((ingredient, idx) => (
                  <li key={idx}>{ingredient}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4>Technical Specs</h4>
              <ul>
                {product.technicalSpecs.map((spec, idx) => (
                  <li key={idx}>{spec}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Reviews Section */}
          <h3 style={{ marginTop: "40px" }}>Customer Reviews</h3>
          <div className="reviews-list">
            {product.reviews_data.map((review, idx) => (
              <div key={idx} className="review-card">
                <strong>{review.author}</strong>
                <div>{"★".repeat(review.rating)}</div>
                <p>{review.content}</p>
                <small>{review.date}</small>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
