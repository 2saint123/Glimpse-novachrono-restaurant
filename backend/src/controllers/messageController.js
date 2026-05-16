const db = require('../config/db');
const { logActivity } = require('../utils/logger');
const { sendEmail } = require('../config/mailer');

// Create message (Contact form)
exports.createMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    const user_id = req.user ? req.user.id : null;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const [result] = await db.execute(
      'INSERT INTO messages (user_id, name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?, ?)',
      [user_id, name, email, phone, subject, message]
    );

    if (user_id) {
      await logActivity(user_id, 'CREATE_MESSAGE', 'message', result.insertId, `Message sent: ${subject}`);
    }

    res.status(201).json({ message: 'Message sent successfully', messageId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all messages (Admin)
exports.getAllMessages = async (req, res) => {
  try {
    const { is_read, page = 1, limit = 10, search, startDate, endDate } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT m.*, u.full_name as user_name, r.full_name as replied_by_name
      FROM messages m
      LEFT JOIN users u ON m.user_id = u.id
      LEFT JOIN users r ON m.replied_by = r.id
      WHERE m.deleted_at IS NULL
    `;
    const params = [];

    if (is_read !== undefined) {
      query += ' AND m.is_read = ?';
      params.push(is_read === 'true' ? 1 : 0);
    }

    if (search) {
      query += ' AND (m.name LIKE ? OR m.email LIKE ? OR m.subject LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (startDate && endDate) {
      query += ' AND DATE(m.created_at) BETWEEN ? AND ?';
      params.push(startDate, endDate);
    }

    query += ' ORDER BY m.is_read ASC, m.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [messages] = await db.execute(query, params);

    const [[{ total }]] = await db.execute(
      'SELECT COUNT(*) as total FROM messages WHERE deleted_at IS NULL'
    );

    const [[{ unread }]] = await db.execute(
      'SELECT COUNT(*) as unread FROM messages WHERE is_read = 0 AND deleted_at IS NULL'
    );

    res.json({
      messages,
      unread,
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

// Get single message
exports.getMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const [[message]] = await db.execute(
      `SELECT m.*, u.full_name as user_name, r.full_name as replied_by_name
       FROM messages m
       LEFT JOIN users u ON m.user_id = u.id
       LEFT JOIN users r ON m.replied_by = r.id
       WHERE m.id = ? AND m.deleted_at IS NULL`,
      [id]
    );

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json({ message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark message as read
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    await db.execute('UPDATE messages SET is_read = 1 WHERE id = ?', [id]);

    await logActivity(req.user.id, 'MARK_MESSAGE_READ', 'message', id, `Message #${id} marked as read`);

    res.json({ message: 'Message marked as read' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Reply to message
exports.replyToMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;
    const admin_id = req.user.id;

    if (!reply) {
      return res.status(400).json({ error: 'Reply message is required' });
    }

    const [[message]] = await db.execute(
      'SELECT * FROM messages WHERE id = ? AND deleted_at IS NULL',
      [id]
    );

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    await db.execute(
      'UPDATE messages SET reply = ?, replied_by = ?, replied_at = NOW(), is_read = 1 WHERE id = ?',
      [reply, admin_id, id]
    );

    await logActivity(admin_id, 'REPLY_MESSAGE', 'message', id, `Replied to message #${id}`);

    // Send email reply
    await sendEmail(
      message.email,
      `Re: ${message.subject}`,
      `Dear ${message.name},\n\n${reply}\n\nBest regards,\nGlimpse Restaurant Team`
    );

    res.json({ message: 'Reply sent successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete message (soft delete)
exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    await db.execute('UPDATE messages SET deleted_at = NOW() WHERE id = ?', [id]);

    await logActivity(req.user.id, 'DELETE_MESSAGE', 'message', id, `Message #${id} deleted`);

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
