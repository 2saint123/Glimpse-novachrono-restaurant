const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const pool = require("../config/db");
const { sendEmail } = require("../config/mailer");

const dashboardStats = async (_, res, next) => {
  try {
    const [[customers]] = await pool.query("SELECT COUNT(*) AS totalCustomers FROM users WHERE role='customer'");
    const [[reservations]] = await pool.query("SELECT COUNT(*) AS totalReservations FROM reservations");
    const [[revenue]] = await pool.query("SELECT COALESCE(SUM(total),0) AS totalRevenue FROM orders WHERE status='completed'");
    const [[waiters]] = await pool.query("SELECT COUNT(*) AS activeWaiters FROM users WHERE role='waiter' AND status='active'");
    const [recentReservations] = await pool.query(
      `SELECT r.id, u.full_name AS customer, t.label AS tableLabel, r.status
       FROM reservations r JOIN users u ON u.id=r.user_id JOIN restaurant_tables t ON t.id=r.table_id
       ORDER BY r.created_at DESC LIMIT 5`
    );
    const [recentOrders] = await pool.query(
      `SELECT o.id, u.full_name AS customer, o.total, o.status
       FROM orders o JOIN users u ON u.id=o.user_id ORDER BY o.created_at DESC LIMIT 5`
    );
    res.json({ ...customers, ...reservations, ...revenue, ...waiters, recentReservations, recentOrders });
  } catch (err) {
    next(err);
  }
};

const listReservations = async (_, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT r.id, u.full_name AS customer, u.email, t.label AS tableLabel, r.reservation_date AS reservationDate,
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
  listReservations,
  listWaiters,
  approveWaiter,
  rejectWaiter,
  listTables,
  updateTableStatus
};
