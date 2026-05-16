import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../state/CartContext";
import { useAuth } from "../state/AuthContext";
import { FiSearch, FiShoppingCart, FiPlus, FiMinus, FiTrash2, FiLoader } from "react-icons/fi";

const builtInFilters = ["All", "Foods", "Drinks", "Desserts"];
const placeholderImage = "/images/food-placeholder.svg";
const heroImage = "/images/menu-hero.svg";

export default function MenuPage() {
  const [q, setQ] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const { items: cartItems, addItem, updateQty, removeItem, clearCart, totals } = useCart();

  const categoryQuery = selectedCategory === "All" ? "" : selectedCategory;
  const categoryButtons = [
    ...builtInFilters,
    ...categories.map((cat) => cat.name).filter((name) => !builtInFilters.includes(name))
  ];

  useEffect(() => {
    setLoadingCategories(true);
    api
      .get("/menu/categories")
      .then(({ data }) => setCategories(data))
      .catch(() => setCategories([]))
      .finally(() => setLoadingCategories(false));
  }, []);

  useEffect(() => {
    setLoadingMenu(true);
    setError("");
    api
      .get("/menu", { params: { q, category: categoryQuery } })
      .then(({ data }) => setItems(data))
      .catch(() => setError("Unable to load the menu. Please refresh the page."))
      .finally(() => setLoadingMenu(false));
  }, [q, categoryQuery]);


  return (
    <div className="min-h-screen bg-dark text-light pt-28">
      <div className="mx-auto max-w-7xl px-6 pb-16">
        <section className="mb-12 overflow-hidden rounded-[2rem] border border-gold/20 bg-black/80 shadow-2xl shadow-black/40 md:p-0">
          <div className="relative h-[420px] rounded-[2rem] bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${heroImage})` }}>
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-center gap-4 px-8 md:px-20 lg:px-28">
              <span className="text-sm font-semibold uppercase tracking-[0.35em] text-gold">Glimpse Restaurant</span>
              <h1 className="max-w-3xl text-5xl font-black leading-tight text-light md:text-6xl">Luxury Dining Menu</h1>
              <p className="max-w-3xl text-lg text-slate">Explore our premium selection of signature dishes, crafted for a modern luxury restaurant experience. Filter by category, browse rich descriptions, and order with ease.</p>
              <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-gold/20 bg-black/70 px-5 py-3 text-sm font-semibold text-light shadow-lg shadow-black/50 backdrop-blur-sm">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-gold" />
                New seasonal dishes updated weekly
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8 grid gap-4 md:grid-cols-[1.4fr_auto]">
          <div className="flex flex-col gap-4">
            <div className="relative rounded-3xl border border-gold/20 bg-charcoal/80 p-4 shadow-xl shadow-black/20 backdrop-blur-sm">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gold" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search foods, drinks and desserts"
                className="w-full rounded-2xl border border-transparent bg-transparent py-4 pl-12 pr-4 text-light outline-none transition focus:border-gold/40"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              {loadingCategories ? (
                <div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-charcoal/80 px-4 py-3 text-sm text-slate">
                  <FiLoader className="animate-spin" /> Loading categories...
                </div>
              ) : (
                categoryButtons.map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setSelectedCategory(name)}
                    className={`rounded-full px-5 py-3 text-sm font-semibold transition ${selectedCategory === name ? "bg-gold text-dark shadow-lg shadow-gold/30" : "bg-charcoal text-light hover:bg-gold/20 hover:text-gold"}`}
                  >
                    {name}
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-gold/20 bg-charcoal/80 p-6 shadow-xl shadow-black/20">
            <p className="text-sm uppercase tracking-[0.35em] text-gold">Selected</p>
            <h2 className="mt-3 text-2xl font-black text-light">{selectedCategory}</h2>
            <p className="mt-3 text-slate">Use the category filters or search bar to quickly browse the most elegant dishes and drinks.</p>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.5fr_420px]">
          <div>
            {error && (
              <div className="mb-6 rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-red-100">
                {error}
              </div>
            )}

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {loadingMenu ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="animate-pulse rounded-[2rem] bg-charcoal/80 p-6">
                    <div className="mb-4 h-48 rounded-3xl bg-slate-800" />
                    <div className="h-6 w-3/4 rounded-full bg-slate-700 mb-3" />
                    <div className="h-4 w-full rounded-full bg-slate-700 mb-2" />
                    <div className="h-4 w-5/6 rounded-full bg-slate-700 mb-4" />
                    <div className="h-10 w-24 rounded-full bg-slate-700" />
                  </div>
                ))
              ) : items.length ? (
                items.map((item) => (
                  <article key={item.id} className="group overflow-hidden rounded-[2rem] border border-gold/10 bg-[#0f0f0f] shadow-2xl shadow-black/30 transition duration-500 hover:-translate-y-1 hover:border-gold/40">
                    <div className="relative overflow-hidden rounded-[2rem] bg-slate-900">
                      <img
                        src={item.imageUrl || placeholderImage}
                        alt={item.name}
                        className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-transparent to-transparent" />
                      <span className="absolute left-4 top-4 rounded-full bg-black/70 px-4 py-2 text-xs uppercase tracking-[0.3em] text-gold backdrop-blur-sm">{item.category}</span>
                    </div>
                    <div className="space-y-4 p-6">
                      <div>
                        <h3 className="text-2xl font-extrabold text-light">{item.name}</h3>
                        <p className="mt-3 text-sm leading-6 text-slate">{item.description}</p>
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <p className="text-2xl font-black text-gold">{Number(item.price).toLocaleString()} RWF</p>
                        <button
                          onClick={() => addItem(item)}
                          className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-bold text-dark transition hover:scale-[1.02] hover:bg-darkGold"
                        >
                          <FiPlus /> Add
                        </button>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="rounded-[2rem] border border-gold/20 bg-[#111111] p-12 text-center text-slate shadow-2xl shadow-black/20">
                  <p className="text-lg font-semibold text-light">No menu items match your search.</p>
                  <p className="mt-2 text-sm text-slate">Try a different keyword or category to discover new favorites.</p>
                </div>
              )}
            </div>
          </div>

          <aside className="rounded-[2rem] border border-gold/20 bg-[#111111]/90 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl">
            <div className="flex items-center gap-3 text-gold">
              <FiShoppingCart className="text-2xl" />
              <h2 className="text-2xl font-black">Your Order</h2>
            </div>
            <p className="mt-3 text-sm text-slate">Review your selection before placing a reservation or order.</p>

            {!cartItems.length ? (
              <div className="mt-10 rounded-[2rem] border border-dashed border-gold/20 bg-black/40 p-10 text-center text-slate">
                <p className="text-lg font-semibold text-light">Your order is empty</p>
                <p className="mt-2 text-sm">Add a luxury dish to start your order.</p>
              </div>
            ) : (
              <div className="mt-8 space-y-5">
                <div className="space-y-4 max-h-[360px] overflow-y-auto pr-2">
                  {cartItems.map((item) => (
                    <div key={item.id} className="rounded-[1.75rem] border border-gold/10 bg-dark/80 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-light">{item.name}</p>
                          <p className="mt-1 text-sm text-gold">{Number(item.price).toLocaleString()} RWF</p>
                        </div>
                        <button 
                          onClick={() => removeItem(item.id)} 
                          className="rounded-full border border-red-500/30 p-2 text-red-400 transition hover:bg-red-500/10"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                      <div className="mt-4 flex items-center gap-3">
                        <button onClick={() => updateQty(item.id, item.qty - 1)} className="grid h-10 w-10 place-items-center rounded-2xl bg-charcoal text-gold transition hover:bg-gold hover:text-dark"> <FiMinus /> </button>
                        <span className="min-w-[2.5rem] text-center text-lg font-bold text-light">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, item.qty + 1)} className="grid h-10 w-10 place-items-center rounded-2xl bg-charcoal text-gold transition hover:bg-gold hover:text-dark"> <FiPlus /> </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-[1.75rem] border border-gold/10 bg-black/40 p-5">
                  <div className="flex justify-between text-sm text-slate"><span>Subtotal</span><span>{totals.subtotal.toLocaleString()} RWF</span></div>
                  <div className="mt-3 flex justify-between text-sm text-slate"><span>Tax (18%)</span><span>{totals.tax.toLocaleString()} RWF</span></div>
                  <div className="mt-4 border-t border-gold/10 pt-4 text-lg font-black text-gold flex justify-between"><span>Total</span><span>{totals.total.toLocaleString()} RWF</span></div>
                </div>

                <Link
                  to="/checkout"
                  className={`w-full inline-flex items-center justify-center rounded-full bg-gold px-6 py-4 text-sm font-bold uppercase text-dark transition hover:bg-darkGold ${!cartItems.length ? "opacity-50 pointer-events-none" : ""}`}
                >
                  Proceed to Checkout
                </Link>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
