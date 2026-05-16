import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useCart } from "../state/CartContext";
import { useAuth } from "../state/AuthContext";
import { FiSearch, FiShoppingCart, FiPlus, FiMinus, FiTrash2 } from "react-icons/fi";

const categories = ["", "Breakfast", "Lunch", "Dinner", "Drinks", "Desserts"];

export default function MenuPage() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [items, setItems] = useState([]);
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { items: cartItems, addItem, updateQty, removeItem, clearCart, totals } = useCart();

  useEffect(() => {
    setLoading(true);
    api.get("/menu", { params: { q, category } })
      .then(({ data }) => {
        setItems(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Menu load error:", err);
        setLoading(false);
      });
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

    try {
      await api.post("/orders", {
        notes,
        items: cartItems.map((item) => ({ menuItemId: item.id, quantity: item.qty }))
      });
      clearCart();
      setNotes("");
      setMessage("Order placed successfully!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to place order");
    }
  };

  return (
    <div className="min-h-screen bg-dark pt-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-gold">Our Selection</p>
          <h1 className="mt-4 text-5xl font-black text-light">Luxury Menu</h1>
          <p className="mt-4 text-slate">Discover our exquisite culinary creations</p>
        </div>

        <div className="mb-8 flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[250px]">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gold" />
            <input 
              value={q} 
              onChange={(e) => setQ(e.target.value)} 
              placeholder="Search dishes..." 
              className="w-full rounded-xl border border-gold/20 bg-charcoal py-3 pl-12 pr-4 text-light outline-none transition focus:border-gold" 
            />
          </div>
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)} 
            className="rounded-xl border border-gold/20 bg-charcoal px-6 py-3 text-light outline-none transition focus:border-gold"
          >
            {categories.map((c) => <option key={c} value={c}>{c || "All Categories"}</option>)}
          </select>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
          <div>
            {loading ? (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {[1,2,3,4,5,6].map((i) => (
                  <div key={i} className="glass animate-pulse rounded-2xl p-4">
                    <div className="h-52 rounded-lg bg-charcoal mb-4"></div>
                    <div className="h-6 bg-charcoal rounded mb-2"></div>
                    <div className="h-4 bg-charcoal rounded mb-2"></div>
                    <div className="h-4 bg-charcoal rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : items.length === 0 ? (
              <div className="glass rounded-2xl p-12 text-center">
                <p className="text-xl font-semibold text-light">No items found</p>
                <p className="mt-2 text-slate">Try a different search or category</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {items.map((item) => (
                  <article key={item.id} className="group glass overflow-hidden rounded-2xl transition hover:border-gold/40">
                    <div className="relative h-52 overflow-hidden">
                      <img 
                        src={item.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80"} 
                        alt={item.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-110" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent opacity-60"></div>
                      <span className="absolute left-4 top-4 rounded-full bg-dark/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold backdrop-blur-sm">
                        {item.category}
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="text-xl font-bold text-light">{item.name}</h3>
                      <p className="mt-2 text-sm text-slate line-clamp-2">{item.description}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <p className="text-xl font-bold text-gold">{Number(item.price).toLocaleString()} RWF</p>
                        <button 
                          onClick={() => addItem(item)} 
                          className="flex items-center gap-2 rounded-lg bg-gradient px-4 py-2 text-sm font-bold text-dark transition hover:shadow-lg hover:shadow-gold/30"
                        >
                          <FiPlus /> Add
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          <aside className="glass sticky top-28 h-fit rounded-2xl p-6">
            <h2 className="mb-6 flex items-center gap-2 text-2xl font-black text-gold">
              <FiShoppingCart /> Current Order
            </h2>
            {!cartItems.length ? (
              <div className="py-12 text-center">
                <FiShoppingCart className="mx-auto mb-4 text-5xl text-slate" />
                <p className="text-slate">Your order is empty.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="max-h-[400px] space-y-3 overflow-y-auto pr-2">
                  {cartItems.map((item) => (
                    <div key={item.id} className="rounded-xl border border-gold/10 bg-dark/50 p-4">
                      <div className="mb-3 flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-light">{item.name}</p>
                          <p className="text-sm text-gold">{Number(item.price).toLocaleString()} RWF</p>
                        </div>
                        <button 
                          onClick={() => removeItem(item.id)} 
                          className="text-red-400 transition hover:text-red-300"
                          aria-label="Remove item"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => updateQty(item.id, item.qty - 1)} 
                          className="grid h-8 w-8 place-items-center rounded-lg bg-charcoal text-gold transition hover:bg-gold hover:text-dark"
                        >
                          <FiMinus />
                        </button>
                        <span className="w-12 text-center font-bold text-light">{item.qty}</span>
                        <button 
                          onClick={() => updateQty(item.id, item.qty + 1)} 
                          className="grid h-8 w-8 place-items-center rounded-lg bg-charcoal text-gold transition hover:bg-gold hover:text-dark"
                        >
                          <FiPlus />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Special instructions or dietary requirements..."
                  className="w-full rounded-xl border border-gold/20 bg-charcoal p-4 text-sm text-light outline-none transition focus:border-gold"
                  rows="3"
                />

                <div className="space-y-2 border-t border-gold/20 pt-4 text-sm">
                  <div className="flex justify-between text-slate">
                    <span>Subtotal:</span>
                    <span>{totals.subtotal.toLocaleString()} RWF</span>
                  </div>
                  <div className="flex justify-between text-slate">
                    <span>Tax (18%):</span>
                    <span>{totals.tax.toLocaleString()} RWF</span>
                  </div>
                  <div className="flex justify-between border-t border-gold/20 pt-2 text-lg font-bold text-gold">
                    <span>Total:</span>
                    <span>{totals.total.toLocaleString()} RWF</span>
                  </div>
                </div>

                <button 
                  onClick={placeOrder} 
                  className="w-full rounded-xl bg-gradient py-4 font-bold text-dark shadow-lg shadow-gold/30 transition hover:shadow-gold/50"
                >
                  Place Order
                </button>

                {message && (
                  <p className={`rounded-xl p-3 text-center text-sm font-semibold ${message.includes('success') ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                    {message}
                  </p>
                )}
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
