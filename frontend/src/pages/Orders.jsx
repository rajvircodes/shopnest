import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';

const statusConfig = {
  paid_delivered:   { label: 'Delivered',     color: '#15803d', bg: 'rgba(21,128,61,0.08)',   dot: '#15803d' },
  paid_pending:     { label: 'In Transit',    color: '#b45309', bg: 'rgba(180,83,9,0.08)',    dot: '#b45309' },
  unpaid_pending:   { label: 'Awaiting Payment', color: '#991b1b', bg: 'rgba(153,27,27,0.08)', dot: '#991b1b' },
  unpaid_delivered: { label: 'Processing',    color: '#6b7280', bg: 'rgba(107,114,128,0.08)', dot: '#6b7280' },
};

const getStatus = (order) => {
  if (order.isPaid && order.isDelivered)  return statusConfig.paid_delivered;
  if (order.isPaid && !order.isDelivered) return statusConfig.paid_pending;
  if (!order.isPaid && order.isDelivered) return statusConfig.unpaid_delivered;
  return statusConfig.unpaid_pending;
};

const fmt = (n) => `₹${Number(n).toLocaleString('en-IN')}`;
const fmtDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

/* ── Collapsible Order Card ── */
const OrderCard = ({ order }) => {
  const [open, setOpen] = useState(false);
  const status = getStatus(order);
  const shortId = order._id.slice(-6).toUpperCase();

  return (
    <div className="oc-card">
      {/* Header row — always visible */}
      <button className="oc-header" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <div className="oc-header-left">
          <span className="oc-id">#{shortId}</span>
          <span className="oc-date">{fmtDate(order.createdAt)}</span>
        </div>
        <div className="oc-header-right">
          <span className="oc-status" style={{ color: status.color, background: status.bg }}>
            <span className="oc-dot" style={{ background: status.dot }} />
            {status.label}
          </span>
          <span className="oc-total">{fmt(order.totalPrice)}</span>
          <span className={`oc-chevron${open ? ' open' : ''}`}>›</span>
        </div>
      </button>

      {/* Expandable items */}
      <div className={`oc-items${open ? ' open' : ''}`}>
        <div className="oc-items-inner">
          <div className="oc-items-list">
            {order.items.map((item, i) => (
              <Link
                to={`/product/${item.product}`}
                key={i}
                className="oc-item"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="oc-item-img"
                  onError={(e) => { e.target.src = 'https://placehold.co/80x80?text=?'; }}
                />
                <div className="oc-item-info">
                  <span className="oc-item-name">{item.name}</span>
                  <span className="oc-item-meta">
                    Qty {item.quantity} · {fmt(item.price)} each
                  </span>
                </div>
                <span className="oc-item-subtotal">
                  {fmt(item.price * item.quantity)}
                </span>
              </Link>
            ))}
          </div>
          <div className="oc-summary">
            <span className="oc-summary-label">Order Total</span>
            <span className="oc-summary-value">{fmt(order.totalPrice)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Main Page ── */
const Orders = () => {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    API.get('/orders/my')
      .then(({ data }) => setOrders(data.orders))
      .catch(() => setError('Could not load your orders.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <style>{css}</style>
      <div className="op-page">

        <div className="op-heading">
          <h1 className="op-title">My Orders</h1>
          {!loading && !error && (
            <span className="op-count">{orders.length} {orders.length === 1 ? 'order' : 'orders'}</span>
          )}
        </div>

        {loading && (
          <div className="op-centered">
            <div className="op-spinner" />
            <p className="op-hint">Fetching your orders…</p>
          </div>
        )}

        {error && (
          <div className="op-centered">
            <div className="op-error-box">
              <span style={{ fontSize: '2rem' }}>⚠️</span>
              <p className="op-error-text">{error}</p>
              <button className="op-btn" onClick={() => window.location.reload()}>Try again</button>
            </div>
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="op-centered">
            <div className="op-empty">
              <span style={{ fontSize: '2.5rem' }}>🛍️</span>
              <p className="op-empty-title">No orders yet</p>
              <p className="op-empty-sub">When you place an order, it will show up here.</p>
              <Link to="/" className="op-btn">Browse products</Link>
            </div>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="op-list">
            {orders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        )}

      </div>
    </>
  );
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  .op-page {
    font-family: 'Inter', -apple-system, sans-serif;
    max-width: 800px;
    margin: 0 auto;
    padding: 2.5rem 1.5rem 4rem;
  }

  /* ── Heading ── */
  .op-heading {
    display: flex;
    align-items: baseline;
    gap: 0.75rem;
    margin-bottom: 2rem;
  }
  .op-title {
    font-size: 1.6rem;
    font-weight: 800;
    letter-spacing: -0.04em;
    color: var(--text);
  }
  .op-count {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--text-light);
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 999px;
    padding: 0.15rem 0.65rem;
  }

  /* ── Order list ── */
  .op-list {
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
  }

  /* ── Order card ── */
  .oc-card {
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 1px 4px rgba(153,27,27,0.05);
    transition: box-shadow 0.2s ease, border-color 0.2s ease;
  }
  .oc-card:hover {
    box-shadow: 0 4px 16px rgba(153,27,27,0.09);
    border-color: rgba(153,27,27,0.15);
  }

  /* Header */
  .oc-header {
    width: 100%;
    background: none;
    border: none;
    cursor: pointer;
    padding: 1rem 1.25rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    font-family: 'Inter', inherit;
  }
  .oc-header:hover { background: rgba(153,27,27,0.02); }

  .oc-header-left {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    min-width: 0;
  }
  .oc-id {
    font-size: 0.85rem;
    font-weight: 700;
    color: var(--text);
    letter-spacing: 0.03em;
    font-variant-numeric: tabular-nums;
  }
  .oc-date {
    font-size: 0.78rem;
    color: var(--text-light);
    font-weight: 400;
  }

  .oc-header-right {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-shrink: 0;
  }

  /* Status badge */
  .oc-status {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.72rem;
    font-weight: 600;
    padding: 0.25rem 0.65rem;
    border-radius: 999px;
    letter-spacing: 0.01em;
    white-space: nowrap;
  }
  .oc-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .oc-total {
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--text);
    letter-spacing: -0.02em;
    font-variant-numeric: tabular-nums;
  }

  /* Chevron */
  .oc-chevron {
    font-size: 1.1rem;
    color: var(--text-light);
    display: inline-block;
    transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1);
    line-height: 1;
    margin-top: 1px;
  }
  .oc-chevron.open { transform: rotate(90deg); }

  /* Expand panel */
  .oc-items {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.35s cubic-bezier(0.4,0,0.2,1);
  }
  .oc-items.open { max-height: 800px; }

  .oc-items-inner {
    border-top: 1px solid var(--border);
    padding: 0.75rem 1.25rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  /* Item rows */
  .oc-items-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .oc-item {
    display: flex;
    align-items: center;
    gap: 0.9rem;
    padding: 0.6rem 0.75rem;
    border-radius: 8px;
    text-decoration: none;
    color: inherit;
    transition: background 0.15s ease;
  }
  .oc-item:hover { background: rgba(153,27,27,0.04); }

  .oc-item-img {
    width: 52px; height: 52px;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid var(--border);
    flex-shrink: 0;
    background: var(--bg);
  }
  .oc-item-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }
  .oc-item-name {
    font-size: 0.88rem;
    font-weight: 600;
    color: var(--text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .oc-item-meta {
    font-size: 0.75rem;
    color: var(--text-light);
    font-weight: 400;
  }
  .oc-item-subtotal {
    font-size: 0.88rem;
    font-weight: 700;
    color: var(--text);
    font-variant-numeric: tabular-nums;
    flex-shrink: 0;
  }

  /* Summary row */
  .oc-summary {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.65rem 0.75rem 0;
    border-top: 1px dashed var(--border);
    margin-top: 0.25rem;
  }
  .oc-summary-label {
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--text-light);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .oc-summary-value {
    font-size: 1.05rem;
    font-weight: 800;
    color: var(--primary);
    letter-spacing: -0.03em;
    font-variant-numeric: tabular-nums;
  }

  /* ── Loading / Error / Empty ── */
  .op-centered {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 320px;
  }
  .op-spinner {
    width: 36px; height: 36px;
    border: 3px solid rgba(153,27,27,0.12);
    border-top-color: var(--primary);
    border-radius: 50%;
    animation: op-spin 0.75s linear infinite;
    margin-bottom: 0.75rem;
  }
  @keyframes op-spin { to { transform: rotate(360deg); } }

  .op-hint {
    font-size: 0.88rem;
    color: var(--text-light);
    margin-top: 0.5rem;
  }

  .op-error-box, .op-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.6rem;
    text-align: center;
    padding: 2.5rem;
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: 12px;
  }
  .op-error-text {
    font-size: 0.9rem;
    color: var(--danger);
  }
  .op-empty-title {
    font-size: 1rem;
    font-weight: 700;
    color: var(--text);
  }
  .op-empty-sub {
    font-size: 0.85rem;
    color: var(--text-light);
    margin-bottom: 0.4rem;
  }

  .op-btn {
    display: inline-block;
    font-family: 'Inter', inherit;
    font-size: 0.85rem;
    font-weight: 600;
    padding: 0.5rem 1.25rem;
    border-radius: 8px;
    border: none;
    background: var(--primary);
    color: #fff;
    text-decoration: none;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(153,27,27,0.25);
    transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s ease;
  }
  .op-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(153,27,27,0.3);
  }

  @media (max-width: 520px) {
    .oc-date { display: none; }
    .oc-header { padding: 0.85rem 1rem; }
    .oc-items-inner { padding: 0.75rem 1rem; }
  }

  @media (prefers-reduced-motion: reduce) {
    .oc-chevron, .oc-items, .op-spinner { transition: none; animation: none; }
  }
`;

export default Orders;