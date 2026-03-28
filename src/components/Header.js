import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext'; // Import useAuth hook
import SearchBar from './SearchBar';
import './Header.css';

const Header = () => {
  const { getTotalItems } = useCart();
  const { user, loading, logout } = useAuth(); // Get user and logout from auth context

  const handleLogout = () => {
    console.log('[Header] Logout button clicked');
    logout();
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-section">
          <Link to="/">
            <h1>My Store</h1>
          </Link>
        </div>
        
        <nav className="navigation">
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/categories">Categories</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </nav>
        
        <div className="header-actions">
          <div className="search-bar">
            <SearchBar />
          </div>
          
          <div className="user-actions">
            <Link to="/cart" className="cart-link">
              🛒 Cart (<span className="cart-count">{getTotalItems()}</span>)
            </Link>
            
            {user ? (
              // Show user profile and logout when logged in
              <div className="user-menu">
                <Link to="/profile" className="account-link">
                  👤 {user.name || user.email}
                </Link>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            ) : (
              // Show login/register links when not logged in
              <div className="auth-links">
                <Link to="/login" className="login-link">
                  Login
                </Link>
                <Link to="/register" className="register-link">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;