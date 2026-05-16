const pool = require("../config/db");
const { sendEmail } = require("../config/mailer");

const getAvailability = async (req, res, next) => {
  try {
    const { date, time } = req.query;
    if (!date || !time) return res.status(400).json({ message: "Date and time are required" });

    const [tables] = await pool.query("SELECT id, label, seats, status FROM restaurant_tables ORDER BY id");
    const [reserved] = await pool.query(
      "SELECT table_id FROM reservations WHERE reservation_date = ? AND reservation_time = ? AND status IN ('pending', 'approved')",
      [date, time]
    );
    const reservedIds = new Set(reserved.map((r) => r.table_id));

    const merged = tables.map((table) => ({
      ...table,
      status: table.status === "occupied" ? "occupied" : reservedIds.has(table.id) ? "reserved" : "available"
    }));
    res.json(merged);
  } catch (err) {
    next(err);
  }
};

const createReservation = async (req, res, next) => {
  try {
    const { tableId, reservationDate, reservationTime, guests, notes } = req.body;
    if (!tableId || !reservationDate || !reservationTime || !guests) {
      return res.status(400).json({ message: "Table, date, time, and guests are required" });
    }

    const [[table]] = await pool.query("SELECT seats, status FROM restaurant_tables WHERE id = ?", [tableId]);
    if (!table) return res.status(404).json({ message: "Table not found" });
    if (table.status === "occupied") return res.status(409).json({ message: "This table is currently occupied" });
    if (Number(guests) > Number(table.seats)) {
      return res.status(400).json({ message: "Guest count is greater than the selected table capacity" });
    }

    const [existing] = await pool.query(
      `SELECT id FROM reservations
       WHERE table_id = ? AND reservation_date = ? AND reservation_time = ?
         AND status IN ('pending', 'approved')
       LIMIT 1`,
      [tableId, reservationDate, reservationTime]
    );
    if (existing.length) return res.status(409).json({ message: "This table is already reserved for that time" });

    await pool.query(
      `INSERT INTO reservations (user_id, table_id, reservation_date, reservation_time, guests, notes, status)
       VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
      [req.user.id, tableId, reservationDate, reservationTime, guests, notes || null]
    );
    res.status(201).json({ message: "Reservation submitted and awaiting approval" });
  } catch (err) {
    next(err);
  }
};

const myReservations = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT r.id, r.reservation_date AS reservationDate, r.reservation_time AS reservationTime, r.guests, r.status, t.label AS tableLabel
       FROM reservations r
       JOIN restaurant_tables t ON t.id = r.table_id
       WHERE r.user_id = ?
       ORDER BY r.created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

const cancelReservation = async (req, res, next) => {
  try {
    await pool.query("UPDATE reservations SET status='cancelled' WHERE id=? AND user_id=?", [req.params.id, req.user.id]);
    res.json({ message: "Reservation cancelled" });
  } catch (err) {
    next(err);
  }
};

const approveReservation = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query("UPDATE reservations SET status='approved' WHERE id=?", [id]);
    const [rows] = await pool.query(
      `SELECT r.id, u.email, u.full_name AS fullName
       FROM reservations r JOIN users u ON u.id = r.user_id WHERE r.id = ?`,
      [id]
    );
    if (rows.length) {
      await sendEmail({
        to: rows[0].email,
        subject: "Reservation Approved - Glimpse Kigali",
        html: `<p>Hello ${rows[0].fullName}, your reservation has been approved. We look forward to hosting you.</p>`
      });
    }
    res.json({ message: "Reservation approved" });
  } catch (err) {
    next(err);
  }
};

const rejectReservation = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query("UPDATE reservations SET status='rejected' WHERE id=?", [id]);
    const [rows] = await pool.query(
      `SELECT r.id, u.email, u.full_name AS fullName
       FROM reservations r JOIN users u ON u.id = r.user_id WHERE r.id = ?`,
      [id]
    );
    if (rows.length) {
      await sendEmail({
        to: rows[0].email,
        subject: "Reservation Update - Glimpse Kigali",
        html: `<p>Hello ${rows[0].fullName}, your reservation request was not approved for the selected slot.</p>`
      });
    }
    res.json({ message: "Reservation rejected" });
  } catch (err) {
    next(err);
  }
};

const completeReservation = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query("UPDATE reservations SET status='completed' WHERE id=?", [id]);
    res.json({ message: "Reservation marked as completed" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAvailability,
  createReservation,
  myReservations,
  cancelReservation,
  approveReservation,
  rejectReservation,
  completeReservation
};
