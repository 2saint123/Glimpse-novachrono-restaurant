const pool = require("../config/db");
const { sendEmail } = require("../config/mailer");

const placeOrder = async (req, res, next) => {
  const conn = await pool.getConnection();
  try {
    const { items, notes, paymentStatus = "pending" } = req.body;
    if (!Array.isArray(items) || !items.length) {
      return res.status(400).json({ message: "Order must include at least one item" });
    }

    const [approved] = await conn.query(
      "SELECT id FROM reservations WHERE user_id=? AND status='approved' ORDER BY created_at DESC LIMIT 1",
      [req.user.id]
    );
    if (!approved.length) return res.status(403).json({ message: "Order allowed only for approved reservations." });

    const reservationId = approved[0].id;
    const ids = items.map((i) => i.menuItemId);
    const [menuRows] = await conn.query("SELECT id, price FROM menu_items WHERE id IN (?)", [ids]);
    if (menuRows.length !== new Set(ids).size) {
      return res.status(400).json({ message: "One or more menu items are invalid" });
    }

    const map = new Map(menuRows.map((m) => [m.id, Number(m.price)]));
    const subtotal = items.reduce((sum, item) => sum + (map.get(item.menuItemId) || 0) * item.quantity, 0);
    const tax = subtotal * 0.18;
    const total = subtotal + tax;

    await conn.beginTransaction();
    const [orderResult] = await conn.query(
      `INSERT INTO orders (user_id, reservation_id, subtotal, tax, total, notes, payment_status, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [req.user.id, reservationId, subtotal, tax, total, notes || null, paymentStatus]
    );

    for (const item of items) {
      const price = map.get(item.menuItemId) || 0;
      await conn.query(
        "INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price) VALUES (?, ?, ?, ?)",
        [orderResult.insertId, item.menuItemId, item.quantity, price]
      );
    }
    if (paymentStatus === "paid") {
      await conn.query(
        `INSERT INTO payments (order_id, amount, method, status)
         VALUES (?, ?, ?, ?)`,
        [orderResult.insertId, total, "online", "paid"]
      );
    }

    await conn.commit();

    const [admin] = await conn.query("SELECT email FROM users WHERE role='admin' LIMIT 1");
    const [customer] = await conn.query("SELECT email, full_name AS fullName FROM users WHERE id=?", [req.user.id]);

    if (admin.length) {
      await sendEmail({
        to: admin[0].email,
        subject: "New Customer Order",
        html: `<p>New order received. Total: ${total.toLocaleString()} RWF</p>`
      });
    }

    if (customer.length) {
      await sendEmail({
        to: customer[0].email,
        subject: "Order Received - Glimpse Restaurant",
        html: `<p>Hello ${customer[0].fullName},</p>
               <p>Your order has been received successfully.</p>
               <p><strong>Total:</strong> ${total.toLocaleString()} RWF</p>
               <p>Thank you for choosing Glimpse Restaurant.</p>`
      });
    }

    res.status(201).json({ message: "Order placed successfully", orderId: orderResult.insertId });
  } catch (err) {
    await conn.rollback();
    next(err);
  } finally {
    conn.release();
  }
};

const myOrders = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, subtotal, tax, total, status, payment_status AS paymentStatus, created_at AS createdAt FROM orders WHERE user_id=? ORDER BY created_at DESC",
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

const waiterOrders = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT o.id, o.status, o.total, t.label AS tableLabel, u.full_name AS customer
       FROM orders o
       JOIN reservations r ON r.id = o.reservation_id
       JOIN restaurant_tables t ON t.id = r.table_id
       JOIN users u ON u.id = o.user_id
       WHERE o.waiter_id = ? OR o.waiter_id IS NULL
       ORDER BY o.created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ["pending", "preparing", "served", "completed"];
    if (!allowedStatuses.includes(status)) return res.status(400).json({ message: "Invalid order status" });

    if (req.user.role === "waiter") {
      const [result] = await pool.query(
        "UPDATE orders SET status=?, waiter_id=COALESCE(waiter_id, ?) WHERE id=? AND (waiter_id IS NULL OR waiter_id=?)",
        [status, req.user.id, req.params.id, req.user.id]
      );
      if (!result.affectedRows) return res.status(403).json({ message: "Order is assigned to another waiter" });
      return res.json({ message: "Order status updated" });
    }

    await pool.query("UPDATE orders SET status=? WHERE id=?", [status, req.params.id]);
    res.json({ message: "Order status updated" });
  } catch (err) {
    next(err);
  }
};

module.exports = { placeOrder, myOrders, waiterOrders, updateOrderStatus };
