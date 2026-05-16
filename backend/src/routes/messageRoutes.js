const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { authenticate, authorize } = require('../middleware/auth');
const { validateMessage, validateReply } = require('../middleware/validation');

router.post('/', validateMessage, messageController.createMessage);
router.get('/', authenticate, authorize(['admin']), messageController.getAllMessages);
router.get('/:id', authenticate, authorize(['admin']), messageController.getMessage);
router.patch('/:id/read', authenticate, authorize(['admin']), messageController.markAsRead);
router.post('/:id/reply', authenticate, authorize(['admin']), validateReply, messageController.replyToMessage);
router.delete('/:id', authenticate, authorize(['admin']), messageController.deleteMessage);

module.exports = router;
