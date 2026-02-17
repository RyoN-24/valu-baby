const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seed...\n');

    // Delete existing products
    await prisma.product.deleteMany();
    console.log('🗑️  Cleared existing products\n');

    // Seed 20 products matching the frontend
    const products = [
        {
            name: 'Rosé Tulle Dress',
            description: 'Delicate tulle dress with rose details. Perfect for special occasions.',
            price: 189.00,
            images: ['https://images.unsplash.com/photo-1519689373023-dd07c7988603?w=800&q=80'],
            category: 'Vestidos',
            sizes: ['0-3M', '3-6M', '6-12M', '12-18M'],
            stock: 8,
            badge: 'Limited Stock'
        },
        {
            name: 'Pearl Lace Dress',
            description: 'Elegant white dress with pearl details and lace trim.',
            price: 199.00,
            images: ['https://images.unsplash.com/photo-1519238400177-d740f7d28e61?w=800&q=80'],
            category: 'Vestidos',
            sizes: ['0-3M', '3-6M', '6-12M', '12-18M', '18-24M'],
            stock: 5,
            badge: 'Limited'
        },
        {
            name: 'Mint Tutu Skirt',
            description: 'Fluffy tulle skirt in mint green. Adorable and comfortable.',
            price: 139.00,
            images: ['https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80'],
            category: 'Vestidos',
            sizes: ['6-12M', '12-18M', '18-24M'],
            stock: 12,
            badge: null
        },
        {
            name: 'Lavender Dream Dress',
            description: 'Soft lavender dress with delicate embroidery.',
            price: 179.00,
            images: ['https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?w=800&q=80'],
            category: 'Vestidos',
            sizes: ['0-3M', '3-6M', '6-12M', '12-18M'],
            stock: 15,
            badge: 'Best Seller'
        },
        {
            name: 'Champagne Gown',
            description: 'Luxurious champagne-colored gown for special events.',
            price: 259.00,
            images: ['https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800&q=80'],
            category: 'Vestidos',
            sizes: ['12-18M', '18-24M'],
            stock: 3,
            badge: 'Limited'
        },

        // Conjuntos
        {
            name: 'Soft Cotton Set',
            description: 'Organic cotton set with matching top and bloomers.',
            price: 139.00,
            images: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80'],
            category: 'Conjuntos',
            sizes: ['0-3M', '3-6M', '6-12M', '12-18M', '18-24M'],
            stock: 20,
            badge: 'Organic'
        },
        {
            name: 'Pastel Knit Set',
            description: 'Hand-knit cardigan and pants in pastel tones.',
            price: 169.00,
            images: ['https://images.unsplash.com/photo-1519238881500-d74ae3eee86c?w=800&q=80'],
            category: 'Conjuntos',
            sizes: ['0-3M', '3-6M', '6-12M', '12-18M'],
            stock: 10,
            badge: 'Handmade'
        },
        {
            name: 'Linen Summer Set',
            description: 'Breathable linen top and shorts for warm days.',
            price: 149.00,
            images: ['https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=800&q=80'],
            category: 'Conjuntos',
            sizes: ['6-12M', '12-18M', '18-24M'],
            stock: 18,
            badge: null
        },
        {
            name: 'Vintage Embroidered Set',
            description: 'Classic design with hand embroidery details.',
            price: 189.00,
            images: ['https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80'],
            category: 'Conjuntos',
            sizes: ['3-6M', '6-12M', '12-18M'],
            stock: 7,
            badge: 'Limited'
        },

        // Rompers
        {
            name: 'Rose Garden Romper',
            description: 'Playful romper with rose print pattern.',
            price: 129.00,
            images: ['https://images.unsplash.com/photo-1519238399278-0671778fcd08?w=800&q=80'],
            category: 'Rompers',
            sizes: ['0-3M', '3-6M', '6-12M', '12-18M', '18-24M'],
            stock: 25,
            badge: 'Best Seller'
        },
        {
            name: 'Lace Collar Romper',
            description: 'Elegant romper with lace collar detail.',
            price: 149.00,
            images: ['https://images.unsplash.com/photo-1514090458221-65bb69cf63e2?w=800&q=80'],
            category: 'Rompers',
            sizes: ['0-3M', '3-6M', '6-12M', '12-18M'],
            stock: 14,
            badge: null
        },
        {
            name: 'Bow Back Romper',
            description: 'Adorable romper with oversized bow on back.',
            price: 139.00,
            images: ['https://images.unsplash.com/photo-1519689200606-d87cd41ae327?w=800&q=80'],
            category: 'Rompers',
            sizes: ['0-3M', '3-6M', '6-12M'],
            stock: 16,
            badge: 'New'
        },
        {
            name: 'Floral Smocked Romper',
            description: 'Hand-smocked romper with floral embroidery.',
            price: 159.00,
            images: ['https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800&q=80'],
            category: 'Rompers',
            sizes: ['3-6M', '6-12M', '12-18M', '18-24M'],
            stock: 9,
            badge: 'Handmade'
        },
        {
            name: 'Linen Bubble Romper',
            description: 'Classic bubble romper in natural linen.',
            price: 169.00,
            images: ['https://images.unsplash.com/photo-1519689373023-dd07c7988603?w=800&q=80'],
            category: 'Rompers',
            sizes: ['6-12M', '12-18M', '18-24M'],
            stock: 11,
            badge: null
        },

        // Accesorios
        {
            name: 'Delicate Headband',
            description: 'Soft elastic headband with flower detail.',
            price: 39.00,
            images: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80'],
            category: 'Accesorios',
            sizes: ['One Size'],
            stock: 50,
            badge: null
        },
        {
            name: 'Bonnet with Lace',
            description: 'Vintage-style bonnet with delicate lace trim.',
            price: 69.00,
            images: ['https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=800&q=80'],
            category: 'Accesorios',
            sizes: ['0-6M', '6-12M'],
            stock: 30,
            badge: null
        },
        {
            name: 'Bow Hair Clips Set',
            description: 'Set of 3 handmade bow clips in assorted colors.',
            price: 49.00,
            images: ['https://images.unsplash.com/photo-1519238400177-d740f7d28e61?w=800&q=80'],
            category: 'Accesorios',
            sizes: ['One Size'],
            stock: 40,
            badge: 'Best Seller'
        },
        {
            name: 'Cashmere Blanket',
            description: 'Ultra-soft cashmere baby blanket.',
            price: 189.00,
            images: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80'],
            category: 'Accesorios',
            sizes: ['80x100cm'],
            stock: 15,
            badge: 'Premium'
        },

        // Special Items
        {
            name: 'Christening Gown',
            description: 'Heirloom-quality christening gown with intricate details.',
            price: 239.00,
            images: ['https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?w=800&q=80'],
            category: 'Especial',
            sizes: ['0-3M', '3-6M'],
            stock: 6,
            badge: 'Limited'
        },
        {
            name: 'Birthday Princess Set',
            description: 'Complete outfit set for first birthday celebrations.',
            price: 179.00,
            images: ['https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80'],
            category: 'Especial',
            sizes: ['12M'],
            stock: 10,
            badge: 'New'
        }
    ];

    console.log(`📦 Creating ${products.length} products...\n`);

    for (const product of products) {
        const created = await prisma.product.create({
            data: product
        });
        console.log(`✅ ${created.name}`);
    }

    console.log(`\n🎉 Seed complete! Created ${products.length} products.`);
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:');
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
