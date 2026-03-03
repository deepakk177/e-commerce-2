import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import { generateImageEmbedding } from './utils/generateEmbedding.js';
import { storeEmbedding } from './utils/vectorSearch.js';

// Load environment variables
dotenv.config();

// Sample products with publicly available placeholder images
const sampleProducts = [
    {
        name: 'Premium Wireless Headphones',
        description: 'High-quality bluetooth headphones with noise cancellation, 30-hour battery life, and premium sound quality. Perfect for music lovers and professionals.',
        price: 149.99,
        category: 'Electronics',
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
        inStock: true,
        stock: 45,
        rating: 4.5,
        numReviews: 128,
        tags: ['wireless', 'bluetooth', 'audio', 'premium']
    },
    {
        name: 'Blue Floral Summer Dress',
        description: 'Elegant blue floral dress perfect for summer occasions. Made with breathable cotton blend fabric, features a flattering A-line silhouette and comfortable fit.',
        price: 79.99,
        category: 'Clothing',
        imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80',
        inStock: true,
        stock: 30,
        rating: 4.7,
        numReviews: 89,
        tags: ['dress', 'summer', 'floral', 'casual']
    },
    {
        name: 'Smart Fitness Watch',
        description: 'Track your fitness goals with this advanced smartwatch. Features heart rate monitoring, GPS, sleep tracking, and 7-day battery life. Water resistant up to 50m.',
        price: 199.99,
        category: 'Electronics',
        imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
        inStock: true,
        stock: 60,
        rating: 4.6,
        numReviews: 245,
        tags: ['smartwatch', 'fitness', 'health', 'tech']
    },
    {
        name: 'Professional Running Shoes',
        description: 'High-performance running shoes with advanced cushioning technology. Breathable mesh upper, responsive midsole, and durable rubber outsole for all terrains.',
        price: 89.99,
        category: 'Sports',
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
        inStock: true,
        stock: 75,
        rating: 4.8,
        numReviews: 312,
        tags: ['running', 'shoes', 'sports', 'athletic']
    },
    {
        name: 'Leather Laptop Backpack',
        description: 'Premium leather backpack with padded laptop compartment (fits up to 15.6"), multiple organizational pockets, and comfortable padded straps. Perfect for work and travel.',
        price: 129.99,
        category: 'Other',
        imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
        inStock: true,
        stock: 25,
        rating: 4.4,
        numReviews: 67,
        tags: ['backpack', 'leather', 'laptop', 'travel']
    },
    {
        name: 'Ergonomic Office Chair',
        description: 'Comfortable ergonomic office chair with adjustable lumbar support, breathable mesh back, and 360-degree swivel. Supports up to 300lbs.',
        price: 249.99,
        category: 'Home & Garden',
        imageUrl: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&q=80',
        inStock: true,
        stock: 15,
        rating: 4.3,
        numReviews: 54,
        tags: ['office', 'chair', 'furniture', 'ergonomic']
    },
    {
        name: 'Wireless Gaming Mouse',
        description: 'RGB gaming mouse with programmable buttons, adjustable DPI up to 16000, and ergonomic design. Wireless freedom with ultra-low latency technology.',
        price: 69.99,
        category: 'Electronics',
        imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80',
        inStock: true,
        stock: 50,
        rating: 4.5,
        numReviews: 178,
        tags: ['gaming', 'mouse', 'rgb', 'wireless']
    },
    {
        name: 'Stainless Steel Water Bottle',
        description: 'Double-walled insulated water bottle keeps drinks cold for 24 hours or hot for 12 hours. BPA-free, leak-proof lid, 32oz capacity. Perfect for gym, hiking, or daily use.',
        price: 34.99,
        category: 'Sports',
        imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80',
        inStock: true,
        stock: 100,
        rating: 4.9,
        numReviews: 423,
        tags: ['water bottle', 'insulated', 'sports', 'eco-friendly']
    }
];

async function seedDatabase() {
    try {
        console.log('🌱 Starting database seeding...\n');

        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Clear existing products
        const deleteResult = await Product.deleteMany({});
        console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing products\n`);

        // Add new products
        console.log('📦 Adding new products...\n');

        for (let i = 0; i < sampleProducts.length; i++) {
            const productData = sampleProducts[i];
            console.log(`${i + 1}/${sampleProducts.length} Creating: ${productData.name}`);

            try {
                // Create product with placeholder cloudinary ID
                const product = await Product.create({
                    ...productData,
                    cloudinaryPublicId: `seed_${Date.now()}_${i}`
                });

                console.log(`   ✅ Product created: ${product._id}`);

                // Generate AI embedding
                console.log(`   🤖 Generating AI embedding...`);
                const { embedding, description } = await generateImageEmbedding(productData.imageUrl);

                // Store in Pinecone
                console.log(`   📊 Storing vector in Pinecone...`);
                await storeEmbedding(product._id, embedding, {
                    name: product.name,
                    category: product.category,
                    aiDescription: description
                });

                // Update product
                product.vectorId = product._id.toString();
                product.hasEmbedding = true;
                await product.save();

                console.log(`   ✅ Embedding stored successfully`);
                console.log(`   📝 AI Description: ${description.substring(0, 100)}...\n`);

            } catch (error) {
                console.error(`   ❌ Error with ${productData.name}:`, error.message);
                console.log('   ⏭️  Continuing with next product...\n');
            }
        }

        console.log('\n🎉 Database seeding complete!');
        console.log(`📊 Total products: ${await Product.countDocuments()}`);
        console.log('🚀 You can now test the visual search feature!\n');

    } catch (error) {
        console.error('❌ Seeding error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('👋 Disconnected from MongoDB');
        process.exit(0);
    }
}

// Run the seeder
seedDatabase();
