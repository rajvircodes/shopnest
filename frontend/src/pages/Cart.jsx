import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const fmt = (n) => `₹${Number(n).toLocaleString('en-IN')}`;

/* ── Single cart row ── */
const CartItem = ({ item, onRemove }) => {
  const [removing, setRemoving] = useState(false);

  const handleRemove = () => {
    setRemoving(true);
    setTimeout(() => onRemove(item._id), 300);
  };

  return (
    <div className={`ci-row${removing ? ' removing' : ''}`}>
      {/* Image */}
      <Link to={`/product/${item._id}`} className="ci-img-link">
        <img
          src={item.image}
          alt={item.name}
          className="ci-img"
          onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=?'; }}
        />
      </Link>

      {/* Info */}
      <div className="ci-info">
        <Link to={`/product/${item._id}`} className="ci-name">{item.name}</Link>
        <span className="ci-unit">{fmt(item.price)} each</span>
        <span className="ci-qty-badge">Qty: {item.quantity}</span>
      </div>

      {/* Right: subtotal + remove */}
      <div className="ci-right">
        <span className="ci-subtotal">{fmt(item.price * item.quantity)}</span>
        <button className="ci-remove" onClick={handleRemove} aria-label="Remove item">
          Remove
        </button>
      </div>
    </div>
  );
};

/* ── Main page ── */
const Cart = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  const [checkedOut, setCheckedOut] = useState(false);

  const subtotal  = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const itemCount = cartItems.reduce((s, i) => s + Number(i.quantity), 0);
  const shipping  = subtotal > 999 ? 0 : 99;
  const total     = subtotal + shipping;

  const handleCheckout = () => {
    setCheckedOut(true);
    setTimeout(() => {
      clearCart();
      navigate('/orders');
    }, 1200);
  };

  return (
    <>
      <style>{css}</style>
      <div className="cp-page">

        {/* ── Heading ── */}
        <div className="cp-heading">
          <h1 className="cp-title">Your Cart</h1>
          {cartItems.length > 0 && (
            <span className="cp-count">{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
          )}
        </div>

        {/* ── Empty state ── */}
        {cartItems.length === 0 && (
          <div className="cp-centered">
            <div className="cp-empty">
              <span className="cp-empty-icon">🛒</span>
              <p className="cp-empty-title">Your cart is empty</p>
              <p className="cp-empty-sub">Add some products and they'll appear here.</p>
              <Link to="/" className="cp-btn">Browse products</Link>
            </div>
          </div>
        )}

        {/* ── Cart layout ── */}
        {cartItems.length > 0 && (
          <div className="cp-layout">

            {/* Left: item list */}
            <div className="cp-items">
              <div className="cp-items-header">
                <span>Product</span>
                <span>Total</span>
              </div>

              <div className="cp-items-list">
                {cartItems.map((item) => (
                  <CartItem key={item._id} item={item} onRemove={removeFromCart} />
                ))}
              </div>

              <div className="cp-items-footer">
                <button className="cp-clear" onClick={clearCart}>
                  🗑 Clear cart
                </button>
                <Link to="/" className="cp-continue">
                  ← Continue shopping
                </Link>
              </div>
            </div>

            {/* Right: order summary */}
            <div className="cp-summary">
              <h2 className="cp-summary-title">Order Summary</h2>

              <div className="cp-summary-rows">
                <div className="cp-summary-row">
                  <span>Subtotal ({itemCount} items)</span>
                  <span>{fmt(subtotal)}</span>
                </div>
                <div className="cp-summary-row">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'cp-free' : ''}>
                    {shipping === 0 ? 'FREE' : fmt(shipping)}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="cp-shipping-hint">
                    Add {fmt(1000 - subtotal)} more for free shipping
                  </p>
                )}
              </div>

              <div className="cp-divider" />

              <div className="cp-summary-total">
                <span>Total</span>
                <span>{fmt(total)}</span>
              </div>

              <button
                className={`cp-checkout${checkedOut ? ' loading' : ''}`}
                onClick={handleCheckout}
                disabled={checkedOut}
              >
                {checkedOut ? (
                  <span className="cp-checkout-spinner" />
                ) : (
                  'Proceed to Checkout'
                )}
              </button>

              <p className="cp-secure">🔒 Secure checkout</p>
            </div>

          </div>
        )}

      </div>
    </>
  );
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  .cp-page {
    font-family: 'Inter', -apple-system, sans-serif;
    max-width: 1050px;
    margin: 0 auto;
    padding: 2.5rem 1.5rem 4rem;
  }

  /* ── Heading ── */
  .cp-heading {
    display: flex;
    align-items: baseline;
    gap: 0.75rem;
    margin-bottom: 2rem;
  }
  .cp-title {
    font-size: 1.6rem;
    font-weight: 800;
    letter-spacing: -0.04em;
    color: var(--text);
  }
  .cp-count {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--text-light);
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 999px;
    padding: 0.15rem 0.65rem;
  }

  /* ── Two-column layout ── */
  .cp-layout {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 1.75rem;
    align-items: start;
  }

  /* ── Items panel ── */
  .cp-items {
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 1px 4px rgba(153,27,27,0.05);
  }

  .cp-items-header {
    display: flex;
    justify-content: space-between;
    padding: 0.75rem 1.25rem;
    background: var(--bg);
    border-bottom: 1px solid var(--border);
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: var(--text-light);
  }

  .cp-items-list {
    display: flex;
    flex-direction: column;
  }

  /* ── Cart item row ── */
  .ci-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.25rem;
    border-bottom: 1px solid var(--border);
    transition: opacity 0.3s ease, transform 0.3s ease, background 0.15s ease;
  }
  .ci-row:last-child { border-bottom: none; }
  .ci-row:hover { background: rgba(153,27,27,0.02); }
  .ci-row.removing {
    opacity: 0;
    transform: translateX(12px);
  }

  .ci-img-link { flex-shrink: 0; }
  .ci-img {
    width: 72px; height: 72px;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: var(--bg);
    display: block;
    transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1);
  }
  .ci-img:hover { transform: scale(1.06); }

  .ci-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }
  .ci-name {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text);
    text-decoration: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: color 0.15s ease;
  }
  .ci-name:hover { color: var(--primary); }
  .ci-unit {
    font-size: 0.75rem;
    color: var(--text-light);
  }
  .ci-qty-badge {
    display: inline-flex;
    align-items: center;
    width: fit-content;
    font-size: 0.72rem;
    font-weight: 600;
    color: var(--primary);
    background: rgba(153,27,27,0.07);
    padding: 0.15rem 0.5rem;
    border-radius: 6px;
    margin-top: 0.1rem;
  }

  .ci-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.4rem;
    flex-shrink: 0;
  }
  .ci-subtotal {
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--text);
    font-variant-numeric: tabular-nums;
  }
  .ci-remove {
    font-family: 'Inter', inherit;
    font-size: 0.72rem;
    font-weight: 500;
    color: var(--text-light);
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    transition: color 0.15s ease;
  }
  .ci-remove:hover { color: var(--danger); }

  /* Items footer */
  .cp-items-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.85rem 1.25rem;
    background: var(--bg);
    border-top: 1px solid var(--border);
  }
  .cp-clear {
    font-family: 'Inter', inherit;
    font-size: 0.78rem;
    font-weight: 500;
    color: var(--danger);
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    transition: opacity 0.15s ease;
  }
  .cp-clear:hover { opacity: 0.7; }
  .cp-continue {
    font-size: 0.78rem;
    font-weight: 500;
    color: var(--primary);
    text-decoration: none;
    transition: opacity 0.15s ease;
  }
  .cp-continue:hover { opacity: 0.7; }

  /* ── Summary panel ── */
  .cp-summary {
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 1px 4px rgba(153,27,27,0.05);
    position: sticky;
    top: 80px;
  }
  .cp-summary-title {
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--text);
    margin-bottom: 1.1rem;
  }
  .cp-summary-rows {
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
  }
  .cp-summary-row {
    display: flex;
    justify-content: space-between;
    font-size: 0.85rem;
    color: var(--text-light);
    font-weight: 400;
  }
  .cp-free {
    color: var(--success);
    font-weight: 600;
  }
  .cp-shipping-hint {
    font-size: 0.72rem;
    color: var(--primary);
    background: rgba(153,27,27,0.06);
    border-radius: 6px;
    padding: 0.3rem 0.6rem;
    margin-top: 0.1rem;
  }
  .cp-divider {
    border: none;
    border-top: 1px dashed var(--border);
    margin: 1rem 0;
  }
  .cp-summary-total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1.05rem;
    font-weight: 800;
    color: var(--text);
    letter-spacing: -0.02em;
    margin-bottom: 1.1rem;
    font-variant-numeric: tabular-nums;
  }

  /* Checkout button */
  .cp-checkout {
    width: 100%;
    padding: 0.7rem 1rem;
    border-radius: 9px;
    border: none;
    font-family: 'Inter', inherit;
    font-size: 0.9rem;
    font-weight: 700;
    background: var(--primary);
    color: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    box-shadow: 0 3px 10px rgba(153,27,27,0.28);
    transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s ease;
    position: relative;
    overflow: hidden;
  }
  .cp-checkout::before {
    content: '';
    position: absolute; top: 0; left: -100%;
    width: 60%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
    transition: left 0.4s ease;
  }
  .cp-checkout:hover:not(:disabled)::before { left: 160%; }
  .cp-checkout:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 22px rgba(153,27,27,0.35);
  }
  .cp-checkout:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 2px 6px rgba(153,27,27,0.2);
  }
  .cp-checkout.loading {
    opacity: 0.8;
    cursor: not-allowed;
  }
  .cp-checkout-spinner {
    width: 18px; height: 18px;
    border: 2.5px solid rgba(255,255,255,0.35);
    border-top-color: #fff;
    border-radius: 50%;
    animation: cp-spin 0.7s linear infinite;
  }
  @keyframes cp-spin { to { transform: rotate(360deg); } }

  .cp-secure {
    text-align: center;
    font-size: 0.72rem;
    color: var(--text-light);
    margin-top: 0.75rem;
  }

  /* ── Empty state ── */
  .cp-centered {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 360px;
  }
  .cp-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.6rem;
    text-align: center;
    padding: 3rem 2.5rem;
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: 12px;
    box-shadow: 0 1px 4px rgba(153,27,27,0.05);
  }
  .cp-empty-icon { font-size: 2.8rem; }
  .cp-empty-title {
    font-size: 1rem;
    font-weight: 700;
    color: var(--text);
  }
  .cp-empty-sub {
    font-size: 0.85rem;
    color: var(--text-light);
    margin-bottom: 0.4rem;
  }
  .cp-btn {
    display: inline-block;
    font-family: 'Inter', inherit;
    font-size: 0.85rem;
    font-weight: 600;
    padding: 0.5rem 1.25rem;
    border-radius: 8px;
    background: var(--primary);
    color: #fff;
    text-decoration: none;
    box-shadow: 0 2px 8px rgba(153,27,27,0.25);
    transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s ease;
  }
  .cp-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(153,27,27,0.3);
  }

  /* ── Responsive ── */
  @media (max-width: 680px) {
    .cp-layout {
      grid-template-columns: 1fr;
    }
    .cp-summary {
      position: static;
    }
    .ci-img { width: 56px; height: 56px; }
  }

  @media (prefers-reduced-motion: reduce) {
    .ci-row, .ci-img, .cp-checkout, .cp-checkout-spinner { transition: none; animation: none; }
  }
`;

export default Cart;