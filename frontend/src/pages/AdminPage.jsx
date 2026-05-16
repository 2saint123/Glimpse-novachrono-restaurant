import React, { useEffect, useState } from "react";
import api from "../services/api";
import { 
  FiCheck, FiX, FiCheckCircle, FiDollarSign, FiUsers, FiShoppingBag, 
  FiCalendar, FiTrendingUp, FiClock, FiAlertCircle, FiEye, FiEdit, FiTrash2
} from "react-icons/fi";

export default function AdminPage() {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [waiters, setWaiters] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [paymentStats, setPaymentStats] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [orderFilter, setOrderFilter] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    api.get("/admin/dashboard").then(({ data }) => setStats(data));
    api.get("/admin/analytics?period=7").then(({ data }) => setAnalytics(data));
    api.get("/admin/customers").then(({ data }) => setCustomers(data));
    api.get("/admin/waiters").then(({ data }) => setWaiters(data));
    api.get("/admin/reservations").then(({ data }) => setReservations(data));
    api.get("/admin/orders").then(({ data }) => setOrders(data));
    api.get("/admin/payments").then(({ data }) => setPayments(data));
    api.get("/admin/payments/stats").then(({ data }) => setPaymentStats(data));
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

  const updateOrderStatus = async (id, status) => {
    await api.patch(`/admin/orders/${id}/status`, { status });
    loadData();
  };

  if (!stats) return <div className="min-h-screen bg-dark pt-28 text-center text-light">Loading...</div>;

  const filteredOrders = orderFilter ? orders.filter(o => o.status === orderFilter) : orders;

  return (
    <div className="min-h-screen bg-dark">
      <div className="mx-auto max-w-7xl px-6 pt-28 pb-20">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-bold text-gold">Admin Dashboard</h1>
          <div className="flex items-center gap-2 text-sm text-slate">
            <FiClock />
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate">Total Orders</p>
              <FiShoppingBag className="text-gold" />
            </div>
            <p className="text-3xl font-bold text-light">{stats.totalOrders}</p>
          </div>
          <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate">Revenue</p>
              <FiDollarSign className="text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-light">{Number(stats.totalRevenue).toLocaleString()} RWF</p>
          </div>
          <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate">Customers</p>
              <FiUsers className="text-blue-400" />
            </div>
            <p className="text-3xl font-bold text-light">{stats.totalCustomers}</p>
          </div>
          <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate">Today's Reservations</p>
              <FiCalendar className="text-purple-400" />
            </div>
            <p className="text-3xl font-bold text-light">{stats.reservationsToday}</p>
          </div>
          <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate">Pending Payments</p>
              <FiAlertCircle className="text-amber-400" />
            </div>
            <p className="text-3xl font-bold text-light">{stats.pendingPayments}</p>
          </div>
          <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate">Active Waiters</p>
              <FiUsers className="text-gold" />
            </div>
            <p className="text-3xl font-bold text-light">{stats.activeWaiters}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex flex-wrap gap-2 border-b border-gold/20">
          {["overview", "orders", "reservations", "customers", "payments", "analytics", "waiters"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-semibold capitalize transition ${
                activeTab === tab ? "border-b-2 border-gold text-gold" : "text-slate hover:text-gold"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Popular Foods */}
            <div>
              <h2 className="mb-4 flex items-center gap-2 text-2xl font-semibold text-gold">
                <FiTrendingUp /> Popular Foods
              </h2>
              <div className="grid gap-4 md:grid-cols-5">
                {stats.popularFoods?.map((food) => (
                  <div key={food.name} className="glass rounded-xl p-4">
                    <img src={food.imageUrl} alt={food.name} className="h-32 w-full rounded-lg object-cover mb-3" />
                    <p className="font-semibold text-light">{food.name}</p>
                    <p className="text-sm text-slate">Ordered: {food.totalOrdered}x</p>
                    <p className="text-sm text-gold">{Number(food.price).toLocaleString()} RWF</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <h2 className="mb-3 text-xl font-semibold text-gold">Recent Orders</h2>
                <div className="glass rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-charcoal">
                      <tr>
                        <th className="p-3 text-left text-gold">ID</th>
                        <th className="p-3 text-left text-gold">Customer</th>
                        <th className="p-3 text-left text-gold">Total</th>
                        <th className="p-3 text-left text-gold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentOrders?.slice(0, 5).map((o) => (
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

              <div>
                <h2 className="mb-3 text-xl font-semibold text-gold">Recent Reservations</h2>
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
                      {stats.recentReservations?.slice(0, 5).map((r) => (
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
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === "orders" && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gold">Order Management</h2>
              <select
                value={orderFilter}
                onChange={(e) => setOrderFilter(e.target.value)}
                className="rounded-lg border border-gold/30 bg-charcoal px-4 py-2 text-light outline-none"
              >
                <option value="">All Orders</option>
                <option value="pending">Pending</option>
                <option value="preparing">Preparing</option>
                <option value="served">Served</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="space-y-3">
              {filteredOrders.map((o) => (
                <div key={o.id} className="glass flex items-center justify-between rounded-xl p-4">
                  <div>
                    <p className="font-semibold text-light">Order #{o.id} - {o.customer}</p>
                    <p className="text-sm text-slate">
                      {o.phone} • {Number(o.total).toLocaleString()} RWF • {new Date(o.createdAt).toLocaleString()}
                    </p>
                    <div className="mt-2 flex gap-2">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        o.status === "completed" ? "bg-emerald-500/20 text-emerald-400" :
                        o.status === "preparing" ? "bg-amber-500/20 text-amber-400" :
                        "bg-blue-500/20 text-blue-400"
                      }`}>{o.status}</span>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        o.paymentStatus === "paid" ? "bg-emerald-500/20 text-emerald-400" :
                        "bg-red-500/20 text-red-400"
                      }`}>{o.paymentStatus}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {o.status !== "completed" && (
                      <select
                        value={o.status}
                        onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                        className="rounded-lg border border-gold/30 bg-charcoal px-3 py-2 text-sm text-light"
                      >
                        <option value="pending">Pending</option>
                        <option value="preparing">Preparing</option>
                        <option value="served">Served</option>
                        <option value="completed">Completed</option>
                      </select>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RESERVATIONS TAB */}
        {activeTab === "reservations" && (
          <div>
            <h2 className="mb-4 text-2xl font-semibold text-gold">Reservation Management</h2>
            <div className="space-y-3">
              {reservations.map((r) => (
                <div key={r.id} className="glass flex items-center justify-between rounded-xl p-4">
                  <div>
                    <p className="font-semibold text-light">{r.customer}</p>
                    <p className="text-sm text-slate">
                      {r.phone} • {r.tableLabel} • {r.guests} guests • {new Date(r.reservationDate).toLocaleDateString()} at {r.reservationTime}
                    </p>
                    <span className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
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
                        className="flex items-center gap-2 rounded-lg bg-gradient px-4 py-2 font-semibold text-dark transition hover:shadow-lg"
                      >
                        <FiCheckCircle /> Mark Done
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CUSTOMERS TAB */}
        {activeTab === "customers" && (
          <div>
            <h2 className="mb-4 text-2xl font-semibold text-gold">Customer Management</h2>
            <div className="glass rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-charcoal">
                  <tr>
                    <th className="p-3 text-left text-gold">Name</th>
                    <th className="p-3 text-left text-gold">Email</th>
                    <th className="p-3 text-left text-gold">Phone</th>
                    <th className="p-3 text-left text-gold">Orders</th>
                    <th className="p-3 text-left text-gold">Total Spent</th>
                    <th className="p-3 text-left text-gold">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c) => (
                    <tr key={c.id} className="border-t border-gold/10">
                      <td className="p-3 text-light">{c.fullName}</td>
                      <td className="p-3 text-slate">{c.email}</td>
                      <td className="p-3 text-slate">{c.phone}</td>
                      <td className="p-3 text-light">{c.totalOrders}</td>
                      <td className="p-3 text-gold">{Number(c.totalSpent).toLocaleString()} RWF</td>
                      <td className="p-3 text-slate">{new Date(c.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PAYMENTS TAB */}
        {activeTab === "payments" && paymentStats && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gold">Payment Dashboard</h2>
            
            <div className="grid gap-4 md:grid-cols-3">
              {paymentStats.paymentsByStatus?.map((ps) => (
                <div key={ps.status} className="glass rounded-xl p-6">
                  <p className="text-sm text-slate capitalize">{ps.status} Payments</p>
                  <p className="text-2xl font-bold text-light">{ps.count}</p>
                  <p className="text-gold">{Number(ps.total || 0).toLocaleString()} RWF</p>
                </div>
              ))}
            </div>

            <div>
              <h3 className="mb-3 text-xl font-semibold text-gold">Payment Methods</h3>
              <div className="grid gap-4 md:grid-cols-4">
                {paymentStats.paymentsByMethod?.map((pm) => (
                  <div key={pm.method} className="glass rounded-xl p-4">
                    <p className="text-sm text-slate capitalize">{pm.method || "Cash"}</p>
                    <p className="text-xl font-bold text-light">{pm.count}</p>
                    <p className="text-sm text-gold">{Number(pm.total).toLocaleString()} RWF</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-xl font-semibold text-gold">Recent Transactions</h3>
              <div className="glass rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-charcoal">
                    <tr>
                      <th className="p-3 text-left text-gold">ID</th>
                      <th className="p-3 text-left text-gold">Customer</th>
                      <th className="p-3 text-left text-gold">Amount</th>
                      <th className="p-3 text-left text-gold">Method</th>
                      <th className="p-3 text-left text-gold">Status</th>
                      <th className="p-3 text-left text-gold">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.slice(0, 10).map((p) => (
                      <tr key={p.id} className="border-t border-gold/10">
                        <td className="p-3 text-light">#{p.id}</td>
                        <td className="p-3 text-light">{p.customer}</td>
                        <td className="p-3 text-gold">{Number(p.amount).toLocaleString()} RWF</td>
                        <td className="p-3 text-slate capitalize">{p.method || "Cash"}</td>
                        <td className="p-3">
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            p.status === "paid" ? "bg-emerald-500/20 text-emerald-400" :
                            p.status === "failed" ? "bg-red-500/20 text-red-400" :
                            "bg-amber-500/20 text-amber-400"
                          }`}>{p.status}</span>
                        </td>
                        <td className="p-3 text-slate">{new Date(p.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === "analytics" && analytics && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gold">Analytics & Reports</h2>
            
            <div>
              <h3 className="mb-3 text-xl font-semibold text-gold">Best Selling Items (Last 7 Days)</h3>
              <div className="glass rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-charcoal">
                    <tr>
                      <th className="p-3 text-left text-gold">Item</th>
                      <th className="p-3 text-left text-gold">Category</th>
                      <th className="p-3 text-left text-gold">Sold</th>
                      <th className="p-3 text-left text-gold">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.bestSelling?.map((item) => (
                      <tr key={item.id} className="border-t border-gold/10">
                        <td className="p-3 text-light">{item.name}</td>
                        <td className="p-3 text-slate">{item.category}</td>
                        <td className="p-3 text-light">{item.totalSold}</td>
                        <td className="p-3 text-gold">{Number(item.revenue).toLocaleString()} RWF</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-xl font-semibold text-gold">Category Performance</h3>
              <div className="grid gap-4 md:grid-cols-5">
                {analytics.categoryPerformance?.map((cat) => (
                  <div key={cat.category} className="glass rounded-xl p-4">
                    <p className="font-semibold text-light">{cat.category}</p>
                    <p className="text-sm text-slate">{cat.orders} orders</p>
                    <p className="text-gold">{Number(cat.revenue).toLocaleString()} RWF</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-xl font-semibold text-gold">Revenue Trend (Last 7 Days)</h3>
              <div className="glass rounded-xl p-6">
                <div className="space-y-2">
                  {analytics.revenueTrend?.map((day) => (
                    <div key={day.date} className="flex items-center justify-between">
                      <span className="text-slate">{new Date(day.date).toLocaleDateString()}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-light">{day.orders} orders</span>
                        <span className="font-semibold text-gold">{Number(day.revenue).toLocaleString()} RWF</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* WAITERS TAB */}
        {activeTab === "waiters" && (
          <div>
            <h2 className="mb-4 text-2xl font-semibold text-gold">Waiter Management</h2>
            <div className="space-y-3">
              {waiters.map((w) => (
                <div key={w.id} className="glass flex items-center justify-between rounded-xl p-4">
                  <div>
                    <p className="font-semibold text-light">{w.fullName}</p>
                    <p className="text-sm text-slate">{w.email} • {w.phone}</p>
                    <span className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
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
      </div>
    </div>
  );
}
