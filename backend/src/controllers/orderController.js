const prisma = require('../config/database');
const emailService = require('../services/emailService');

// Generate unique order number
const generateOrderNumber = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `VB-${timestamp}-${random}`;
};

// Create new order
exports.createOrder = async (req, res, next) => {
    try {
        const {
            customerName,
            customerEmail,
            customerPhone,
            customerDNI,
            shippingAddress,
            items, // [{ productId, quantity, size, price }]
            subtotal,
            shipping,
            total,
            paymentMethod,
            notes
        } = req.body;

        // Validate required fields
        if (!customerName || !customerEmail || !customerPhone || !shippingAddress || !items || items.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }

        // Create order with items
        const order = await prisma.order.create({
            data: {
                orderNumber: generateOrderNumber(),
                customerName,
                customerEmail,
                customerPhone,
                customerDNI,
                shippingAddress,
                subtotal,
                shipping,
                total,
                paymentMethod,
                notes,
                items: {
                    create: items.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        size: item.size,
                        price: item.price
                    }))
                }
            },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        // Send Async Emails (don't block response)
        emailService.sendOrderConfirmation(order).catch(err => console.error(err));
        emailService.sendAdminNotification(order).catch(err => console.error(err));

        // TODO: Send WhatsApp notification (Phase 5)

        res.status(201).json({
            success: true,
            data: order
        });
    } catch (error) {
        next(error);
    }
};

// Get order by ID
exports.getOrderById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        next(error);
    }
};

// Get order by order number
exports.getOrderByNumber = async (req, res, next) => {
    try {
        const { orderNumber } = req.params;

        const order = await prisma.order.findUnique({
            where: { orderNumber },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        next(error);
    }
};

// Get all orders (admin)
exports.getAllOrders = async (req, res, next) => {
    try {
        const { status, limit = 50 } = req.query;

        const where = status ? { status } : {};

        const orders = await prisma.order.findMany({
            where,
            take: parseInt(limit),
            orderBy: { createdAt: 'desc' },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        res.json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        next(error);
    }
};

// Update order status (admin)
exports.updateOrderStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const order = await prisma.order.update({
            where: { id },
            data: { status },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        // TODO: Send status update email/WhatsApp

        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        next(error);
    }
};

// Update payment status
exports.updatePaymentStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { paymentStatus, paymentId } = req.body;

        const order = await prisma.order.update({
            where: { id },
            data: {
                paymentStatus,
                paymentId
            }
        });

        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        next(error);
    }
};
