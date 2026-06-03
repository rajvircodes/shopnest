import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Dashboard from './pages/admin/Dashboard';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Navbar />
          <main>
            <Routes>
              {/* ── Public Routes ── */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />

              {/* ── Protected: logged in users ── */}
              <Route path="/orders" element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              } />

              {/* ── Protected: admin only ── */}
              <Route path="/admin" element={
                <ProtectedRoute adminOnly={true}>
                  <Dashboard />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;