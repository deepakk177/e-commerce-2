import { Pinecone } from '@pinecone-database/pinecone';

let pineconeClient = null;
let pineconeIndex = null;

export const initPinecone = async () => {
    try {
        pineconeClient = new Pinecone({
            apiKey: process.env.PINECONE_API_KEY,
        });

        console.log('✅ Pinecone client initialized');

        // Get the index
        const indexName = process.env.PINECONE_INDEX_NAME || 'product-embeddings';

        try {
            pineconeIndex = pineconeClient.index(indexName);
            console.log(`📊 Connected to Pinecone index: ${indexName}`);
        } catch (error) {
            console.warn(`⚠️ Index '${indexName}' not found. Please create it in your Pinecone dashboard.`);
            console.warn(`   Dimension: 768 (for Gemini embeddings)`);
            console.warn(`   Metric: cosine`);
        }

        return pineconeClient;
    } catch (error) {
        console.error(`❌ Pinecone Initialization Error: ${error.message}`);
        throw error;
    }
};

export const getPineconeIndex = () => {
    if (!pineconeIndex) {
        const indexName = process.env.PINECONE_INDEX_NAME || 'product-embeddings';
        pineconeIndex = pineconeClient.index(indexName);
    }
    return pineconeIndex;
};

export default pineconeClient;
