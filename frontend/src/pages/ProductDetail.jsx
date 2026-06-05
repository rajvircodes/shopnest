import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductDetail = () => {
  const { id } = useParams();           // extract :id from the URL
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);  // feedback state

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError('');
        const { data } = await API.get(`/products/${id}`);
        if (data && data.product) {
          setProduct(data.product);
        } else {
          setError('Product data structure could not be read.');
        }
      } catch (err) {
        console.error("Fetch product error:", err);
        // FIXED: Removed the invalid second argument from state setter
        setError(err.response?.data?.message || 'Product not found.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);    // re-fetch if URL id changes

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    if (product) {
      addToCart(product);
      // ── Show "Added!" feedback for 2 seconds ──
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  if (loading) {
    return (
      <div style={styles.centered}>
        <p style={styles.loadingText}>Loading product...</p>
      </div>
    );
  }

  // FIXED: Explicitly catch missing product values early to avoid rendering errors
  if (error || !product) {
    return (
      <div style={styles.centered}>
        <div style={{ textAlign: 'center' }}>
          <p style={styles.errorText}>{error || 'Product details are unavailable.'}</p>
          <button onClick={() => navigate(-1)} style={{ ...styles.backBtn, marginTop: '1rem', display: 'inline-block' }}>
            ← Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* ── Product Image ── */}
        <div style={styles.imageWrapper}>
          <img
            src={product?.image}
            alt={product?.name || "Product"}
            style={styles.image}
            onError={(e) => {
              e.target.src = 'https://placehold.co/600x400?text=No+Image';
            }}
          />
        </div>

        {/* ── Product Info ── */}
        <div style={styles.info}>
          <span style={styles.category}>{product?.category || 'General'}</span>
          <h1 style={styles.name}>{product?.name}</h1>
          
          {/* FIXED: Added defensive fallback pricing chain so toLocaleString() doesn't throw errors */}
          <p style={styles.price}>
            ₹{product?.price != null ? Number(product.price).toLocaleString('en-IN') : '0'}
          </p>
          
          <p style={styles.description}>{product?.description}</p>

          {/* ── Stock Status ── */}
          <div style={styles.stockRow}>
            <span style={styles.stockLabel}>Availability: </span>
            <span style={product?.stock > 0 ? styles.inStock : styles.outOfStock}>
              {product?.stock > 0 ? `In Stock (${product.stock} units)` : 'Out of Stock'}
            </span>
          </div>

          {/* ── Add to Cart ── */}
          <button
            onClick={handleAddToCart}
            disabled={!product || product.stock === 0}
            style={
              product?.stock === 0
                ? styles.btnDisabled
                : added
                ? styles.btnAdded
                : styles.btn
            }
          >
            {product?.stock === 0
              ? 'Out of Stock'
              : added
              ? '✓ Added to Cart!'
              : 'Add to Cart'}
          </button>

          {/* ── Back link ── */}
          <button
            onClick={() => navigate(-1)}
            style={styles.backBtn}
          >
            ← Back to Products
          </button>
        </div>

      </div>
    </div>
  );
};

const styles = {
  page: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '2rem 1.5rem',
  },
  centered: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '400px',
  },
  loadingText: { color: 'var(--text-light)', fontSize: '1.1rem' },
  errorText: { color: 'var(--danger)', fontSize: '1.1rem', fontWeight: '500' },
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '3rem',
    backgroundColor: 'var(--white)',
    borderRadius: 'var(--radius)',
    border: '1px solid var(--border)',
    padding: '2rem',
    boxShadow: 'var(--shadow)',
  },
  imageWrapper: {
    borderRadius: 'var(--radius)',
    overflow: 'hidden',
    backgroundColor: 'var(--bg)',
    maxHeight: '420px',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  category: {
    fontSize: '0.78rem',
    fontWeight: '600',
    color: 'var(--primary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  name: {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: 'var(--text)',
    lineHeight: '1.2',
  },
  price: {
    fontSize: '1.6rem',
    fontWeight: '700',
    color: 'var(--primary)',
  },
  description: {
    color: 'var(--text-light)',
    lineHeight: '1.7',
    fontSize: '0.95rem',
  },
  stockRow: {
    display: 'flex',
    gap: '0.4rem',
    alignItems: 'center',
    fontSize: '0.9rem',
  },
  stockLabel: { color: 'var(--text-light)' },
  inStock: { color: 'var(--success)', fontWeight: '600' },
  outOfStock: { color: 'var(--danger)', fontWeight: '600' },
  btn: {
    backgroundColor: 'var(--primary)',
    color: 'var(--white)',
    padding: '0.9rem 1.5rem',
    borderRadius: 'var(--radius)',
    fontSize: '1rem',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    marginTop: '0.5rem',
  },
  btnAdded: {
    backgroundColor: 'var(--success)',
    color: 'var(--white)',
    padding: '0.9rem 1.5rem',
    borderRadius: 'var(--radius)',
    fontSize: '1rem',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    marginTop: '0.5rem',
  },
  btnDisabled: {
    backgroundColor: 'var(--border)',
    color: 'var(--text-light)',
    padding: '0.9rem 1.5rem',
    borderRadius: 'var(--radius)',
    fontSize: '1rem',
    fontWeight: '600',
    border: 'none',
    cursor: 'not-allowed',
    marginTop: '0.5rem',
  },
  backBtn: {
    backgroundColor: 'transparent',
    color: 'var(--text-light)',
    fontSize: '0.9rem',
    padding: '0',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'left',
  },
};

export default ProductDetail;