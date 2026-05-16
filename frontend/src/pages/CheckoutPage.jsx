import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../state/CartContext";
import { useAuth } from "../state/AuthContext";
import { FiLoader, FiCreditCard } from "react-icons/fi";

export default function CheckoutPage() {
  const { items, totals, clearCart } = useCart();
  const { user } = useAuth();
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleCheckout = async () => {
    setError("");
    setMessage("");
    if (!items.length) {
      setError("Add items to your cart before checkout.");
      return;
    }
    if (!user || user.role !== "customer") {
      setError("Please log in with a customer account to checkout.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/orders", {
        notes,
        items: items.map((item) => ({ menuItemId: item.id, quantity: item.qty })),
        paymentStatus: "paid"
      });
      clearCart();
      setMessage("Payment successful. Your order has been placed.");
      setTimeout(() => navigate("/orders"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to complete checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark text-light pt-28">
      <div className="mx-auto max-w-6xl px-6 pb-16">
        <div className="mb-10 rounded-[2rem] border border-gold/20 bg-[#0b0b0b]/95 p-8 shadow-2xl shadow-black/40">
          <h1 className="text-4xl font-black text-gold">Checkout</h1>
          <p className="mt-3 max-w-3xl text-slate">Review your cart, pay securely online, and track your order from the dashboard.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.9fr]">
          <div className="space-y-6 rounded-[2rem] border border-gold/20 bg-charcoal/80 p-8 shadow-xl shadow-black/30">
            <h2 className="text-2xl font-black text-light">Order Summary</h2>
            {!items.length ? (
              <div className="rounded-[1.75rem] border border-gold/10 bg-black/50 p-8 text-center text-slate">
                <p className="text-lg font-semibold text-light">Your cart is empty.</p>
                <p className="mt-2 text-sm">Add premium dishes from the menu to continue.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="rounded-[1.75rem] border border-gold/10 bg-black/40 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-light">{item.name}</p>
                        <p className="text-sm text-slate">Qty: {item.qty}</p>
                      </div>
                      <p className="font-semibold text-gold">{(item.price * item.qty).toLocaleString()} RWF</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <aside className="rounded-[2rem] border border-gold/20 bg-[#111111]/90 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl">
            <h2 className="text-2xl font-black text-light">Payment Details</h2>
            <div className="mt-6 space-y-4 rounded-[1.75rem] border border-gold/10 bg-dark/80 p-6">
              <div className="flex justify-between text-sm text-slate"><span>Subtotal</span><span>{totals.subtotal.toLocaleString()} RWF</span></div>
              <div className="flex justify-between text-sm text-slate"><span>Tax (18%)</span><span>{totals.tax.toLocaleString()} RWF</span></div>
              <div className="flex justify-between border-t border-gold/10 pt-4 text-lg font-black text-gold"><span>Total</span><span>{totals.total.toLocaleString()} RWF</span></div>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Order notes or special requests"
              className="mt-6 h-28 w-full rounded-3xl border border-gold/20 bg-black/40 p-4 text-sm text-light outline-none transition focus:border-gold"
            />
            <button
              onClick={handleCheckout}
              disabled={!items.length || loading}
              className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-full bg-gold px-6 py-4 text-sm font-bold text-dark transition hover:bg-darkGold disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? <><FiLoader className="animate-spin" /> Processing Payment</> : <><FiCreditCard /> Pay Online</>}
            </button>
            {message && <p className="mt-4 rounded-3xl bg-emerald-500/10 p-4 text-center text-sm font-semibold text-emerald-300">{message}</p>}
            {error && <p className="mt-4 rounded-3xl bg-red-500/10 p-4 text-center text-sm font-semibold text-red-300">{error}</p>}
          </aside>
        </div>
      </div>
    </div>
  );
}
