const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticate, authorize } = require('../middleware/auth');
const { validatePayment, validateDeclineReason } = require('../middleware/validation');
const { upload } = require('../middleware/upload');

router.post('/', authenticate, validatePayment, paymentController.createPayment);
router.get('/', authenticate, authorize(['admin']), paymentController.getAllPayments);
router.get('/mine', authenticate, paymentController.getUserPayments);
router.patch('/:id/approve', authenticate, authorize(['admin']), paymentController.approvePayment);
router.patch('/:id/decline', authenticate, authorize(['admin']), validateDeclineReason, paymentController.declinePayment);
router.post('/:id/receipt', authenticate, upload.single('receipt'), paymentController.uploadReceipt);

module.exports = router;
