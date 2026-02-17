const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// POST /api/cart/validate - Validate cart items and check availability
router.post('/validate', cartController.validateCart);

module.exports = router;
