import Product from '../models/Product.js';
import { generateImageEmbedding } from '../utils/generateEmbedding.js';
import { searchSimilarProducts } from '../utils/vectorSearch.js';

/**
 * Visual search - Upload image and find similar products
 * POST /api/search/visual
 */
export const visualSearch = async (req, res) => {
    try {
        const { imageUrl } = req.body;

        if (!imageUrl) {
            return res.status(400).json({
                success: false,
                message: 'Image URL is required'
            });
        }

        console.log('🔍 Starting visual search...');

        // Step 1: Generate embedding for the uploaded image
        console.log('📸 Generating embedding for search image...');
        const { embedding, description } = await generateImageEmbedding(imageUrl);

        // Step 2: Search Pinecone for similar vectors
        console.log('🔎 Searching for similar products in Pinecone...');
        const similarVectors = await searchSimilarProducts(embedding, 5);

        if (similarVectors.length === 0) {
            return res.json({
                success: true,
                message: 'No similar products found',
                data: {
                    products: [],
                    searchDescription: description
                }
            });
        }

        // Step 3: Fetch full product details from MongoDB
        console.log('📦 Fetching product details from MongoDB...');
        const productIds = similarVectors.map(v => v.productId);
        const products = await Product.find({ _id: { $in: productIds } });

        // Step 4: Combine products with similarity scores
        const results = products.map(product => {
            const match = similarVectors.find(v => v.productId === product._id.toString());
            return {
                ...product.toObject(),
                similarityScore: match ? match.score : 0
            };
        });

        // Sort by similarity score (highest first)
        results.sort((a, b) => b.similarityScore - a.similarityScore);

        console.log(`✅ Found ${results.length} similar products`);

        res.json({
            success: true,
            message: `Found ${results.length} similar products`,
            data: {
                products: results,
                searchDescription: description,
                count: results.length
            }
        });

    } catch (error) {
        console.error('Error in visual search:', error);
        res.status(500).json({
            success: false,
            message: 'Error performing visual search',
            error: error.message
        });
    }
};

/**
 * Get similar products based on a product ID
 * GET /api/search/similar/:productId
 */
export const getSimilarProducts = async (req, res) => {
    try {
        const { productId } = req.params;

        // Find the source product
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        if (!product.hasEmbedding) {
            return res.status(400).json({
                success: false,
                message: 'Product does not have AI embedding yet. Please wait for processing.'
            });
        }

        console.log(`🔍 Finding products similar to: ${product.name}`);

        // Use the product's image to find similar products
        const { embedding } = await generateImageEmbedding(product.imageUrl);
        const similarVectors = await searchSimilarProducts(embedding, 6); // Get 6 to exclude self

        // Filter out the source product
        const filteredVectors = similarVectors.filter(v => v.productId !== productId);

        // Get top 5
        const top5 = filteredVectors.slice(0, 5);

        if (top5.length === 0) {
            return res.json({
                success: true,
                message: 'No similar products found',
                data: []
            });
        }

        // Fetch products from MongoDB
        const productIds = top5.map(v => v.productId);
        const products = await Product.find({ _id: { $in: productIds } });

        // Combine with scores
        const results = products.map(p => {
            const match = top5.find(v => v.productId === p._id.toString());
            return {
                ...p.toObject(),
                similarityScore: match ? match.score : 0
            };
        });

        results.sort((a, b) => b.similarityScore - a.similarityScore);

        res.json({
            success: true,
            message: `Found ${results.length} similar products`,
            data: results
        });

    } catch (error) {
        console.error('Error finding similar products:', error);
        res.status(500).json({
            success: false,
            message: 'Error finding similar products',
            error: error.message
        });
    }
};

export default {
    visualSearch,
    getSimilarProducts
};
