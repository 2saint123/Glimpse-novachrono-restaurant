import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function WaiterPage() {
  const [orders, setOrders] = useState([]);
  const load = () => api.get("/orders/waiter").then(({ data }) => setOrders(data));

  useEffect(() => {
    load();
  }, []);

  const setStatus = async (id, status) => {
    await api.patch(`/orders/${id}/status`, { status });
    load();
  };

  return (
    <div className="mx-auto max-w-6xl px-6 pt-28">
      <h1 className="text-4xl text-softGreen">Waiter Platform</h1>
      <div className="mt-6 space-y-3">
        {orders.map((o) => (
          <div key={o.id} className="glass rounded-xl p-4">
            <p>Order #{o.id} - {o.customer} - {o.tableLabel}</p>
            <p>Status: {o.status}</p>
            <div className="mt-2 flex gap-2">
              <button onClick={() => setStatus(o.id, "preparing")} className="rounded bg-yellow-500 px-3 py-1 text-black">In Progress</button>
              <button onClick={() => setStatus(o.id, "served")} className="rounded bg-green-500 px-3 py-1 text-black">Delivered</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
