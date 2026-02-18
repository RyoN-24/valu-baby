const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const orderController = require('../controllers/orderController');

// POST /api/orders - Create new order
router.post('/', orderController.createOrder);

// GET /api/orders - Get all orders (admin)
router.get('/', adminAuth, orderController.getAllOrders);

// GET /api/orders/:id - Get order by ID
router.get('/:id', orderController.getOrderById);

// GET /api/orders/number/:orderNumber - Get order by order number
router.get('/number/:orderNumber', orderController.getOrderByNumber);

// PUT /api/orders/:id/status - Update order status (admin)
router.put('/:id/status', adminAuth, orderController.updateOrderStatus);

// PUT /api/orders/:id/payment - Update payment status
router.put('/:id/payment', adminAuth, orderController.updatePaymentStatus);

module.exports = router;
