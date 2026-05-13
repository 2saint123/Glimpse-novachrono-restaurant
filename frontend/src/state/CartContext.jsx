import React, { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  const addItem = (item) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.id === item.id);
      if (existing) return prev.map((p) => (p.id === item.id ? { ...p, qty: p.qty + 1 } : p));
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const updateQty = (id, qty) => setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i)));
  const removeItem = (id) => setItems((prev) => prev.filter((i) => i.id !== id));
  const clearCart = () => setItems([]);

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, i) => sum + Number(i.price) * i.qty, 0);
    const tax = subtotal * 0.18;
    return { subtotal, tax, total: subtotal + tax };
  }, [items]);

  return (
    <CartContext.Provider value={{ items, addItem, updateQty, removeItem, clearCart, totals }}>{children}</CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
