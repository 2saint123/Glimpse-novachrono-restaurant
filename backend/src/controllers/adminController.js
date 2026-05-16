const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const pool = require("../config/db");
const { sendEmail } = require("../config/mailer");

// 1. ENHANCED DASHBOARD STATS
const dashboardStats = async (_, res, next) => {
  try {
    // Basic stats
    const [[customers]] = await pool.query("SELECT COUNT(*) AS totalCustomers FROM users WHERE role='customer'");
    const [[totalOrders]] = await pool.query("SELECT COUNT(*) AS totalOrders FROM orders");
    const [[revenue]] = await pool.query("SELECT COALESCE(SUM(total),0) AS totalRevenue FROM orders WHERE payment_status='paid'");
    const [[waiters]] = await pool.query("SELECT COUNT(*) AS activeWaiters FROM users WHERE role='waiter' AND status='active'");
    
    // Today's reservations
    const [[todayReservations]] = await pool.query(
      "SELECT COUNT(*) AS reservationsToday FROM reservations WHERE reservation_date = CURDATE()"
    );
    
    // Pending payments
    const [[pendingPayments]] = await pool.query(
      "SELECT COUNT(*) AS pendingPayments FROM orders WHERE payment_status='pending'"
    );
    
    // Popular foods (top 5)
    const [popularFoods] = await pool.query(
      `SELECT m.name, m.image_url AS imageUrl, SUM(oi.quantity) AS totalOrdered, m.price
       FROM order_items oi
       JOIN menu_items m ON m.id = oi.menu_item_id
       GROUP BY m.id
       ORDER BY totalOrdered DESC
       LIMIT 5`
    );
    
    // Recent reservations
    const [recentReservations] = await pool.query(
      `SELECT r.id, u.full_name AS customer, u.phone, t.label AS tableLabel, r.status, r.reservation_date AS reservationDate, r.reservation_time AS reservationTime
       FROM reservations r 
       JOIN users u ON u.id=r.user_id 
       JOIN restaurant_tables t ON t.id=r.table_id
       ORDER BY r.created_at DESC LIMIT 5`
    );
    
    // Recent orders
    const [recentOrders] = await pool.query(
      `SELECT o.id, u.full_name AS customer, o.total, o.status, o.payment_status AS paymentStatus, o.created_at AS createdAt
       FROM orders o JOIN users u ON u.id=o.user_id 
       ORDER BY o.created_at DESC LIMIT 5`
    );
    
    // Revenue by day (last 7 days)
    const [dailyRevenue] = await pool.query(
      `SELECT DATE(created_at) AS date, SUM(total) AS revenue
       FROM orders
       WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND payment_status='paid'
       GROUP BY DATE(created_at)
       ORDER BY date ASC`
    );
    
    // Order status breakdown
    const [ordersByStatus] = await pool.query(
      `SELECT status, COUNT(*) AS count FROM orders GROUP BY status`
    );
    
    res.json({
      ...customers,
      ...totalOrders,
      ...revenue,
      ...waiters,
      ...todayReservations,
      ...pendingPayments,
      popularFoods,
      recentReservations,
      recentOrders,
      dailyRevenue,
      ordersByStatus
    });
  } catch (err) {
    next(err);
  }
};

// 2. ANALYTICS & REPORTS
const getAnalytics = async (req, res, next) => {
  try {
    const { period = '7' } = req.query; // days
    
    // Revenue trend
    const [revenueTrend] = await pool.query(
      `SELECT DATE(created_at) AS date, SUM(total) AS revenue, COUNT(*) AS orders
       FROM orders
       WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY) AND payment_status='paid'
       GROUP BY DATE(created_at)
       ORDER BY date ASC`,
      [period]
    );
    
    // Best selling items
    const [bestSelling] = await pool.query(
      `SELECT m.id, m.name, m.category_id, c.name AS category, SUM(oi.quantity) AS totalSold, SUM(oi.quantity * oi.unit_price) AS revenue
       FROM order_items oi
       JOIN menu_items m ON m.id = oi.menu_item_id
       JOIN categories c ON c.id = m.category_id
       JOIN orders o ON o.id = oi.order_id
       WHERE o.created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
       GROUP BY m.id
       ORDER BY totalSold DESC
       LIMIT 10`,
      [period]
    );
    
    // Peak ordering times
    const [peakTimes] = await pool.query(
      `SELECT HOUR(created_at) AS hour, COUNT(*) AS orders
       FROM orders
       WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
       GROUP BY HOUR(created_at)
       ORDER BY hour ASC`,
      [period]
    );
    
    // Customer growth
    const [customerGrowth] = await pool.query(
      `SELECT DATE(created_at) AS date, COUNT(*) AS newCustomers
       FROM users
       WHERE role='customer' AND created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
       GROUP BY DATE(created_at)
       ORDER BY date ASC`,
      [period]
    );
    
    // Category performance
    const [categoryPerformance] = await pool.query(
      `SELECT c.name AS category, COUNT(DISTINCT oi.order_id) AS orders, SUM(oi.quantity * oi.unit_price) AS revenue
       FROM order_items oi
       JOIN menu_items m ON m.id = oi.menu_item_id
       JOIN categories c ON c.id = m.category_id
       JOIN orders o ON o.id = oi.order_id
       WHERE o.created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
       GROUP BY c.id
       ORDER BY revenue DESC`,
      [period]
    );
    
    res.json({
      revenueTrend,
      bestSelling,
      peakTimes,
      customerGrowth,
      categoryPerformance
    });
  } catch (err) {
    next(err);
  }
};

// 3. CUSTOMER MANAGEMENT
const listCustomers = async (_, res, next) => {
  try {
    const [customers] = await pool.query(
      `SELECT u.id, u.full_name AS fullName, u.email, u.phone, u.created_at AS createdAt,
        COUNT(DISTINCT o.id) AS totalOrders,
        COALESCE(SUM(o.total), 0) AS totalSpent,
        COUNT(DISTINCT r.id) AS totalReservations
       FROM users u
       LEFT JOIN orders o ON o.user_id = u.id
       LEFT JOIN reservations r ON r.user_id = u.id
       WHERE u.role = 'customer'
       GROUP BY u.id
       ORDER BY totalSpent DESC`
    );
    res.json(customers);
  } catch (err) {
    next(err);
  }
};

const getCustomerDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Customer info
    const [[customer]] = await pool.query(
      "SELECT id, full_name AS fullName, email, phone, created_at AS createdAt FROM users WHERE id=? AND role='customer'",
      [id]
    );
    
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    
    // Order history
    const [orders] = await pool.query(
      "SELECT id, total, status, payment_status AS paymentStatus, created_at AS createdAt FROM orders WHERE user_id=? ORDER BY created_at DESC",
      [id]
    );
    
    // Reservation history
    const [reservations] = await pool.query(
      `SELECT r.id, t.label AS tableLabel, r.reservation_date AS reservationDate, r.reservation_time AS reservationTime, r.guests, r.status
       FROM reservations r
       JOIN restaurant_tables t ON t.id = r.table_id
       WHERE r.user_id=?
       ORDER BY r.created_at DESC`,
      [id]
    );
    
    // Favorite foods
    const [favoriteFoods] = await pool.query(
      `SELECT m.id, m.name, m.image_url AS imageUrl, COUNT(*) AS orderCount
       FROM order_items oi
       JOIN menu_items m ON m.id = oi.menu_item_id
       JOIN orders o ON o.id = oi.order_id
       WHERE o.user_id=?
       GROUP BY m.id
       ORDER BY orderCount DESC
       LIMIT 5`,
      [id]
    );
    
    res.json({ customer, orders, reservations, favoriteFoods });
  } catch (err) {
    next(err);
  }
};

// 4. PAYMENT MANAGEMENT
const listPayments = async (_, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.id, p.order_id AS orderId, p.amount, p.method, p.status, p.created_at AS createdAt,
        u.full_name AS customer, u.phone
       FROM payments p
       JOIN orders o ON o.id=p.order_id
       JOIN users u ON u.id=o.user_id
       ORDER BY p.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

const getPaymentStats = async (_, res, next) => {
  try {
    // Total payments by status
    const [paymentsByStatus] = await pool.query(
      "SELECT status, COUNT(*) AS count, SUM(amount) AS total FROM payments GROUP BY status"
    );
    
    // Payments by method
    const [paymentsByMethod] = await pool.query(
      "SELECT method, COUNT(*) AS count, SUM(amount) AS total FROM payments WHERE status='paid' GROUP BY method"
    );
    
    // Daily revenue (last 30 days)
    const [dailyRevenue] = await pool.query(
      `SELECT DATE(created_at) AS date, SUM(amount) AS revenue
       FROM payments
       WHERE status='paid' AND created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
       GROUP BY DATE(created_at)
       ORDER BY date ASC`
    );
    
    // Monthly income
    const [monthlyIncome] = await pool.query(
      `SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, SUM(amount) AS revenue
       FROM payments
       WHERE status='paid' AND created_at >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
       GROUP BY DATE_FORMAT(created_at, '%Y-%m')
       ORDER BY month ASC`
    );
    
    res.json({ paymentsByStatus, paymentsByMethod, dailyRevenue, monthlyIncome });
  } catch (err) {
    next(err);
  }
};

// 5. ORDER MANAGEMENT
const listOrders = async (req, res, next) => {
  try {
    const { status } = req.query;
    let query = `SELECT o.id, u.full_name AS customer, u.phone, o.total, o.payment_status AS paymentStatus, o.status, o.created_at AS createdAt
       FROM orders o JOIN users u ON u.id=o.user_id`;
    const params = [];
    
    if (status) {
      query += " WHERE o.status=?";
      params.push(status);
    }
    
    query += " ORDER BY o.created_at DESC";
    
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

const getOrderDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const [[order]] = await pool.query(
      `SELECT o.id, o.user_id AS userId, u.full_name AS customer, u.email, u.phone,
        o.subtotal, o.tax, o.total, o.notes, o.payment_status AS paymentStatus, o.status, o.created_at AS createdAt
       FROM orders o
       JOIN users u ON u.id = o.user_id
       WHERE o.id=?`,
      [id]
    );
    
    if (!order) return res.status(404).json({ message: "Order not found" });
    
    const [items] = await pool.query(
      `SELECT oi.id, m.name, oi.quantity, oi.unit_price AS unitPrice, (oi.quantity * oi.unit_price) AS total
       FROM order_items oi
       JOIN menu_items m ON m.id = oi.menu_item_id
       WHERE oi.order_id=?`,
      [id]
    );
    
    res.json({ ...order, items });
  } catch (err) {
    next(err);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    await pool.query("UPDATE orders SET status=? WHERE id=?", [status, id]);
    res.json({ message: "Order status updated" });
  } catch (err) {
    next(err);
  }
};

// Existing functions
const listReservations = async (_, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT r.id, u.full_name AS customer, u.email, u.phone, t.label AS tableLabel, r.reservation_date AS reservationDate,
        r.reservation_time AS reservationTime, r.guests, r.status
       FROM reservations r JOIN users u ON u.id=r.user_id JOIN restaurant_tables t ON t.id=r.table_id
       ORDER BY r.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

const listWaiters = async (_, res, next) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, full_name AS fullName, email, phone, status, created_at AS createdAt FROM users WHERE role='waiter' ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

const listUsers = async (_, res, next) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, full_name AS fullName, email, phone, role, status, created_at AS createdAt FROM users ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

const approveWaiter = async (req, res, next) => {
  try {
    const waiterId = req.params.id;
    const tempPassword = crypto.randomBytes(5).toString("hex");
    const hashed = await bcrypt.hash(tempPassword, 10);
    await pool.query("UPDATE users SET status='active', password=?, must_change_password=1 WHERE id=? AND role='waiter'", [
      hashed,
      waiterId
    ]);
    const [rows] = await pool.query("SELECT email, full_name AS fullName FROM users WHERE id=?", [waiterId]);
    if (rows.length) {
      await sendEmail({
        to: rows[0].email,
        subject: "Waiter Account Approved",
        html: `<p>Hello ${rows[0].fullName}, your account was approved.<br/>Temporary password: <b>${tempPassword}</b><br/>Please change it after login.</p>`
      });
    }
    res.json({ message: "Waiter approved and credentials emailed" });
  } catch (err) {
    next(err);
  }
};

const rejectWaiter = async (req, res, next) => {
  try {
    await pool.query("UPDATE users SET status='rejected' WHERE id=? AND role='waiter'", [req.params.id]);
    res.json({ message: "Waiter rejected" });
  } catch (err) {
    next(err);
  }
};

const listTables = async (_, res, next) => {
  try {
    const [rows] = await pool.query("SELECT id, label, seats, status FROM restaurant_tables ORDER BY id");
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

const updateTableStatus = async (req, res, next) => {
  try {
    await pool.query("UPDATE restaurant_tables SET status=? WHERE id=?", [req.body.status, req.params.id]);
    res.json({ message: "Table status updated" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  dashboardStats,
  getAnalytics,
  listCustomers,
  getCustomerDetails,
  listPayments,
  getPaymentStats,
  listOrders,
  getOrderDetails,
  updateOrderStatus,
  listReservations,
  listWaiters,
  listUsers,
  approveWaiter,
  rejectWaiter,
  listTables,
  updateTableStatus
};
