import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  const navigate = useNavigate();

  const handleFeatureClick = (route) => {
    navigate(route);
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-section">
              <h4>ABOUT</h4>
              <ul>
                <li><button className="footer-link" onClick={() => handleFeatureClick('/help')}>Contact Us</button></li>
                <li><button className="footer-link" onClick={() => alert('About Us page coming soon!')}>About Us</button></li>
                <li><button className="footer-link" onClick={() => alert('Careers page coming soon!')}>Careers</button></li>
                <li><button className="footer-link" onClick={() => alert('Press page coming soon!')}>Press</button></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>HELP</h4>
              <ul>
                <li><button className="footer-link" onClick={() => handleFeatureClick('/help')}>Payments</button></li>
                <li><button className="footer-link" onClick={() => handleFeatureClick('/help')}>Shipping</button></li>
                <li><button className="footer-link" onClick={() => handleFeatureClick('/help')}>Cancellations & Returns</button></li>
                <li><button className="footer-link" onClick={() => handleFeatureClick('/help')}>FAQ</button></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>POLICY</h4>
              <ul>
                <li><button className="footer-link" onClick={() => handleFeatureClick('/help')}>Return Policy</button></li>
                <li><button className="footer-link" onClick={() => alert('Terms of Use coming soon!')}>Terms of Use</button></li>
                <li><button className="footer-link" onClick={() => alert('Security page coming soon!')}>Security</button></li>
                <li><button className="footer-link" onClick={() => alert('Privacy page coming soon!')}>Privacy</button></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>SOCIAL</h4>
              <ul>
                <li><button className="footer-link" onClick={() => alert('Follow us on Facebook!')}>Facebook</button></li>
                <li><button className="footer-link" onClick={() => alert('Subscribe on YouTube!')}>YouTube</button></li>
                <li><button className="footer-link" onClick={() => alert('Follow us on Twitter!')}>Twitter</button></li>
                <li><button className="footer-link" onClick={() => alert('Follow us on Instagram!')}>Instagram</button></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <div className="footer-features">
            <button className="feature-item" onClick={() => handleFeatureClick('/become-seller')}>
              <div className="feature-icon">💰</div>
              <div className="feature-text">Become a Seller</div>
            </button>
            <button className="feature-item" onClick={() => handleFeatureClick('/agent-rewards')}>
              <div className="feature-icon">🎁</div>
              <div className="feature-text">Agent Rewards</div>
            </button>
            <button className="feature-item" onClick={() => handleFeatureClick('/help')}>
              <div className="feature-icon">❓</div>
              <div className="feature-text">Help Center</div>
            </button>
          </div>

          <p className="footer-copyright">© 2024 SalonPro Marketplace. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
