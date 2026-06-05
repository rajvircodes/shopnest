import { useState, useEffect } from 'react';
import API from '../../api/axios';

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // ── Form state for create/edit ──
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '', description: '', price: '',
        image: '', category: '', stock: '',
    });
    const [formError, setFormError] = useState('');
    const [formLoading, setFormLoading] = useState(false);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const { data } = await API.get('/products');
            setProducts(data.products || []);
            
        } catch (err) {
            console.error('Error fetching products:', err);
            setError('Failed to load products. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { 
        fetchProducts(); 
    }, []);

    // ── Open form in CREATE mode ──
    const openCreateForm = () => {
        setEditingProduct(null);
        setFormData({ name: '', description: '', price: '', image: '', category: '', stock: '' });
        setFormError('');
        setShowForm(true);
    };

    // ── Open form in EDIT mode ──
    const openEditForm = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name || '',
            description: product.description || '',
            price: product.price ?? '',
            image: product.image || '',
            category: product.category || '',
            stock: product.stock ?? '',
        });
        setFormError('');
        setShowForm(true);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');

        // Added 'stock' validation check here
        const { name, description, price, image, category, stock } = formData;
        if (!name || !description || !price || !image || !category || stock === '') {
            return setFormError('Please fill in all required fields.');
        }

        try {
            setFormLoading(true);

            if (editingProduct) {
                // ── UPDATE existing product ──
                await API.put(`/products/${editingProduct._id}`, formData);
            } else {
                // ── CREATE new product ──
                await API.post('/products', formData);
            }

            // Refresh product list and close form
            await fetchProducts();
            setShowForm(false);
        } catch (err) {
            console.error('Form submission error:', err);
            setFormError(err.response?.data?.message || 'Something went wrong while saving the product.');
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (productId, productName) => {
        if (!window.confirm(`Delete "${productName}"? This cannot be undone.`)) return;

        try {
            await API.delete(`/products/${productId}`);
            // Remove from local state immediately without hitting the network again
            setProducts(products.filter((p) => p._id !== productId));
        } catch (err) {
            console.error('Delete error:', err);
            alert('Failed to delete product. Please try again.');
        }
    };

    if (loading) return <div style={styles.centered}><p>Loading...</p></div>;
    if (error) return <div style={styles.centered}><p style={{ color: 'var(--danger)' }}>{error}</p></div>;

    return (
        <div style={styles.page}>

            {/* ── Header ── */}
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>Admin Dashboard</h1>
                    <p style={styles.subtitle}>{products.length} products in catalog</p>
                </div>
                <button onClick={openCreateForm} style={styles.addBtn}>
                    + Add Product
                </button>
            </div>

            {/* ── Create / Edit Form ── */}
            {showForm && (
                <div style={styles.formCard}>
                    <h2 style={styles.formTitle}>
                        {editingProduct ? 'Edit Product' : 'Add New Product'}
                    </h2> 

                    {formError && <div style={styles.error}>{formError}</div>}

                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={styles.formGrid}>

                            <div style={styles.field}>
                                <label style={styles.label}>Product Name *</label>
                                <input style={styles.input} name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Wireless Headphones" />
                            </div>

                            <div style={styles.field}>
                                <label style={styles.label}>Category *</label>
                                <input style={styles.input} name="category" value={formData.category} onChange={handleChange} placeholder="e.g. Electronics" />
                            </div>

                            <div style={styles.field}>
                                <label style={styles.label}>Price (₹) *</label>
                                <input style={styles.input} name="price" type="number" value={formData.price} onChange={handleChange} placeholder="e.g. 2999" />
                            </div>

                            <div style={styles.field}>
                                <label style={styles.label}>Stock *</label>
                                <input style={styles.input} name="stock" type="number" value={formData.stock} onChange={handleChange} placeholder="e.g. 50" />
                            </div>

                            <div style={{ ...styles.field, gridColumn: 'span 2' }}>
                                <label style={styles.label}>Image URL *</label>
                                <input style={styles.input} name="image" value={formData.image} onChange={handleChange} placeholder="https://..." />
                            </div>

                            <div style={{ ...styles.field, gridColumn: 'span 2' }}>
                                <label style={styles.label}>Description *</label>
                                <textarea
                                    style={{ ...styles.input, minHeight: '80px', resize: 'vertical' }}
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Describe the product..."
                                />
                            </div>

                        </div>

                        <div style={styles.formActions}>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                style={styles.cancelBtn}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                style={formLoading ? styles.btnDisabled : styles.submitBtn}
                                disabled={formLoading}
                            >
                                {formLoading
                                    ? 'Saving...'
                                    : editingProduct ? 'Update Product' : 'Create Product'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* ── Products Table ── */}
            <div style={styles.tableWrapper}>
                <table style={styles.table}>
                    <thead>
                        <tr style={styles.thead}>
                            <th style={styles.th}>Product</th>
                            <th style={styles.th}>Category</th>
                            <th style={styles.th}>Price</th>
                            <th style={styles.th}>Stock</th>
                            <th style={styles.th}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ ...styles.td, textAlign: 'center', padding: '2rem' }}>
                                    No products found. Click "+ Add Product" to create one.
                                </td>
                            </tr>
                        ) : (
                            products.map((product) => (
                                <tr key={product._id} style={styles.tr}>
                                    <td style={styles.td}>
                                        <div style={styles.productCell}>
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                style={styles.thumb}
                                                onError={(e) => { e.target.src = 'https://placehold.co/40x40?text=?'; }}
                                            />
                                            <span style={styles.productName}>{product.name}</span>
                                        </div>
                                    </td>
                                    <td style={styles.td}>{product.category}</td>
                                    <td style={styles.td}>₹{Number(product.price).toLocaleString('en-IN')}</td>
                                    <td style={styles.td}>
                                        <span style={product.stock > 0 ? styles.inStock : styles.outOfStock}>
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td style={styles.td}>
                                        <div style={styles.actions}>
                                            <button
                                                onClick={() => openEditForm(product)}
                                                style={styles.editBtn}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product._id, product.name)}
                                                style={styles.deleteBtn}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

const styles = {
    page: { maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' },
    centered: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' },
    title: { fontSize: '1.6rem', fontWeight: '700', color: 'var(--text)' },
    subtitle: { color: 'var(--text-light)', fontSize: '0.9rem', marginTop: '0.2rem' },
    addBtn: { backgroundColor: 'var(--primary)', color: 'var(--white)', padding: '0.7rem 1.2rem', borderRadius: 'var(--radius)', fontWeight: '600', fontSize: '0.95rem', border: 'none', cursor: 'pointer' },
    formCard: { backgroundColor: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem', marginBottom: '2rem', boxShadow: 'var(--shadow)' },
    formTitle: { fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text)' },
    error: { backgroundColor: '#fef2f2', border: '1px solid #fca5a5', color: 'var(--danger)', padding: '0.75rem 1rem', borderRadius: 'var(--radius)', fontSize: '0.9rem', marginBottom: '1rem' },
    form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
    formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
    field: { display: 'flex', flexDirection: 'column', gap: '0.3rem' },
    label: { fontSize: '0.85rem', fontWeight: '500', color: 'var(--text)' },
    input: { padding: '0.65rem 0.9rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: '0.9rem', color: 'var(--text)', backgroundColor: 'var(--white)' },
    formActions: { display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' },
    cancelBtn: { padding: '0.65rem 1.2rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)', backgroundColor: 'var(--white)', color: 'var(--text)', fontWeight: '500', fontSize: '0.9rem', cursor: 'pointer' },
    submitBtn: { padding: '0.65rem 1.4rem', backgroundColor: 'var(--primary)', color: 'var(--white)', border: 'none', borderRadius: 'var(--radius)', fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer' },
    btnDisabled: { padding: '0.65rem 1.4rem', backgroundColor: 'var(--text-light)', color: 'var(--white)', border: 'none', borderRadius: 'var(--radius)', fontWeight: '600', fontSize: '0.9rem', cursor: 'not-allowed' },
    tableWrapper: { backgroundColor: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: 'var(--shadow)' },
    table: { width: '100%', borderCollapse: 'collapse' },
    thead: { backgroundColor: 'var(--bg)' },
    th: { padding: '0.9rem 1rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--border)' },
    tr: { borderBottom: '1px solid var(--border)' },
    td: { padding: '0.9rem 1rem', fontSize: '0.9rem', color: 'var(--text)' },
    productCell: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
    thumb: { width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', backgroundColor: 'var(--bg)' },
    productName: { fontWeight: '500' },
    inStock: { color: 'var(--success)', fontWeight: '600' },
    outOfStock: { color: 'var(--danger)', fontWeight: '600' },
    actions: { display: 'flex', gap: '0.5rem' },
    editBtn: { padding: '0.35rem 0.8rem', backgroundColor: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: '0.82rem', fontWeight: '500', cursor: 'pointer', color: 'var(--text)' },
    deleteBtn: { padding: '0.35rem 0.8rem', backgroundColor: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 'var(--radius)', fontSize: '0.82rem', fontWeight: '500', cursor: 'pointer', color: 'var(--danger)' },
};

export default Dashboard;