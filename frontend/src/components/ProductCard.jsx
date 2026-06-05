import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div style={styles.card}>

      {/* ── Product Image ── */}
      <Link to={`/product/${product._id}`}>
        <div style={styles.imageWrapper}>
          <img
            src={product.image}
            alt={product.name}
            style={styles.image}
            onError={(e) => {
              // Fallback if image URL breaks
              e.target.src = 'https://placehold.co/400x300?text=No+Image';
            }}
          />
        </div>
      </Link>

      {/* ── Product Info ── */}
      <div style={styles.body}>
        <span style={styles.category}>{product.category}</span>

        <Link to={`/product/${product._id}`} style={styles.nameLink}>
          <h3 style={styles.name}>{product.name}</h3>
        </Link>

        <div style={styles.footer}>
          <span style={styles.price}>₹{product.price.toLocaleString()}</span>
          <span style={product.stock > 0 ? styles.inStock : styles.outOfStock}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </span>
        </div>
      </div>

    </div>
  );
};

const styles = {
  card: {
    backgroundColor: 'var(--white)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    overflow: 'hidden',
    boxShadow: 'var(--shadow)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    display: 'flex',
    flexDirection: 'column',
  },
  imageWrapper: {
    width: '100%',
    height: '200px',
    overflow: 'hidden',
    backgroundColor: 'var(--bg)',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s',
  },
  body: {
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
    flex: 1,
  },
  category: {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: 'var(--primary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  nameLink: {
    color: 'var(--text)',
  },
  name: {
    fontSize: '1rem',
    fontWeight: '600',
    lineHeight: '1.3',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '0.5rem',
  },
  price: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: 'var(--text)',
  },
  inStock: {
    fontSize: '0.78rem',
    color: 'var(--success)',
    fontWeight: '500',
  },
  outOfStock: {
    fontSize: '0.78rem',
    color: 'var(--danger)',
    fontWeight: '500',
  },
};

export default ProductCard;