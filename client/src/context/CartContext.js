import React, { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    // ✅ Load cart from localStorage when app loads
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // ✅ Save cart to localStorage on every change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  function addToCart(product, qty = 1, feedback = "") {
    setCart((prev) => {
      const existing = prev.find((p) => p._id === product._id);
      if (existing) {
        // ✅ If already in cart, just update quantity & feedback
        return prev.map((p) =>
          p._id === product._id
            ? { ...p, qty: p.qty + qty, feedback: feedback || p.feedback }
            : p
        );
      }
      return [...prev, { ...product, qty, feedback }];
    });
  }

  function removeFromCart(id) {
    setCart((prev) => prev.filter((p) => p._id !== id));
  }

  function updateQuantity(productId, newQty) {
    if (newQty <= 0) return removeFromCart(productId);
    setCart((prev) =>
      prev.map((item) =>
        item._id === productId ? { ...item, qty: newQty } : item
      )
    );
  }

  function clearCart() {
    setCart([]);
  }

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
