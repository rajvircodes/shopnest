import { createContext, useContext, useState } from 'react';

// ─── Create the context ───────────────────────────────────────────
// This is the "container" that holds auth state globally
const AuthContext = createContext(null);

// ─── Auth Provider Component ──────────────────────────────────────
// Wraps the app — any component inside can access auth state
export const AuthProvider = ({ children }) => {
  // Initialize from localStorage so auth persists on page refresh
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || null;
  });

  // ── Login: called after successful API response ──
  const login = (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', tokenData);
  };

  // ── Logout: clears everything ──
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  // ── Derived values — compute from state, don't store separately ──
  const isLoggedIn = !!token;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoggedIn, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

// ─── Custom Hook ──────────────────────────────────────────────────
// Instead of: const { user } = useContext(AuthContext)
// You write:  const { user } = useAuth()
// Cleaner and throws a helpful error if used outside provider
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};