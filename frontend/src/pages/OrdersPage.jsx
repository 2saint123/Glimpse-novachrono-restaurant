import React, { useEffect, useState } from "react";
import api from "../services/api";
import { FiLoader } from "react-icons/fi";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    api
      .get("/orders/mine")
      .then(({ data }) => setOrders(data))
      .catch(() => setError("Unable to load your orders."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-dark text-light pt-28">
      <div className="mx-auto max-w-6xl px-6 pb-16">
        <div className="mb-10 rounded-[2rem] border border-gold/20 bg-[#0b0b0b]/95 p-8 shadow-2xl shadow-black/40">
          <h1 className="text-4xl font-black text-gold">My Orders</h1>
          <p className="mt-3 max-w-3xl text-slate">Track your order history, payment status, and delivery progress in one place.</p>
        </div>

        {loading ? (
          <div className="rounded-[2rem] border border-gold/20 bg-charcoal/80 p-12 text-center text-light">
            <FiLoader className="mx-auto mb-4 text-4xl animate-spin text-gold" />
            <p>Loading your orders...</p>
          </div>
        ) : error ? (
          <div className="rounded-[2rem] border border-red-500/20 bg-red-500/10 p-12 text-center text-red-100">{error}</div>
        ) : !orders.length ? (
          <div className="rounded-[2rem] border border-gold/20 bg-black/50 p-12 text-center text-slate">
            <p className="text-xl font-semibold text-light">No orders found.</p>
            <p className="mt-2 text-sm">Add meals to your cart and checkout to see your first order here.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => (
              <div key={order.id} className="rounded-[2rem] border border-gold/20 bg-[#111111]/90 p-6 shadow-2xl shadow-black/20">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-gold">Order #{order.id}</p>
                    <p className="mt-2 text-2xl font-black text-light">{Number(order.total).toLocaleString()} RWF</p>
                  </div>
                  <div className="space-y-2 text-right">
                    <p className="text-sm text-slate">Status: <span className="font-semibold text-light">{order.status}</span></p>
                    <p className="text-sm text-slate">Payment: <span className="font-semibold text-gold">{order.paymentStatus}</span></p>
                    <p className="text-sm text-slate">Placed: {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
