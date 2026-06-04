import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // ── Form state — one object for all fields ──
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  // ── UI state — separate from form data ──
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // ── Single handler for all inputs ──
  // e.target.name matches the `name` attribute on each input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();           // prevent browser's default form reload
    setError('');                 // clear previous errors

    // ── Client-side validation ──
    if (!formData.name || !formData.email || !formData.password) {
      return setError('Please fill in all fields');
    }

    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    try {
      setLoading(true);
      const { data } = await API.post('/auth/register', formData);

      // ── Success: update global auth state then redirect ──
      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      // Axios wraps the server's error response in err.response
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      // Always runs — success or fail — reset loading state
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        <h2 style={styles.title}>Create an Account</h2>
        <p style={styles.subtitle}>Join ShopNest today</p>

        {/* ── Error Message ── */}
        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>

          <div style={styles.field}>
            <label style={styles.label}>Full Name</label>
            <input
              style={styles.input}
              type="text"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

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
              placeholder="Min. 6 characters"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            style={loading ? styles.btnDisabled : styles.btn}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

        </form>

        <p style={styles.footer}>
          Already have an account?{' '}
          <Link to="/login" style={styles.footerLink}>Login</Link>
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
    transition: 'border-color 0.2s',
  },
  btn: {
    backgroundColor: 'var(--primary)',
    color: 'var(--white)',
    padding: '0.8rem',
    borderRadius: 'var(--radius)',
    fontSize: '1rem',
    fontWeight: '600',
    marginTop: '0.5rem',
    transition: 'background-color 0.2s',
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

export default Register;