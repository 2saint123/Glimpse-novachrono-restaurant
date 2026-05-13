import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useCart } from "../state/CartContext";
import { useAuth } from "../state/AuthContext";

const categories = ["", "Breakfast", "Lunch", "Dinner", "Drinks", "Desserts"];

export default function MenuPage() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [items, setItems] = useState([]);
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");
  const { user } = useAuth();
  const { items: cartItems, addItem, updateQty, removeItem, clearCart, totals } = useCart();

  useEffect(() => {
    api.get("/menu", { params: { q, category } }).then(({ data }) => setItems(data));
  }, [q, category]);

  const placeOrder = async () => {
    setMessage("");
    if (!user) {
      setMessage("Please log in as a customer before placing an order.");
      return;
    }
    if (user.role !== "customer") {
      setMessage("Only customer accounts can place orders.");
      return;
    }
    if (!cartItems.length) {
      setMessage("Add at least one menu item first.");
      return;
    }

    await api.post("/orders", {
      notes,
      items: cartItems.map((item) => ({ menuItemId: item.id, quantity: item.qty }))
    });
    clearCart();
    setNotes("");
    setMessage("Order placed successfully.");
  };

  return (
    <div className="mx-auto max-w-7xl px-6 pt-28">
      <h1 className="text-4xl text-softGreen">Luxury Menu</h1>
      <div className="my-6 flex flex-wrap gap-3">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search dishes..." className="rounded bg-zinc-900 p-3" />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded bg-zinc-900 p-3">
          {categories.map((c) => <option key={c} value={c}>{c || "All Categories"}</option>)}
        </select>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((item) => (
          <article key={item.id} className="glass rounded-xl p-4">
            <img src={item.imageUrl || "https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=900&q=80"} className="h-52 w-full rounded-lg object-cover" />
            <h3 className="mt-3 text-xl">{item.name}</h3>
            <p className="text-sm text-zinc-300">{item.description}</p>
            <p className="mt-2 text-softGreen">{Number(item.price).toLocaleString()} RWF</p>
            <button onClick={() => addItem(item)} className="mt-3 rounded bg-softGreen px-4 py-2 text-black">Add to Order</button>
          </article>
        ))}
      </div>
      <aside className="mt-8 rounded-xl bg-zinc-900 p-5">
        <h2 className="text-2xl text-softGreen">Current Order</h2>
        {!cartItems.length ? (
          <p className="mt-3 text-zinc-300">Your order is empty.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {cartItems.map((item) => (
              <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
                <div>
                  <p>{item.name}</p>
                  <p className="text-sm text-zinc-400">{Number(item.price).toLocaleString()} RWF</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQty(item.id, item.qty - 1)} className="rounded bg-zinc-800 px-3 py-1">-</button>
                  <span className="w-8 text-center">{item.qty}</span>
                  <button onClick={() => updateQty(item.id, item.qty + 1)} className="rounded bg-zinc-800 px-3 py-1">+</button>
                  <button onClick={() => removeItem(item.id)} className="rounded bg-red-500 px-3 py-1 text-black">Remove</button>
                </div>
              </div>
            ))}
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Order notes"
              className="w-full rounded bg-zinc-800 p-3"
            />
            <div className="grid gap-2 text-sm md:grid-cols-3">
              <p>Subtotal: {totals.subtotal.toLocaleString()} RWF</p>
              <p>Tax: {totals.tax.toLocaleString()} RWF</p>
              <p className="text-softGreen">Total: {totals.total.toLocaleString()} RWF</p>
            </div>
            <button onClick={placeOrder} className="rounded bg-softGreen px-5 py-3 text-black">Place Order</button>
          </div>
        )}
        {message && <p className="mt-3 text-sm text-softGreen">{message}</p>}
      </aside>
    </div>
  );
}
