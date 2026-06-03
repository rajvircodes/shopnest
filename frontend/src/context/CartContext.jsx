import { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  // ── Persist cart to localStorage on every change ──
  const saveCart = (items) => {
    setCartItems(items);
    localStorage.setItem('cart', JSON.stringify(items));
  };

  // ── Add to cart or increase quantity if already exists ──
  const addToCart = (product) => {
    const exists = cartItems.find((item) => item._id === product._id);
    let updatedCart;

    if (exists) {
      updatedCart = cartItems.map((item) =>
        item._id === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [...cartItems, { ...product, quantity: 1 }];
    }

    saveCart(updatedCart);
  };

  // ── Remove item completely from cart ──
  const removeFromCart = (productId) => {
    saveCart(cartItems.filter((item) => item._id !== productId));
  };

  // ── Increase quantity ──
  const increaseQuantity = (productId) => {
    saveCart(
      cartItems.map((item) =>
        item._id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // ── Decrease quantity — remove if hits 0 ──
  const decreaseQuantity = (productId) => {
    const item = cartItems.find((i) => i._id === productId);
    if (item.quantity === 1) {
      removeFromCart(productId);
    } else {
      saveCart(
        cartItems.map((i) =>
          i._id === productId ? { ...i, quantity: i.quantity - 1 } : i
        )
      );
    }
  };

  // ── Clear entire cart (called after order is placed) ──
  const clearCart = () => saveCart([]);

  // ── Derived values ──
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      increaseQuantity,
      decreaseQuantity,
      clearCart,
      cartCount,
      cartTotal,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

