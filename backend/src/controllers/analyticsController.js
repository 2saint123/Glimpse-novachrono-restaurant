const db = require('../config/db');

// Get dashboard analytics
exports.getDashboardAnalytics = async (req, res) => {
  try {
    // Total revenue
    const [[{ total_revenue }]] = await db.execute(
      'SELECT COALESCE(SUM(amount), 0) as total_revenue FROM payments WHERE status = "approved" AND deleted_at IS NULL'
    );

    // Pending payments count
    const [[{ pending_payments }]] = await db.execute(
      'SELECT COUNT(*) as pending_payments FROM payments WHERE status = "pending" AND deleted_at IS NULL'
    );

    // Unread messages count
    const [[{ unread_messages }]] = await db.execute(
      'SELECT COUNT(*) as unread_messages FROM messages WHERE is_read = 0 AND deleted_at IS NULL'
    );

    // Total orders
    const [[{ total_orders }]] = await db.execute(
      'SELECT COUNT(*) as total_orders FROM orders WHERE deleted_at IS NULL'
    );

    // Total customers
    const [[{ total_customers }]] = await db.execute(
      'SELECT COUNT(*) as total_customers FROM users WHERE role = "customer" AND deleted_at IS NULL'
    );

    // Pending reservations
    const [[{ pending_reservations }]] = await db.execute(
      'SELECT COUNT(*) as pending_reservations FROM reservations WHERE status = "pending" AND deleted_at IS NULL'
    );

    // Revenue by month (last 6 months)
    const [revenue_by_month] = await db.execute(`
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        SUM(amount) as revenue
      FROM payments
      WHERE status = 'approved' AND deleted_at IS NULL
        AND created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month DESC
    `);

    // Recent payments
    const [recent_payments] = await db.execute(`
      SELECT p.*, u.full_name, u.email
      FROM payments p
      JOIN users u ON p.user_id = u.id
      WHERE p.deleted_at IS NULL
      ORDER BY p.created_at DESC
      LIMIT 5
    `);

    // Recent activity logs
    const [recent_activities] = await db.execute(`
      SELECT a.*, u.full_name
      FROM activity_logs a
      LEFT JOIN users u ON a.user_id = u.id
      ORDER BY a.created_at DESC
      LIMIT 10
    `);

    // Payment status breakdown
    const [payment_status] = await db.execute(`
      SELECT status, COUNT(*) as count, SUM(amount) as total
      FROM payments
      WHERE deleted_at IS NULL
      GROUP BY status
    `);

    res.json({
      summary: {
        total_revenue,
        pending_payments,
        unread_messages,
        total_orders,
        total_customers,
        pending_reservations
      },
      revenue_by_month,
      recent_payments,
      recent_activities,
      payment_status
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get sales analytics
exports.getSalesAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let dateFilter = '';
    const params = [];

    if (startDate && endDate) {
      dateFilter = 'AND DATE(o.created_at) BETWEEN ? AND ?';
      params.push(startDate, endDate);
    }

    // Sales by category
    const [sales_by_category] = await db.execute(`
      SELECT c.name, COUNT(oi.id) as items_sold, SUM(oi.quantity * oi.unit_price) as revenue
      FROM order_items oi
      JOIN menu_items m ON oi.menu_item_id = m.id
      JOIN categories c ON m.category_id = c.id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.deleted_at IS NULL ${dateFilter}
      GROUP BY c.id, c.name
      ORDER BY revenue DESC
    `, params);

    // Top selling items
    const [top_items] = await db.execute(`
      SELECT m.name, SUM(oi.quantity) as quantity_sold, SUM(oi.quantity * oi.unit_price) as revenue
      FROM order_items oi
      JOIN menu_items m ON oi.menu_item_id = m.id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.deleted_at IS NULL ${dateFilter}
      GROUP BY m.id, m.name
      ORDER BY quantity_sold DESC
      LIMIT 10
    `, params);

    // Daily sales
    const [daily_sales] = await db.execute(`
      SELECT DATE(created_at) as date, COUNT(*) as orders, SUM(total) as revenue
      FROM orders
      WHERE deleted_at IS NULL ${dateFilter}
      GROUP BY DATE(created_at)
      ORDER BY date DESC
      LIMIT 30
    `, params);

    res.json({
      sales_by_category,
      top_items,
      daily_sales
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get activity logs
exports.getActivityLogs = async (req, res) => {
  try {
    const { page = 1, limit = 20, action, entity_type, user_id } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT a.*, u.full_name, u.email
      FROM activity_logs a
      LEFT JOIN users u ON a.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (action) {
      query += ' AND a.action = ?';
      params.push(action);
    }

    if (entity_type) {
      query += ' AND a.entity_type = ?';
      params.push(entity_type);
    }

    if (user_id) {
      query += ' AND a.user_id = ?';
      params.push(user_id);
    }

    query += ' ORDER BY a.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [logs] = await db.execute(query, params);

    const [[{ total }]] = await db.execute('SELECT COUNT(*) as total FROM activity_logs');

    res.json({
      logs,
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
