import { useState, useEffect } from 'react';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  // ── Fetch all products on mount ──
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await API.get('/products');
        setProducts(data.products);
      } catch (err) {
        setError('Failed to load products. Please try again.',err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);    // ← empty array = run once on mount

  // ── Derive unique categories from products ──
  const categories = ['All', ...new Set(products.map((p) => p.category))];

  // ── Filter products by search + category ──
  // This runs on every render — no API call needed
  // Filtering happens client-side on already-fetched data
  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === 'All' || p.category === category;
    return matchSearch && matchCategory;
  });

  // ── Loading state ──
  if (loading) {
    return (
      <div style={styles.centered}>
        <p style={styles.loadingText}>Loading products...</p>
      </div>
    );
  }

  // ── Error state ──
  if (error) {
    return (
      <div style={styles.centered}>
        <p style={styles.errorText}>{error}</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>

      {/* ── Hero ── */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Welcome to ShopNest</h1>
        <p style={styles.heroSub}>Discover quality products at great prices</p>
      </div>

      {/* ── Filters ── */}
      <div style={styles.filters}>

        {/* Search */}
        <input
          style={styles.searchInput}
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Category Tabs */}
        <div style={styles.categories}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={category === cat ? styles.catActive : styles.catBtn}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* ── Results Count ── */}
      <p style={styles.count}>
        {filtered.length} {filtered.length === 1 ? 'product' : 'products'} found
      </p>

      {/* ── Product Grid ── */}
      {filtered.length === 0 ? (
        <div style={styles.centered}>
          <p style={styles.emptyText}>No products match your search.</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {filtered.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

    </div>
  );
};

const styles = {
  page: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '2rem 1.5rem',
  },
  hero: {
    textAlign: 'center',
    padding: '2.5rem 1rem',
    marginBottom: '2rem',
    backgroundColor: 'var(--white)',
    borderRadius: 'var(--radius)',
    border: '1px solid var(--border)',
  },
  heroTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    color: 'var(--text)',
    marginBottom: '0.5rem',
  },
  heroSub: {
    color: 'var(--text-light)',
    fontSize: '1rem',
  },
  filters: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  searchInput: {
    padding: '0.75rem 1rem',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    fontSize: '0.95rem',
    width: '100%',
    backgroundColor: 'var(--white)',
  },
  categories: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  catBtn: {
    padding: '0.4rem 1rem',
    borderRadius: '999px',
    border: '1px solid var(--border)',
    backgroundColor: 'var(--white)',
    color: 'var(--text)',
    fontSize: '0.85rem',
    fontWeight: '500',
    cursor: 'pointer',
  },
  catActive: {
    padding: '0.4rem 1rem',
    borderRadius: '999px',
    border: '1px solid var(--primary)',
    backgroundColor: 'var(--primary)',
    color: 'var(--white)',
    fontSize: '0.85rem',
    fontWeight: '500',
    cursor: 'pointer',
  },
  count: {
    fontSize: '0.875rem',
    color: 'var(--text-light)',
    marginBottom: '1rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '1.5rem',
  },
  centered: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '300px',
  },
  loadingText: {
    color: 'var(--text-light)',
    fontSize: '1rem',
  },
  errorText: {
    color: 'var(--danger)',
    fontSize: '1rem',
  },
  emptyText: {
    color: 'var(--text-light)',
    fontSize: '1rem',
  },
};

export default Home;