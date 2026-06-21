import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, isLoggedIn, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [hoveredLink, setHoveredLink] = useState(null);
  const [logoutHovered, setLogoutHovered] = useState(false);
  const [registerHovered, setRegisterHovered] = useState(false);
  const [cartHovered, setCartHovered] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        .navbar {
          background: rgba(255, 255, 255, 0.72);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border-bottom: 1px solid rgba(153, 27, 27, 0.08);
          box-shadow: 0 1px 0 rgba(153,27,27,0.06), 0 4px 24px rgba(153,27,27,0.07);
          position: sticky;
          top: 0;
          z-index: 100;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          transition: box-shadow 0.3s ease;
        }

        .navbar-container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 1.5rem;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        /* ── Brand ── */
        .navbar-brand {
          font-size: 1.35rem;
          font-weight: 700;
          letter-spacing: -0.03em;
          color: var(--primary);
          text-decoration: none;
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          transition: opacity 0.2s ease;
        }
        .navbar-brand::before {
          content: '';
          display: inline-block;
          width: 8px;
          height: 8px;
          background: var(--primary);
          border-radius: 50%;
          box-shadow: 0 0 0 2px rgba(153,27,27,0.2);
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease;
        }
        .navbar-brand:hover::before {
          transform: scale(1.4);
          box-shadow: 0 0 0 4px rgba(153,27,27,0.15);
        }
        .navbar-brand:hover {
          opacity: 0.85;
        }

        /* ── Links wrapper ── */
        .navbar-links {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        /* ── Nav link ── */
        .nav-link {
          position: relative;
          color: var(--text);
          font-size: 0.875rem;
          font-weight: 500;
          text-decoration: none;
          padding: 0.45rem 0.75rem;
          border-radius: 8px;
          letter-spacing: -0.01em;
          transition: color 0.2s ease, background 0.2s ease;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 4px;
          left: 50%;
          transform: translateX(-50%) scaleX(0);
          width: calc(100% - 1.5rem);
          height: 2px;
          background: var(--primary);
          border-radius: 2px;
          transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1);
        }
        .nav-link:hover {
          color: var(--primary);
          background: rgba(153,27,27,0.05);
        }
        .nav-link:hover::after {
          transform: translateX(-50%) scaleX(1);
        }

        /* ── Cart ── */
        .cart-link {
          position: relative;
          font-size: 1.25rem;
          text-decoration: none;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          transition: background 0.2s ease, transform 0.2s cubic-bezier(0.34,1.56,0.64,1);
        }
        .cart-link:hover {
          background: rgba(153,27,27,0.08);
          transform: scale(1.1);
        }

        .cart-badge {
          position: absolute;
          top: 2px;
          right: 2px;
          background: var(--danger);
          color: var(--white);
          border-radius: 50%;
          width: 17px;
          height: 17px;
          font-size: 0.6rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          border: 2px solid rgba(255,255,255,0.9);
          animation: badgePop 0.3s cubic-bezier(0.34,1.56,0.64,1);
        }

        @keyframes badgePop {
          from { transform: scale(0); }
          to   { transform: scale(1); }
        }

        /* ── User greeting ── */
        .user-name {
          font-size: 0.825rem;
          font-weight: 500;
          color: var(--text-light);
          padding: 0 0.25rem;
          letter-spacing: -0.01em;
        }

        /* ── Logout button ── */
        .logout-btn {
          background: transparent;
          color: var(--danger);
          font-size: 0.85rem;
          font-weight: 500;
          padding: 0.4rem 0.9rem;
          border: 1.5px solid rgba(153,27,27,0.25);
          border-radius: 8px;
          font-family: 'Inter', inherit;
          letter-spacing: -0.01em;
          transition: background 0.2s ease, border-color 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
          cursor: pointer;
        }
        .logout-btn:hover {
          background: rgba(220, 38, 38, 0.06);
          border-color: var(--danger);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(220,38,38,0.15);
        }
        .logout-btn:active {
          transform: translateY(0);
          box-shadow: none;
        }

        /* ── Register button ── */
        .register-btn {
          background: var(--primary);
          color: var(--white);
          padding: 0.45rem 1.1rem;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          text-decoration: none;
          letter-spacing: -0.01em;
          position: relative;
          overflow: hidden;
          display: inline-flex;
          align-items: center;
          transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s ease;
        }
        .register-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        .register-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(153,27,27,0.35);
        }
        .register-btn:hover::before {
          opacity: 1;
        }
        .register-btn:active {
          transform: translateY(0);
          box-shadow: 0 2px 8px rgba(153,27,27,0.2);
        }

        /* ── Divider ── */
        .nav-divider {
          width: 1px;
          height: 18px;
          background: var(--border);
          margin: 0 0.25rem;
          opacity: 0.7;
        }
      `}</style>

      <nav className="navbar">
        <div className="navbar-container">

          {/* ── Brand ── */}
          <Link to="/" className="navbar-brand">
            ShopNest
          </Link>

          {/* ── Nav Links ── */}
          <div className="navbar-links">
            <Link to="/" className="nav-link">Products</Link>

            {/* Cart icon with animated badge */}
            <Link to="/cart" className="cart-link">
              🛒
              {cartCount > 0 && (
                <span className="cart-badge">{cartCount}</span>
              )}
            </Link>

            <div className="nav-divider" />

            {isLoggedIn ? (
              <>
                {isAdmin && (
                  <Link to="/admin" className="nav-link">Dashboard</Link>
                )}
                <Link to="/orders" className="nav-link">My Orders</Link>
                <span className="user-name">Hi, {user?.name?.split(' ')[0] || 'User'}</span>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/register" className="register-btn">
                  Register
                </Link>
              </>
            )}
          </div>

        </div>
      </nav>
    </>
  );
};

export default Navbar;