import { useState, useEffect, useRef } from 'react';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [searchFocused, setSearchFocused] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await API.get('/products');
        setProducts(data.products);
      } catch (err) {
        setError('Failed to load products. Please try again.', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = ['All', ...new Set(products.map((p) => p.category))];

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === 'All' || p.category === category;
    return matchSearch && matchCategory;
  });

  if (loading) {
    return (
      <>
        <style>{css}</style>
        <div className="hn-centered">
          <div className="hn-spinner-wrap">
            <div className="hn-spinner" />
            <p className="hn-loading-text">Loading products…</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <style>{css}</style>
        <div className="hn-centered">
          <div className="hn-error-box">
            <span className="hn-error-icon">⚠️</span>
            <p className="hn-error-text">{error}</p>
            <button className="hn-retry-btn" onClick={() => window.location.reload()}>
              Try again
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{css}</style>
      <div className="hn-page">

        {/* ── Hero ── */}
        <div className="hn-hero">
          <div className="hn-hero-glow" />
          <p className="hn-hero-eyebrow">Welcome to ShopNest</p>
          <h1 className="hn-hero-title">Quality products,<br />great prices.</h1>
          <p className="hn-hero-sub">
            Browse {products.length}+ items across {categories.length - 1} categories
          </p>
        </div>

        {/* ── Filters ── */}
        <div className="hn-filters">

          {/* Search */}
          <div className={`hn-search-wrap${searchFocused ? ' focused' : ''}`}>
            <span className="hn-search-icon">🔍</span>
            <input
              ref={inputRef}
              className="hn-search"
              type="text"
              placeholder="Search products…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            {search && (
              <button
                className="hn-search-clear"
                onClick={() => { setSearch(''); inputRef.current?.focus(); }}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category pills */}
          <div className="hn-categories">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`hn-cat-btn${category === cat ? ' active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ── Count ── */}
        <p className="hn-count">
          <span className="hn-count-num">{filtered.length}</span>
          {' '}{filtered.length === 1 ? 'product' : 'products'} found
          {search && <span className="hn-count-query"> for "{search}"</span>}
        </p>

        {/* ── Grid / Empty ── */}
        {filtered.length === 0 ? (
          <div className="hn-centered hn-empty">
            <p className="hn-empty-icon">🛍️</p>
            <p className="hn-empty-title">No products found</p>
            <p className="hn-empty-sub">Try a different search or category</p>
            <button className="hn-retry-btn" onClick={() => { setSearch(''); setCategory('All'); }}>
              Clear filters
            </button>
          </div>
        ) : (
          <div className="hn-grid">
            {filtered.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

      </div>
    </>
  );
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  .hn-page {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    max-width: 1100px;
    margin: 0 auto;
    padding: 2rem 1.5rem 4rem;
  }

  /* ── Hero ── */
  .hn-hero {
    position: relative;
    text-align: center;
    padding: 3.5rem 1rem 3rem;
    margin-bottom: 2.5rem;
    background: var(--white);
    border-radius: 16px;
    border: 1px solid rgba(153,27,27,0.1);
    box-shadow: 0 2px 16px rgba(153,27,27,0.06);
    overflow: hidden;
  }
  .hn-hero-glow {
    position: absolute;
    top: -60px; left: 50%;
    transform: translateX(-50%);
    width: 420px; height: 200px;
    background: radial-gradient(ellipse at center, rgba(153,27,27,0.12) 0%, transparent 70%);
    pointer-events: none;
  }
  .hn-hero-eyebrow {
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--primary);
    margin-bottom: 0.75rem;
  }
  .hn-hero-title {
    font-size: clamp(1.8rem, 4vw, 2.6rem);
    font-weight: 800;
    letter-spacing: -0.04em;
    line-height: 1.15;
    color: var(--text);
    margin-bottom: 0.75rem;
  }
  .hn-hero-sub {
    color: var(--text-light);
    font-size: 0.95rem;
    font-weight: 400;
  }

  /* ── Filters ── */
  .hn-filters {
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
    margin-bottom: 1.25rem;
  }

  /* Search */
  .hn-search-wrap {
    position: relative;
    display: flex;
    align-items: center;
    background: var(--white);
    border: 1.5px solid var(--border);
    border-radius: 10px;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }
  .hn-search-wrap.focused {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(153,27,27,0.1);
  }
  .hn-search-icon {
    padding: 0 0.5rem 0 0.9rem;
    font-size: 0.9rem;
    pointer-events: none;
    opacity: 0.5;
  }
  .hn-search {
    flex: 1;
    padding: 0.75rem 0.5rem;
    border: none;
    background: transparent;
    font-size: 0.95rem;
    font-family: 'Inter', inherit;
    color: var(--text);
    outline: none;
  }
  .hn-search::placeholder {
    color: var(--text-light);
  }
  .hn-search-clear {
    padding: 0 0.9rem;
    background: none;
    border: none;
    font-size: 0.75rem;
    color: var(--text-light);
    cursor: pointer;
    transition: color 0.15s ease;
  }
  .hn-search-clear:hover { color: var(--danger); }

  /* Category pills */
  .hn-categories {
    display: flex;
    gap: 0.45rem;
    flex-wrap: wrap;
  }
  .hn-cat-btn {
    padding: 0.38rem 1rem;
    border-radius: 999px;
    border: 1.5px solid var(--border);
    background: var(--white);
    color: var(--text);
    font-size: 0.82rem;
    font-weight: 500;
    font-family: 'Inter', inherit;
    cursor: pointer;
    transition:
      background 0.2s ease,
      border-color 0.2s ease,
      color 0.2s ease,
      transform 0.15s cubic-bezier(0.34,1.56,0.64,1),
      box-shadow 0.2s ease;
  }
  .hn-cat-btn:hover {
    border-color: rgba(153,27,27,0.3);
    color: var(--primary);
    transform: translateY(-1px);
    box-shadow: 0 3px 8px rgba(153,27,27,0.1);
  }
  .hn-cat-btn.active {
    background: var(--primary);
    border-color: var(--primary);
    color: var(--white);
    box-shadow: 0 3px 10px rgba(153,27,27,0.3);
    transform: translateY(-1px);
  }

  /* ── Count ── */
  .hn-count {
    font-size: 0.82rem;
    color: var(--text-light);
    margin-bottom: 1.25rem;
    font-weight: 400;
  }
  .hn-count-num {
    font-weight: 700;
    color: var(--text);
  }
  .hn-count-query {
    color: var(--primary);
    font-style: italic;
  }

  /* ── Grid ── */
  .hn-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1.5rem;
    animation: hn-fade-in 0.3s ease;
  }
  @keyframes hn-fade-in {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Centered (loading / error / empty) ── */
  .hn-centered {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 320px;
  }

  /* Loading */
  .hn-spinner-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  .hn-spinner {
    width: 36px; height: 36px;
    border: 3px solid rgba(153,27,27,0.12);
    border-top-color: var(--primary);
    border-radius: 50%;
    animation: hn-spin 0.75s linear infinite;
  }
  @keyframes hn-spin {
    to { transform: rotate(360deg); }
  }
  .hn-loading-text {
    font-family: 'Inter', inherit;
    font-size: 0.9rem;
    color: var(--text-light);
  }

  /* Error */
  .hn-error-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    padding: 2.5rem;
    background: var(--white);
    border: 1px solid rgba(220,38,38,0.15);
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(220,38,38,0.07);
  }
  .hn-error-icon { font-size: 2rem; }
  .hn-error-text {
    font-family: 'Inter', inherit;
    font-size: 0.9rem;
    color: var(--danger);
    text-align: center;
  }

  /* Empty */
  .hn-empty {
    flex-direction: column;
    gap: 0.5rem;
  }
  .hn-empty-icon { font-size: 2.5rem; }
  .hn-empty-title {
    font-family: 'Inter', inherit;
    font-size: 1rem;
    font-weight: 600;
    color: var(--text);
  }
  .hn-empty-sub {
    font-family: 'Inter', inherit;
    font-size: 0.85rem;
    color: var(--text-light);
    margin-bottom: 0.5rem;
  }

  /* Shared action button */
  .hn-retry-btn {
    font-family: 'Inter', inherit;
    font-size: 0.85rem;
    font-weight: 600;
    padding: 0.5rem 1.25rem;
    border-radius: 8px;
    border: none;
    background: var(--primary);
    color: var(--white);
    cursor: pointer;
    transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s ease;
    box-shadow: 0 2px 8px rgba(153,27,27,0.25);
  }
  .hn-retry-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(153,27,27,0.3);
  }
  .hn-retry-btn:active {
    transform: translateY(0);
  }

  @media (prefers-reduced-motion: reduce) {
    .hn-spinner, .hn-grid, .hn-cat-btn, .hn-retry-btn { animation: none; transition: none; }
  }
`;

export default Home;