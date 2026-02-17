const prisma = require('../config/database');

// Validate cart items and check stock
exports.validateCart = async (req, res, next) => {
    try {
        const { items } = req.body; // [{ productId, quantity, size }]

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Cart items are required'
            });
        }

        const validatedItems = [];
        const errors = [];

        for (const item of items) {
            const product = await prisma.product.findUnique({
                where: { id: item.productId }
            });

            if (!product) {
                errors.push({
                    productId: item.productId,
                    error: 'Product not found'
                });
                continue;
            }

            // Check if requested size is available
            if (!product.sizes.includes(item.size)) {
                errors.push({
                    productId: item.productId,
                    productName: product.name,
                    error: ` Size ${item.size} not available`
                });
                continue;
            }

            // Check stock availability
            if (product.stock < item.quantity) {
                errors.push({
                    productId: item.productId,
                    productName: product.name,
                    error: `Insufficient stock. Available: ${product.stock}, Requested: ${item.quantity}`
                });
                continue;
            }

            validatedItems.push({
                productId: product.id,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
                size: item.size,
                images: product.images,
                subtotal: parseFloat(product.price) * item.quantity
            });
        }

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                errors,
                validItems: validatedItems
            });
        }

        const total = validatedItems.reduce((sum, item) => sum + item.subtotal, 0);

        res.json({
            success: true,
            items: validatedItems,
            subtotal: total,
            itemCount: validatedItems.reduce((sum, item) => sum + item.quantity, 0)
        });
    } catch (error) {
        next(error);
    }
};
