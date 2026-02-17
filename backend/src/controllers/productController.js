const prisma = require('../config/database');

// Get all products
exports.getAllProducts = async (req, res, next) => {
    try {
        const { category } = req.query;

        const where = category ? { category } : {};

        const products = await prisma.product.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });

        res.json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        next(error);
    }
};

// Get single product by ID
exports.getProductById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const product = await prisma.product.findUnique({
            where: { id }
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }

        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        next(error);
    }
};

// Create new product (admin)
exports.createProduct = async (req, res, next) => {
    try {
        const { name, description, price, images, category, sizes, stock, badge } = req.body;

        const product = await prisma.product.create({
            data: {
                name,
                description,
                price,
                images,
                category,
                sizes,
                stock: stock || 0,
                badge
            }
        });

        res.status(201).json({
            success: true,
            data: product
        });
    } catch (error) {
        next(error);
    }
};

// Update product (admin)
exports.updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, description, price, images, category, sizes, stock, badge } = req.body;

        const product = await prisma.product.update({
            where: { id },
            data: {
                name,
                description,
                price,
                images,
                category,
                sizes,
                stock,
                badge
            }
        });

        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        next(error);
    }
};

// Delete product (admin)
exports.deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;

        await prisma.product.delete({
            where: { id }
        });

        res.json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};
