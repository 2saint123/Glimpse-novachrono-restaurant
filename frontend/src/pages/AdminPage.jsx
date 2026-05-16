import React, { useEffect, useState } from "react";
import api from "../services/api";
import { FiCheck, FiX, FiCheckCircle } from "react-icons/fi";

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

  const completeReservation = async (id) => {
    await api.patch(`/reservations/${id}/complete`);
    loadData();
  };

  if (!stats) return <div className="pt-28 text-center text-light">Loading...</div>;

  return (
    <div className="min-h-screen bg-dark">
      <div className="mx-auto max-w-7xl px-6 pt-28 pb-20">
        <h1 className="mb-6 text-4xl font-bold text-gold">Admin Dashboard</h1>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <div className="glass rounded-xl p-6">
            <p className="text-sm text-slate">Total Customers</p>
            <p className="text-3xl font-bold text-gold">{stats.totalCustomers}</p>
          </div>
          <div className="glass rounded-xl p-6">
            <p className="text-sm text-slate">Reservations</p>
            <p className="text-3xl font-bold text-gold">{stats.totalReservations}</p>
          </div>
          <div className="glass rounded-xl p-6">
            <p className="text-sm text-slate">Total Revenue</p>
            <p className="text-3xl font-bold text-gold">{Number(stats.totalRevenue).toLocaleString()} RWF</p>
          </div>
          <div className="glass rounded-xl p-6">
            <p className="text-sm text-slate">Active Waiters</p>
            <p className="text-3xl font-bold text-gold">{stats.activeWaiters}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b border-gold/20">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 font-semibold transition ${activeTab === "overview" ? "border-b-2 border-gold text-gold" : "text-slate hover:text-gold"}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("waiters")}
            className={`px-4 py-2 font-semibold transition ${activeTab === "waiters" ? "border-b-2 border-gold text-gold" : "text-slate hover:text-gold"}`}
          >
            Waiters
          </button>
          <button
            onClick={() => setActiveTab("reservations")}
            className={`px-4 py-2 font-semibold transition ${activeTab === "reservations" ? "border-b-2 border-gold text-gold" : "text-slate hover:text-gold"}`}
          >
            Reservations
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div>
              <h2 className="mb-3 text-2xl font-semibold text-gold">Recent Reservations</h2>
              <div className="glass rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-charcoal">
                    <tr>
                      <th className="p-3 text-left text-gold">Customer</th>
                      <th className="p-3 text-left text-gold">Table</th>
                      <th className="p-3 text-left text-gold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentReservations?.map((r) => (
                      <tr key={r.id} className="border-t border-gold/10">
                        <td className="p-3 text-light">{r.customer}</td>
                        <td className="p-3 text-light">{r.tableLabel}</td>
                        <td className="p-3">
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            r.status === "approved" ? "bg-emerald-500/20 text-emerald-400" :
                            r.status === "completed" ? "bg-blue-500/20 text-blue-400" :
                            r.status === "pending" ? "bg-amber-500/20 text-amber-400" :
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
              <h2 className="mb-3 text-2xl font-semibold text-gold">Recent Orders</h2>
              <div className="glass rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-charcoal">
                    <tr>
                      <th className="p-3 text-left text-gold">Order ID</th>
                      <th className="p-3 text-left text-gold">Customer</th>
                      <th className="p-3 text-left text-gold">Total</th>
                      <th className="p-3 text-left text-gold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentOrders?.map((o) => (
                      <tr key={o.id} className="border-t border-gold/10">
                        <td className="p-3 text-light">#{o.id}</td>
                        <td className="p-3 text-light">{o.customer}</td>
                        <td className="p-3 text-light">{Number(o.total).toLocaleString()} RWF</td>
                        <td className="p-3">
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            o.status === "completed" ? "bg-emerald-500/20 text-emerald-400" :
                            o.status === "preparing" ? "bg-amber-500/20 text-amber-400" :
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
            <h2 className="mb-3 text-2xl font-semibold text-gold">Waiter Management</h2>
            <div className="space-y-3">
              {waiters.map((w) => (
                <div key={w.id} className="glass flex items-center justify-between rounded-xl p-4">
                  <div>
                    <p className="font-semibold text-light">{w.fullName}</p>
                    <p className="text-sm text-slate">{w.email} • {w.phone}</p>
                    <span className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                      w.status === "active" ? "bg-emerald-500/20 text-emerald-400" :
                      w.status === "pending" ? "bg-amber-500/20 text-amber-400" :
                      "bg-red-500/20 text-red-400"
                    }`}>{w.status}</span>
                  </div>
                  {w.status === "pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => approveWaiter(w.id)}
                        className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white transition hover:bg-emerald-700"
                      >
                        <FiCheck /> Approve
                      </button>
                      <button
                        onClick={() => rejectWaiter(w.id)}
                        className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-700"
                      >
                        <FiX /> Reject
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
            <h2 className="mb-3 text-2xl font-semibold text-gold">Reservation Management</h2>
            <div className="space-y-3">
              {reservations.map((r) => (
                <div key={r.id} className="glass flex items-center justify-between rounded-xl p-4">
                  <div>
                    <p className="font-semibold text-light">{r.customer}</p>
                    <p className="text-sm text-slate">
                      {r.tableLabel} • {r.guests} guests • {new Date(r.reservationDate).toLocaleDateString()} at {r.reservationTime}
                    </p>
                    <span className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                      r.status === "approved" ? "bg-emerald-500/20 text-emerald-400" :
                      r.status === "completed" ? "bg-blue-500/20 text-blue-400" :
                      r.status === "pending" ? "bg-amber-500/20 text-amber-400" :
                      "bg-red-500/20 text-red-400"
                    }`}>{r.status}</span>
                  </div>
                  <div className="flex gap-2">
                    {r.status === "pending" && (
                      <>
                        <button
                          onClick={() => approveReservation(r.id)}
                          className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white transition hover:bg-emerald-700"
                        >
                          <FiCheck /> Approve
                        </button>
                        <button
                          onClick={() => rejectReservation(r.id)}
                          className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-700"
                        >
                          <FiX /> Reject
                        </button>
                      </>
                    )}
                    {r.status === "approved" && (
                      <button
                        onClick={() => completeReservation(r.id)}
                        className="flex items-center gap-2 rounded-lg bg-gradient px-4 py-2 font-semibold text-dark transition hover:shadow-lg hover:shadow-gold/30"
                      >
                        <FiCheckCircle /> Mark as Done
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
