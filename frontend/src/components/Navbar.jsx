import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, isLoggedIn, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>

        {/* ── Brand ── */}
        <Link to="/" style={styles.brand}>
          ShopNest
        </Link>

        {/* ── Nav Links ── */}
        <div style={styles.links}>
          <Link to="/" style={styles.link}>Products</Link>

          {/* Cart icon with count badge */}
          <Link to="/cart" style={styles.cartLink}>
            🛒
            {cartCount > 0 && (
              <span style={styles.badge}>{cartCount}</span>
            )}
          </Link>

          {isLoggedIn ? (
            <>
              {/* Show admin link if user is admin */}
              {isAdmin && (
                <Link to="/admin" style={styles.link}>
                  Dashboard
                </Link>
              )}
              <Link to="/orders" style={styles.link}>
                My Orders
              </Link>
              {/* FIXED LINE HERE: Added optional chaining and safe fallback */}
              <span style={styles.userName}>Hi, {user?.name?.split(' ')[0] || 'User'}</span>
              <button onClick={handleLogout} style={styles.logoutBtn}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.link}>Login</Link>
              <Link to="/register" style={styles.registerBtn}>
                Register
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
};

const styles = {
  nav: {
    backgroundColor: 'var(--white)',
    borderBottom: '1px solid var(--border)',
    boxShadow: 'var(--shadow)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '0 1.5rem',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    fontSize: '1.4rem',
    fontWeight: '700',
    color: 'var(--primary)',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.2rem',
  },
  link: {
    color: 'var(--text)',
    fontSize: '0.95rem',
    fontWeight: '500',
    transition: 'color 0.2s',
  },
  cartLink: {
    position: 'relative',
    fontSize: '1.3rem',
  },
  badge: {
    position: 'absolute',
    top: '-8px',
    right: '-10px',
    backgroundColor: 'var(--danger)',
    color: 'var(--white)',
    borderRadius: '50%',
    width: '18px',
    height: '18px',
    fontSize: '0.65rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
  },
  userName: {
    fontSize: '0.9rem',
    color: 'var(--text-light)',
  },
  logoutBtn: {
    backgroundColor: 'transparent',
    color: 'var(--danger)',
    fontSize: '0.9rem',
    fontWeight: '500',
    padding: '0.3rem 0.8rem',
    border: '1px solid var(--danger)',
    borderRadius: 'var(--radius)',
  },
  registerBtn: {
    backgroundColor: 'var(--primary)',
    color: 'var(--white)',
    padding: '0.4rem 1rem',
    borderRadius: 'var(--radius)',
    fontSize: '0.9rem',
    fontWeight: '500',
  },
};

export default Navbar;