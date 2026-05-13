import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function AdminPage() {
  const [stats, setStats] = useState(null);
  const [waiters, setWaiters] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    api.get("/admin/dashboard").then(({ data }) => setStats(data));
    api.get("/admin/waiters").then(({ data }) => setWaiters(data));
    api.get("/admin/reservations").then(({ data }) => setReservations(data));
  };

  const approveWaiter = async (id) => {
    await api.patch(`/admin/waiters/${id}/approve`);
    loadData();
  };

  const rejectWaiter = async (id) => {
    await api.patch(`/admin/waiters/${id}/reject`);
    loadData();
  };

  const approveReservation = async (id) => {
    await api.patch(`/reservations/${id}/approve`);
    loadData();
  };

  const rejectReservation = async (id) => {
    await api.patch(`/reservations/${id}/reject`);
    loadData();
  };

  if (!stats) return <div className="pt-28 text-center">Loading...</div>;

  return (
    <div className="mx-auto max-w-7xl px-6 pt-28 pb-20">
      <h1 className="mb-6 text-4xl font-bold text-softGreen">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <div className="glass rounded-xl p-6">
          <p className="text-sm text-zinc-400">Total Customers</p>
          <p className="text-3xl font-bold text-softGreen">{stats.totalCustomers}</p>
        </div>
        <div className="glass rounded-xl p-6">
          <p className="text-sm text-zinc-400">Reservations</p>
          <p className="text-3xl font-bold text-softGreen">{stats.totalReservations}</p>
        </div>
        <div className="glass rounded-xl p-6">
          <p className="text-sm text-zinc-400">Total Revenue</p>
          <p className="text-3xl font-bold text-softGreen">{Number(stats.totalRevenue).toLocaleString()} RWF</p>
        </div>
        <div className="glass rounded-xl p-6">
          <p className="text-sm text-zinc-400">Active Waiters</p>
          <p className="text-3xl font-bold text-softGreen">{stats.activeWaiters}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2 border-b border-zinc-800">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 ${activeTab === "overview" ? "border-b-2 border-softGreen text-softGreen" : "text-zinc-400"}`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("waiters")}
          className={`px-4 py-2 ${activeTab === "waiters" ? "border-b-2 border-softGreen text-softGreen" : "text-zinc-400"}`}
        >
          Waiters
        </button>
        <button
          onClick={() => setActiveTab("reservations")}
          className={`px-4 py-2 ${activeTab === "reservations" ? "border-b-2 border-softGreen text-softGreen" : "text-zinc-400"}`}
        >
          Reservations
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div>
            <h2 className="mb-3 text-2xl font-semibold text-softGreen">Recent Reservations</h2>
            <div className="glass rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-zinc-800">
                  <tr>
                    <th className="p-3 text-left">Customer</th>
                    <th className="p-3 text-left">Table</th>
                    <th className="p-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentReservations?.map((r) => (
                    <tr key={r.id} className="border-t border-zinc-800">
                      <td className="p-3">{r.customer}</td>
                      <td className="p-3">{r.tableLabel}</td>
                      <td className="p-3">
                        <span className={`rounded px-2 py-1 text-xs ${
                          r.status === "approved" ? "bg-green-500/20 text-green-400" :
                          r.status === "pending" ? "bg-yellow-500/20 text-yellow-400" :
                          "bg-red-500/20 text-red-400"
                        }`}>{r.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-2xl font-semibold text-softGreen">Recent Orders</h2>
            <div className="glass rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-zinc-800">
                  <tr>
                    <th className="p-3 text-left">Order ID</th>
                    <th className="p-3 text-left">Customer</th>
                    <th className="p-3 text-left">Total</th>
                    <th className="p-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders?.map((o) => (
                    <tr key={o.id} className="border-t border-zinc-800">
                      <td className="p-3">#{o.id}</td>
                      <td className="p-3">{o.customer}</td>
                      <td className="p-3">{Number(o.total).toLocaleString()} RWF</td>
                      <td className="p-3">
                        <span className={`rounded px-2 py-1 text-xs ${
                          o.status === "completed" ? "bg-green-500/20 text-green-400" :
                          o.status === "preparing" ? "bg-yellow-500/20 text-yellow-400" :
                          "bg-blue-500/20 text-blue-400"
                        }`}>{o.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Waiters Tab */}
      {activeTab === "waiters" && (
        <div>
          <h2 className="mb-3 text-2xl font-semibold text-softGreen">Waiter Management</h2>
          <div className="space-y-3">
            {waiters.map((w) => (
              <div key={w.id} className="glass flex items-center justify-between rounded-xl p-4">
                <div>
                  <p className="font-semibold">{w.fullName}</p>
                  <p className="text-sm text-zinc-400">{w.email} • {w.phone}</p>
                  <span className={`mt-1 inline-block rounded px-2 py-1 text-xs ${
                    w.status === "active" ? "bg-green-500/20 text-green-400" :
                    w.status === "pending" ? "bg-yellow-500/20 text-yellow-400" :
                    "bg-red-500/20 text-red-400"
                  }`}>{w.status}</span>
                </div>
                {w.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => approveWaiter(w.id)}
                      className="rounded bg-softGreen px-4 py-2 text-white transition hover:bg-emerald-600"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => rejectWaiter(w.id)}
                      className="rounded bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reservations Tab */}
      {activeTab === "reservations" && (
        <div>
          <h2 className="mb-3 text-2xl font-semibold text-softGreen">Reservation Management</h2>
          <div className="space-y-3">
            {reservations.map((r) => (
              <div key={r.id} className="glass flex items-center justify-between rounded-xl p-4">
                <div>
                  <p className="font-semibold">{r.customer}</p>
                  <p className="text-sm text-zinc-400">
                    {r.tableLabel} • {r.guests} guests • {new Date(r.reservationDate).toLocaleDateString()} at {r.reservationTime}
                  </p>
                  <span className={`mt-1 inline-block rounded px-2 py-1 text-xs ${
                    r.status === "approved" ? "bg-green-500/20 text-green-400" :
                    r.status === "pending" ? "bg-yellow-500/20 text-yellow-400" :
                    "bg-red-500/20 text-red-400"
                  }`}>{r.status}</span>
                </div>
                {r.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => approveReservation(r.id)}
                      className="rounded bg-softGreen px-4 py-2 text-white transition hover:bg-emerald-600"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => rejectReservation(r.id)}
                      className="rounded bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
