import Product from '../models/Product.js';
import { generateImageEmbedding } from '../utils/generateEmbedding.js';
import { storeEmbedding, deleteEmbedding } from '../utils/vectorSearch.js';
import cloudinary from '../config/cloudinary.js';

/**
 * Get all products
 * GET /api/products
 */
export const getAllProducts = async (req, res) => {
    try {
        const { category, search, minPrice, maxPrice } = req.query;

        let query = {};

        // Filter by category
        if (category) {
            query.category = category;
        }

        // Text search
        if (search) {
            query.$text = { $search: search };
        }

        // Price range filter
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        const products = await Product.find(query).sort({ createdAt: -1 });

        res.json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching products',
            error: error.message
        });
    }
};

/**
 * Get single product by ID
 * GET /api/products/:id
 */
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching product',
            error: error.message
        });
    }
};

/**
 * Create new product (Admin only)
 * POST /api/products
 */
export const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, imageUrl, cloudinaryPublicId, inStock, stock, tags } = req.body;

        // Validate required fields
        if (!name || !description || !price || !category || !imageUrl) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Create product in MongoDB
        const product = await Product.create({
            name,
            description,
            price,
            category,
            imageUrl,
            cloudinaryPublicId,
            inStock,
            stock,
            tags
        });

        console.log(`✅ Product created: ${product._id}`);

        // Generate AI embedding asynchronously
        res.json({
            success: true,
            message: 'Product created successfully. AI embedding generation in progress...',
            data: product
        });

        // Generate and store embedding in background
        (async () => {
            try {
                console.log(`🔄 Generating embedding for product ${product._id}...`);
                const { embedding, description: aiDescription } = await generateImageEmbedding(imageUrl);

                // Store in Pinecone
                await storeEmbedding(product._id, embedding, {
                    name: product.name,
                    category: product.category,
                    aiDescription
                });

                // Update product with vector ID
                product.vectorId = product._id.toString();
                product.hasEmbedding = true;
                await product.save();

                console.log(`✅ Embedding stored for product ${product._id}`);
            } catch (error) {
                console.error(`❌ Error generating embedding for product ${product._id}:`, error.message);
            }
        })();

    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating product',
            error: error.message
        });
    }
};

/**
 * Update product
 * PUT /api/products/:id
 */
export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        const oldImageUrl = product.imageUrl;

        // Update product fields
        Object.assign(product, req.body);
        await product.save();

        // If image changed, regenerate embedding
        if (req.body.imageUrl && req.body.imageUrl !== oldImageUrl) {
            (async () => {
                try {
                    console.log(`🔄 Regenerating embedding for updated product ${product._id}...`);
                    const { embedding, description: aiDescription } = await generateImageEmbedding(req.body.imageUrl);

                    await storeEmbedding(product._id, embedding, {
                        name: product.name,
                        category: product.category,
                        aiDescription
                    });

                    product.hasEmbedding = true;
                    await product.save();

                    console.log(`✅ Embedding updated for product ${product._id}`);
                } catch (error) {
                    console.error(`❌ Error updating embedding for product ${product._id}:`, error.message);
                }
            })();
        }

        res.json({
            success: true,
            message: 'Product updated successfully',
            data: product
        });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating product',
            error: error.message
        });
    }
};

/**
 * Delete product
 * DELETE /api/products/:id
 */
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Delete image from Cloudinary
        if (product.cloudinaryPublicId) {
            try {
                await cloudinary.uploader.destroy(product.cloudinaryPublicId);
                console.log('🗑️ Deleted image from Cloudinary');
            } catch (error) {
                console.error('Error deleting from Cloudinary:', error);
            }
        }

        // Delete embedding from Pinecone
        if (product.vectorId) {
            try {
                await deleteEmbedding(product._id);
                console.log('🗑️ Deleted embedding from Pinecone');
            } catch (error) {
                console.error('Error deleting from Pinecone:', error);
            }
        }

        // Delete product from MongoDB
        await product.deleteOne();

        res.json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting product',
            error: error.message
        });
    }
};

export default {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
