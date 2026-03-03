import axios from 'axios';
import { getVisionModel } from '../config/gemini.js';

/**
 * Generate text description from image using Gemini Vision
 * This description will be used to create embeddings
 */
export const generateImageDescription = async (imageUrl) => {
    try {
        const model = getVisionModel();

        // Download image and convert to base64
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const base64Image = Buffer.from(response.data).toString('base64');
        const mimeType = response.headers['content-type'] || 'image/jpeg';

        // Generate detailed description
        const prompt = `Analyze this product image in detail. Describe:
1. The main item/product and its type
2. Colors, patterns, and visual style
3. Material appearance and texture
4. Key visual features and design elements
5. Any text or branding visible
6. Overall aesthetic and mood

Provide a comprehensive description that captures the visual essence of this product.`;

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Image,
                    mimeType: mimeType
                }
            }
        ]);

        const description = result.response.text();
        console.log('✅ Generated image description');
        return description;
    } catch (error) {
        console.error('Error generating image description:', error.message);
        throw new Error('Failed to generate image description');
    }
};

/**
 * Generate embedding vector from text using Gemini
 * This uses the text-embedding model
 */
export const generateTextEmbedding = async (text) => {
    try {
        const model = getVisionModel();

        // Use Gemini to generate embeddings
        const result = await model.embedContent(text);

        if (!result.embedding || !result.embedding.values) {
            throw new Error('Invalid embedding response');
        }

        const embedding = result.embedding.values;
        console.log(`✅ Generated embedding vector (dimension: ${embedding.length})`);

        return embedding;
    } catch (error) {
        console.error('Error generating text embedding:', error.message);
        throw new Error('Failed to generate embedding');
    }
};

/**
 * Complete pipeline: Image URL -> Description -> Embedding Vector
 */
export const generateImageEmbedding = async (imageUrl) => {
    try {
        console.log('🔄 Starting embedding generation pipeline...');

        // Step 1: Generate text description from image
        const description = await generateImageDescription(imageUrl);

        // Step 2: Generate embedding from description
        const embedding = await generateTextEmbedding(description);

        console.log('✅ Complete embedding pipeline finished');

        return {
            embedding,
            description
        };
    } catch (error) {
        console.error('Error in embedding pipeline:', error.message);
        throw error;
    }
};

export default {
    generateImageDescription,
    generateTextEmbedding,
    generateImageEmbedding
};
