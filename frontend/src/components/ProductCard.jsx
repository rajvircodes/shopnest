import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock === 0 || addedToCart) return;
    addToCart(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlisted((w) => !w);
  };

  const isOutOfStock = product.stock === 0;

  return (
    <>
      <style>{css}</style>

      <div className="pc-card" onClick={() => navigate(`/product/${product._id}`)}>

        {/* ── Image ── */}
        <div className="pc-image-wrapper">
          <img
            src={product.image}
            alt={product.name}
            className="pc-image"
            onError={(e) => { e.target.src = 'https://placehold.co/400x300?text=No+Image'; }}
          />
          {isOutOfStock && (
            <div className="pc-oos-overlay">
              <span className="pc-oos-label">Out of stock</span>
            </div>
          )}
          <button
            className={`pc-wishlist${wishlisted ? ' active' : ''}`}
            onClick={handleWishlist}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            {wishlisted ? '❤️' : '🤍'}
          </button>
        </div>

        {/* ── Body ── */}
        <div className="pc-body">

          {/* TOP: category + name — these grow to fill available space */}
          <div className="pc-body-top">
            <span className="pc-category">{product.category}</span>
            <Link
              to={`/product/${product._id}`}
              className="pc-name"
              onClick={(e) => e.stopPropagation()}
            >
              {product.name}
            </Link>
          </div>

          {/* BOTTOM: price + stock + button — always pinned to the bottom */}
          <div className="pc-body-bottom">
            <div className="pc-footer">
              <span className="pc-price">₹{product.price.toLocaleString()}</span>
              {isOutOfStock
                ? <span className="pc-stock-out">Unavailable</span>
                : <span className="pc-stock-in">{product.stock} in stock</span>
              }
            </div>
            <button
              className={`pc-atc-btn ${isOutOfStock ? 'disabled' : addedToCart ? 'added' : 'available'}`}
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              aria-live="polite"
            >
              {isOutOfStock ? 'Out of Stock' : addedToCart ? '✓ Added to Cart' : 'Add to Cart'}
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  .pc-card {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(153,27,27,0.07);

    /* KEY FIX: grid with 3 fixed rows — image / body-top / body-bottom */
    display: flex;
    flex-direction: column;
    height: 100%;          /* stretch to fill grid cell */

    cursor: pointer;
    transition:
      transform 0.28s cubic-bezier(0.34,1.56,0.64,1),
      box-shadow 0.28s ease,
      border-color 0.2s ease;
    position: relative;
  }
  .pc-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 32px rgba(153,27,27,0.13), 0 2px 8px rgba(153,27,27,0.07);
    border-color: rgba(153,27,27,0.18);
  }

  /* ── Image ── */
  .pc-image-wrapper {
    width: 100%;
    height: 210px;
    flex-shrink: 0;        /* never compress */
    overflow: hidden;
    background: var(--bg);
    position: relative;
  }
  .pc-image {
    width: 100%; height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.45s cubic-bezier(0.25,0.46,0.45,0.94);
  }
  .pc-card:hover .pc-image { transform: scale(1.06); }

  .pc-oos-overlay {
    position: absolute; inset: 0;
    background: rgba(255,255,255,0.55);
    backdrop-filter: blur(2px);
    display: flex; align-items: center; justify-content: center;
    pointer-events: none;
  }
  .pc-oos-label {
    background: rgba(153,27,27,0.88);
    color: #fff;
    font-size: 0.72rem; font-weight: 700;
    letter-spacing: 0.1em; text-transform: uppercase;
    padding: 0.3rem 0.8rem; border-radius: 20px;
  }

  .pc-wishlist {
    position: absolute; top: 10px; right: 10px;
    width: 34px; height: 34px; border-radius: 50%;
    background: rgba(255,255,255,0.85);
    backdrop-filter: blur(6px);
    border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 1rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    opacity: 0;
    transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s ease;
    z-index: 2;
  }
  .pc-card:hover .pc-wishlist { opacity: 1; }
  .pc-wishlist:hover { transform: scale(1.2); }
  .pc-wishlist.active { opacity: 1; background: rgba(153,27,27,0.08); }

  /* ── Body: flex column, fills remaining card height ── */
  .pc-body {
    padding: 0.9rem 1rem 1rem;
    display: flex;
    flex-direction: column;
    flex: 1;               /* grow to fill card */
  }

  /* TOP section grows — pushes bottom down */
  .pc-body-top {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    margin-bottom: 0.75rem;
  }

  /* BOTTOM section always at the card's base */
  .pc-body-bottom {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }

  .pc-category {
    font-size: 0.68rem; font-weight: 700;
    color: var(--primary);
    text-transform: uppercase; letter-spacing: 0.07em;
  }

  /* Name: no line-clamp — let it grow naturally so siblings align */
  .pc-name {
    font-size: 0.95rem; font-weight: 600;
    line-height: 1.35; color: var(--text);
    text-decoration: none;
    transition: color 0.2s ease;
  }
  .pc-name:hover { color: var(--primary); }

  .pc-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .pc-price {
    font-size: 1.1rem; font-weight: 700;
    color: var(--text); letter-spacing: -0.02em;
  }
  .pc-stock-in {
    font-size: 0.72rem; color: var(--success); font-weight: 500;
    display: flex; align-items: center; gap: 0.3rem;
  }
  .pc-stock-in::before {
    content: '';
    display: inline-block; width: 6px; height: 6px;
    background: var(--success); border-radius: 50%;
  }
  .pc-stock-out {
    font-size: 0.72rem; color: var(--danger); font-weight: 500;
  }

  .pc-atc-btn {
    width: 100%;
    padding: 0.55rem 1rem;
    border-radius: 8px; border: none;
    font-family: 'Inter', inherit;
    font-size: 0.85rem; font-weight: 600;
    letter-spacing: -0.01em;
    cursor: pointer;
    position: relative; overflow: hidden;
    transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s ease, background 0.25s ease;
  }
  .pc-atc-btn.available {
    background: var(--primary); color: #fff;
    box-shadow: 0 2px 8px rgba(153,27,27,0.25);
  }
  .pc-atc-btn.available:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(153,27,27,0.35);
  }
  .pc-atc-btn.available:active { transform: translateY(0); box-shadow: none; }
  .pc-atc-btn.available::before {
    content: '';
    position: absolute; top: 0; left: -100%;
    width: 60%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
    transition: left 0.4s ease;
  }
  .pc-atc-btn.available:hover::before { left: 160%; }
  .pc-atc-btn.added {
    background: var(--success); color: #fff;
    box-shadow: 0 2px 8px rgba(22,163,74,0.25);
  }
  .pc-atc-btn.disabled {
    background: var(--border); color: var(--text-light);
    cursor: not-allowed; box-shadow: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .pc-card, .pc-image, .pc-atc-btn, .pc-wishlist { transition: none; }
  }
`;

export default ProductCard;