import { getPineconeIndex } from '../config/pinecone.js';

/**
 * Store a product embedding in Pinecone
 */
export const storeEmbedding = async (productId, embedding, metadata = {}) => {
    try {
        const index = getPineconeIndex();

        // Prepare the vector record
        const record = {
            id: productId.toString(),
            values: embedding,
            metadata: {
                productId: productId.toString(),
                ...metadata
            }
        };

        // Upsert to Pinecone
        await index.upsert([record]);

        console.log(`✅ Stored embedding for product ${productId} in Pinecone`);
        return true;
    } catch (error) {
        console.error('Error storing embedding:', error.message);
        throw new Error('Failed to store embedding in Pinecone');
    }
};

/**
 * Search for similar products using vector similarity
 */
export const searchSimilarProducts = async (queryEmbedding, topK = 5) => {
    try {
        const index = getPineconeIndex();

        // Query Pinecone for similar vectors
        const queryResponse = await index.query({
            vector: queryEmbedding,
            topK: topK,
            includeMetadata: true
        });

        if (!queryResponse.matches || queryResponse.matches.length === 0) {
            console.log('⚠️ No similar products found');
            return [];
        }

        // Extract product IDs and similarity scores
        const results = queryResponse.matches.map(match => ({
            productId: match.metadata.productId,
            score: match.score,
            metadata: match.metadata
        }));

        console.log(`✅ Found ${results.length} similar products`);
        return results;
    } catch (error) {
        console.error('Error searching vectors:', error.message);
        throw new Error('Failed to search for similar products');
    }
};

/**
 * Delete a product embedding from Pinecone
 */
export const deleteEmbedding = async (productId) => {
    try {
        const index = getPineconeIndex();

        await index.deleteOne(productId.toString());

        console.log(`✅ Deleted embedding for product ${productId}`);
        return true;
    } catch (error) {
        console.error('Error deleting embedding:', error.message);
        throw new Error('Failed to delete embedding from Pinecone');
    }
};

/**
 * Update a product embedding in Pinecone
 */
export const updateEmbedding = async (productId, newEmbedding, metadata = {}) => {
    try {
        // In Pinecone, upsert handles both insert and update
        return await storeEmbedding(productId, newEmbedding, metadata);
    } catch (error) {
        console.error('Error updating embedding:', error.message);
        throw new Error('Failed to update embedding in Pinecone');
    }
};

export default {
    storeEmbedding,
    searchSimilarProducts,
    deleteEmbedding,
    updateEmbedding
};
