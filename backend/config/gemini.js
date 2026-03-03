import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Get the Gemini Pro Vision model for image understanding
export const getVisionModel = () => {
    return genAI.getGenerativeModel({ model: 'gemini-pro' });
};

// Get embedding model for generating vector embeddings
export const getEmbeddingModel = () => {
    return genAI.getGenerativeModel({ model: 'embedding-001' });
};

console.log('✅ Gemini AI configured');

export default genAI;
