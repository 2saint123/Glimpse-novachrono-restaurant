const db = require('../config/db');
const { logActivity } = require('../utils/logger');
const { sendEmail } = require('../config/mailer');

// Create payment
exports.createPayment = async (req, res) => {
  try {
    const { order_id, amount, method } = req.body;
    const user_id = req.user.id;

    const [result] = await db.execute(
      'INSERT INTO payments (order_id, user_id, amount, method, status) VALUES (?, ?, ?, ?, ?)',
      [order_id, user_id, amount, method, 'pending']
    );

    await logActivity(user_id, 'CREATE_PAYMENT', 'payment', result.insertId, `Payment created for order ${order_id}`);

    res.status(201).json({ message: 'Payment submitted successfully', paymentId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all payments (Admin)
exports.getAllPayments = async (req, res) => {
  try {
    const { status, page = 1, limit = 10, search, startDate, endDate } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT p.*, u.full_name, u.email, o.total as order_total,
             a.full_name as approved_by_name
      FROM payments p
      JOIN users u ON p.user_id = u.id
      JOIN orders o ON p.order_id = o.id
      LEFT JOIN users a ON p.approved_by = a.id
      WHERE p.deleted_at IS NULL
    `;
    const params = [];

    if (status) {
      query += ' AND p.status = ?';
      params.push(status);
    }

    if (search) {
      query += ' AND (u.full_name LIKE ? OR u.email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (startDate && endDate) {
      query += ' AND DATE(p.created_at) BETWEEN ? AND ?';
      params.push(startDate, endDate);
    }

    query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [payments] = await db.execute(query, params);

    const [[{ total }]] = await db.execute(
      'SELECT COUNT(*) as total FROM payments WHERE deleted_at IS NULL'
    );

    res.json({
      payments,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user payments
exports.getUserPayments = async (req, res) => {
  try {
    const user_id = req.user.id;

    const [payments] = await db.execute(
      `SELECT p.*, o.total as order_total
       FROM payments p
       JOIN orders o ON p.order_id = o.id
       WHERE p.user_id = ? AND p.deleted_at IS NULL
       ORDER BY p.created_at DESC`,
      [user_id]
    );

    res.json({ payments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Approve payment
exports.approvePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const admin_id = req.user.id;

    const [[payment]] = await db.execute(
      'SELECT p.*, u.email, u.full_name FROM payments p JOIN users u ON p.user_id = u.id WHERE p.id = ?',
      [id]
    );

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    if (payment.status !== 'pending') {
      return res.status(400).json({ error: 'Payment already processed' });
    }

    await db.execute(
      'UPDATE payments SET status = ?, approved_by = ?, approved_at = NOW() WHERE id = ?',
      ['approved', admin_id, id]
    );

    await db.execute(
      'UPDATE orders SET payment_status = ? WHERE id = ?',
      ['paid', payment.order_id]
    );

    await logActivity(admin_id, 'APPROVE_PAYMENT', 'payment', id, `Payment #${id} approved`);

    // Send email notification
    await sendEmail(
      payment.email,
      'Payment Approved - Glimpse Restaurant',
      `Dear ${payment.full_name},\n\nYour payment of ${payment.amount} RWF has been approved.\n\nThank you for dining with us!`
    );

    res.json({ message: 'Payment approved successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Decline payment
exports.declinePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const admin_id = req.user.id;

    if (!reason) {
      return res.status(400).json({ error: 'Decline reason is required' });
    }

    const [[payment]] = await db.execute(
      'SELECT p.*, u.email, u.full_name FROM payments p JOIN users u ON p.user_id = u.id WHERE p.id = ?',
      [id]
    );

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    if (payment.status !== 'pending') {
      return res.status(400).json({ error: 'Payment already processed' });
    }

    await db.execute(
      'UPDATE payments SET status = ?, decline_reason = ?, approved_by = ?, approved_at = NOW() WHERE id = ?',
      ['declined', reason, admin_id, id]
    );

    await logActivity(admin_id, 'DECLINE_PAYMENT', 'payment', id, `Payment #${id} declined: ${reason}`);

    // Send email notification
    await sendEmail(
      payment.email,
      'Payment Declined - Glimpse Restaurant',
      `Dear ${payment.full_name},\n\nYour payment of ${payment.amount} RWF has been declined.\n\nReason: ${reason}\n\nPlease contact us for more information.`
    );

    res.json({ message: 'Payment declined successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Upload receipt
exports.uploadReceipt = async (req, res) => {
  try {
    const { id } = req.params;
    const receipt_url = req.file ? `/uploads/${req.file.filename}` : null;

    if (!receipt_url) {
      return res.status(400).json({ error: 'Receipt file is required' });
    }

    await db.execute('UPDATE payments SET receipt_url = ? WHERE id = ?', [receipt_url, id]);

    res.json({ message: 'Receipt uploaded successfully', receipt_url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
