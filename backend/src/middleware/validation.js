exports.validatePayment = (req, res, next) => {
  const { order_id, amount, method } = req.body;

  if (!order_id || !amount || !method) {
    return res.status(400).json({ error: 'Order ID, amount, and method are required' });
  }

  if (amount <= 0) {
    return res.status(400).json({ error: 'Amount must be greater than 0' });
  }

  next();
};

exports.validateMessage = (req, res, next) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  next();
};

exports.validateDeclineReason = (req, res, next) => {
  const { reason } = req.body;

  if (!reason || reason.trim().length < 10) {
    return res.status(400).json({ error: 'Decline reason must be at least 10 characters' });
  }

  next();
};

exports.validateReply = (req, res, next) => {
  const { reply } = req.body;

  if (!reply || reply.trim().length < 10) {
    return res.status(400).json({ error: 'Reply must be at least 10 characters' });
  }

  next();
};
