import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      return setError('Please fill in all fields');
    }

    try {
      setLoading(true);
      const { data } = await API.post('/auth/login', formData);
      login(data.user, data.token);

      // ── Redirect admin to dashboard, regular user to home ──
      if (data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.subtitle}>Login to your ShopNest account</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>

          <div style={styles.field}>
            <label style={styles.label}>Email Address</label>
            <input
              style={styles.input}
              type="email"
              name="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              name="password"
              placeholder="Your password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            style={loading ? styles.btnDisabled : styles.btn}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

        </form>

        {/* ── Quick test credentials hint for development ── */}
        <div style={styles.hint}>
          <p style={styles.hintText}>Test credentials:</p>
          <p style={styles.hintText}>User: john@example.com / 123456</p>
          <p style={styles.hintText}>Admin: admin@shopnest.com / admin123</p>
        </div>

        <p style={styles.footer}>
          Don't have an account?{' '}
          <Link to="/register" style={styles.footerLink}>Register</Link>
        </p>

      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: 'calc(100vh - 60px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    backgroundColor: 'var(--bg)',
  },
  card: {
    backgroundColor: 'var(--white)',
    borderRadius: 'var(--radius)',
    boxShadow: 'var(--shadow)',
    padding: '2.5rem',
    width: '100%',
    maxWidth: '420px',
    border: '1px solid var(--border)',
  },
  title: {
    fontSize: '1.6rem',
    fontWeight: '700',
    color: 'var(--text)',
    marginBottom: '0.3rem',
  },
  subtitle: {
    color: 'var(--text-light)',
    fontSize: '0.9rem',
    marginBottom: '1.5rem',
  },
  error: {
    backgroundColor: '#fef2f2',
    border: '1px solid #fca5a5',
    color: 'var(--danger)',
    padding: '0.75rem 1rem',
    borderRadius: 'var(--radius)',
    fontSize: '0.9rem',
    marginBottom: '1rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.1rem',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: 'var(--text)',
  },
  input: {
    padding: '0.7rem 1rem',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    fontSize: '0.95rem',
    color: 'var(--text)',
    backgroundColor: 'var(--white)',
  },
  btn: {
    backgroundColor: 'var(--primary)',
    color: 'var(--white)',
    padding: '0.8rem',
    borderRadius: 'var(--radius)',
    fontSize: '1rem',
    fontWeight: '600',
    marginTop: '0.5rem',
  },
  btnDisabled: {
    backgroundColor: 'var(--text-light)',
    color: 'var(--white)',
    padding: '0.8rem',
    borderRadius: 'var(--radius)',
    fontSize: '1rem',
    fontWeight: '600',
    marginTop: '0.5rem',
    cursor: 'not-allowed',
  },
  hint: {
    backgroundColor: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '0.75rem 1rem',
    marginTop: '1rem',
  },
  hintText: {
    fontSize: '0.8rem',
    color: 'var(--text-light)',
    lineHeight: '1.6',
  },
  footer: {
    textAlign: 'center',
    marginTop: '1.5rem',
    fontSize: '0.9rem',
    color: 'var(--text-light)',
  },
  footerLink: {
    color: 'var(--primary)',
    fontWeight: '600',
  },
};

export default Login;