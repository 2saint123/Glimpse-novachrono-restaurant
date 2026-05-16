const db = require('../config/db');

exports.logActivity = async (user_id, action, entity_type, entity_id, details, ip_address = null) => {
  try {
    await db.execute(
      'INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details, ip_address) VALUES (?, ?, ?, ?, ?, ?)',
      [user_id, action, entity_type, entity_id, details, ip_address]
    );
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};
