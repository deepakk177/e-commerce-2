
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import pineconeClient from './config/pinecone.js';

dotenv.config();

const products = [
    // ELECTRONICS
    {
        name: "Apple MacBook Pro M3 Max",
        description: "The most powerful MacBook Pro ever. Blazing-fast performance with the M3 Max chip, a stunning Liquid Retina XDR display, and up to 22 hours of battery life. Perfect for creative professionals and power users.",
        price: 3199,
        category: "Electronics",
        imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&q=80&w=1000",
        cloudinaryPublicId: "seed_macbook_m3",
        inStock: true,
        stock: 50,
        rating: 4.9,
        numReviews: 128,
        tags: ["laptop", "apple", "m3", "pro", "computer", "tech"]
    },
    {
        name: "Sony WH-1000XM5 Noise Canceling Headphones",
        description: "Industry-leading noise cancellation with two processors controlling eight microphones for unprecedented noise cancellation and exceptional call quality. ultra-comfortable, lightweight design with soft fit leather.",
        price: 348,
        category: "Electronics",
        imageUrl: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=1000",
        cloudinaryPublicId: "seed_sony_xm5",
        inStock: true,
        stock: 120,
        rating: 4.8,
        numReviews: 856,
        tags: ["headphones", "sony", "audio", "noise-canceling", "music"]
    },
    {
        name: "PlayStation 5 Console (Slim)",
        description: "Experience lightning-fast loading with an ultra-high-speed SSD, deeper immersion with support for haptic feedback, adaptive triggers, and 3D Audio, and an all-new generation of incredible PlayStation games.",
        price: 499,
        category: "Electronics",
        imageUrl: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&q=80&w=1000",
        cloudinaryPublicId: "seed_ps5",
        inStock: true,
        stock: 15,
        rating: 4.9,
        numReviews: 3402,
        tags: ["gaming", "console", "sony", "ps5", "video games"]
    },
    {
        name: "Fujifilm X100V Digital Camera",
        description: "The fifth generation of the X100 Series, featuring a newly designed 23mmF2 lens, advanced Hybrid Viewfinder, weather resistance, and the latest X-Trans CMOS 4 sensor and X-Processor 4.",
        price: 1399,
        category: "Electronics",
        imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1000",
        cloudinaryPublicId: "seed_fuji_x100v",
        inStock: false,
        stock: 0,
        rating: 4.7,
        numReviews: 45,
        tags: ["camera", "photography", "fujifilm", "digital", "retro"]
    },
    {
        name: "Logitech MX Master 3S",
        description: "Meet MX Master 3S – an iconic mouse remastered. Feel every moment of your workflow with even more precision, tactility, and performance, thanks to Quiet Clicks and an 8,000 DPI track-on-glass sensor.",
        price: 99,
        category: "Electronics",
        imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=1000",
        cloudinaryPublicId: "seed_mx_master_3s",
        inStock: true,
        stock: 42,
        rating: 4.8,
        numReviews: 215,
        tags: ["mouse", "logitech", "office", "peripheral", "wireless"]
    },
    {
        name: "Apple Watch Series 9",
        description: "Smarter. Brighter. Mightier. The most powerful chip in Apple Watch ever. A magical new way to use your Apple Watch without touching the screen. A display that's twice as bright.",
        price: 399,
        category: "Electronics",
        imageUrl: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=1000",
        cloudinaryPublicId: "seed_apple_watch_9",
        inStock: true,
        stock: 25,
        rating: 4.9,
        numReviews: 531,
        tags: ["wearable", "apple", "smartwatch", "fitness", "health"]
    },

    // CLOTHING / FASHION
    {
        name: "Nike Air Jordan 1 High OG",
        description: "The shoe that started it all. The Air Jordan 1 Retro High OG brings back the classic style with premium leather, comfortable cushioning, and the iconic Wings logo.",
        price: 180,
        category: "Clothing",
        imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=1000",
        cloudinaryPublicId: "seed_jordan_1",
        inStock: true,
        stock: 200,
        rating: 4.6,
        numReviews: 1250,
        tags: ["sneakers", "nike", "jordan", "shoes", "fashion", "streetwear"]
    },
    {
        name: "Zara Premium Wool Blend Blazer",
        description: "Tailored blazer made of a wool blend. Lapel collar with long sleeves and buttoned cuffs. Welt pocket at the chest and flap pockets at the hip. Central back vent. Front button closure.",
        price: 129,
        category: "Clothing",
        imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=1000",
        cloudinaryPublicId: "seed_zara_blazer",
        inStock: true,
        stock: 45,
        rating: 4.3,
        numReviews: 89,
        tags: ["fashion", "formal", "coat", "jacket", "men", "clothing"]
    },
    {
        name: "Ray-Ban Aviator Classic",
        description: "Currently one of the most iconic sunglass models in the world, Ray-Ban Aviator Classic sunglasses were originally designed for U.S. Aviators in 1937. Timeless model that combines great aviator styling with exceptional quality.",
        price: 163,
        category: "Clothing",
        imageUrl: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=1000",
        cloudinaryPublicId: "seed_rayban",
        inStock: true,
        stock: 80,
        rating: 4.8,
        numReviews: 412,
        tags: ["sunglasses", "accessories", "fashion", "summer", "eyewear"]
    },
    {
        name: "North Face Borealis Backpack",
        description: "The classic Borealis Backpack features a suspension system for all-day comfort, a laptop compartment, and plenty of organization for your daily commute or weekend adventure.",
        price: 99,
        category: "Clothing",
        imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=1000",
        cloudinaryPublicId: "seed_northface_backpack",
        inStock: true,
        stock: 60,
        rating: 4.7,
        numReviews: 892,
        tags: ["backpack", "travel", "bag", "school", "outdoor"]
    },

    // HOME & GARDEN / OTHER
    {
        name: "Herman Miller Aeron Chair",
        description: "The Aeron Chair combines a deep knowledge of human-centered design with cutting-edge technology. With over 7 million sold, it has been admired and used for over 20 years, setting the benchmark for ergonomic comfort.",
        price: 1695,
        category: "Home & Garden",
        imageUrl: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=1000",
        cloudinaryPublicId: "seed_aeron",
        inStock: true,
        stock: 12,
        rating: 4.9,
        numReviews: 210,
        tags: ["furniture", "office", "chair", "ergonomic", "home"]
    },
    {
        name: "Dyson V15 Detect Vacuum",
        description: "Engineered for deep cleaning. Laser reveals microscopic dust. Intelligently optimizes suction and run time. Scientific proof of deep cleaning. Two advanced cleaner heads for carpets and hard floors.",
        price: 749,
        category: "Home & Garden",
        imageUrl: "https://images.unsplash.com/photo-1558317374-a35425508b52?auto=format&fit=crop&q=80&w=1000", // Generic vacuum placeholder if specific not found
        cloudinaryPublicId: "seed_dyson_v15",
        inStock: true,
        stock: 35,
        rating: 4.7,
        numReviews: 532,
        tags: ["home", "appliance", "cleaning", "vacuum", "technology"]
    },
    {
        name: "DJI Mini 3 Pro Drone",
        description: "Weighing less than 249 g, Mini 3 Pro doesn't require registration in most countries. Foldable and compact design makes it easy to carry on any adventure. 4K/60fps video and 48MP photo.",
        price: 759,
        category: "Electronics",
        imageUrl: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&q=80&w=1000",
        cloudinaryPublicId: "seed_drone",
        inStock: true,
        stock: 22,
        rating: 4.8,
        numReviews: 145,
        tags: ["drone", "camera", "photography", "flying", "gadget"]
    }
];

const seedProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing products
        await Product.deleteMany({});
        console.log('🗑️  Cleared existing products');

        // Also clear Pinecone if possible - though this script won't have direct access
        // to the vector IDs unless we list them. For now, we'll just clear Mongo
        // and let the user know they might want to clear Pinecone or just ignore old vectors.

        const createdProducts = await Product.insertMany(products);
        console.log(`✨ Added ${createdProducts.length} high-quality products`);

        console.log('⚠️  Note: Embeddings have NOT been generated for these products yet.');
        console.log('   The background worker in the main app will need to process them,');
        console.log('   OR you can manually trigger updates if the app is running.');

        process.exit();
    } catch (error) {
        console.error(`❌ Error seeding products: ${error.message}`);
        process.exit(1);
    }
};

seedProducts();
