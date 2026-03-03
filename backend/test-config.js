// Test Configuration Script
// Run this to verify all environment variables are set correctly
// Usage: node test-config.js

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '.env') });

console.log('\n🔍 Checking Environment Configuration...\n');
console.log('='.repeat(50));

const checks = [
    {
        name: 'MongoDB URI',
        key: 'MONGODB_URI',
        required: true,
        validate: (val) => val && val.includes('mongodb')
    },
    {
        name: 'Pinecone API Key',
        key: 'PINECONE_API_KEY',
        required: true,
        validate: (val) => val && val.length > 10
    },
    {
        name: 'Pinecone Environment',
        key: 'PINECONE_ENVIRONMENT',
        required: true,
        validate: (val) => val && val.length > 0
    },
    {
        name: 'Pinecone Index Name',
        key: 'PINECONE_INDEX_NAME',
        required: true,
        validate: (val) => val === 'product-embeddings'
    },
    {
        name: 'Gemini API Key',
        key: 'GEMINI_API_KEY',
        required: true,
        validate: (val) => val && val.startsWith('AIzaSy')
    },
    {
        name: 'Cloudinary Cloud Name',
        key: 'CLOUDINARY_CLOUD_NAME',
        required: true,
        validate: (val) => val && val.length > 0
    },
    {
        name: 'Cloudinary API Key',
        key: 'CLOUDINARY_API_KEY',
        required: true,
        validate: (val) => val && val.length > 10
    },
    {
        name: 'Cloudinary API Secret',
        key: 'CLOUDINARY_API_SECRET',
        required: true,
        validate: (val) => val && val.length > 10
    },
    {
        name: 'Server Port',
        key: 'PORT',
        required: false,
        validate: (val) => !val || !isNaN(val)
    },
    {
        name: 'Frontend URL',
        key: 'FRONTEND_URL',
        required: false,
        validate: (val) => !val || val.includes('http')
    }
];

let allPassed = true;

checks.forEach(check => {
    const value = process.env[check.key];
    const exists = !!value;
    const isValid = exists && check.validate(value);

    let status = '❌ MISSING';
    if (exists && isValid) {
        status = '✅ VALID';
    } else if (exists && !isValid) {
        status = '⚠️  INVALID';
    }

    if (check.required && !isValid) {
        allPassed = false;
    }

    console.log(`${status} ${check.name}`);

    if (exists && !isValid) {
        console.log(`   Value: ${value.substring(0, 20)}...`);
    }
});

console.log('='.repeat(50));

if (allPassed) {
    console.log('\n✨ All required configurations are valid!');
    console.log('🚀 You can now run: npm run dev\n');
} else {
    console.log('\n⚠️  Some required configurations are missing or invalid.');
    console.log('📖 Please check API_KEYS_GUIDE.md for setup instructions.\n');
    process.exit(1);
}

// Additional checks
console.log('\n📊 Additional Information:\n');
console.log(`Node Version: ${process.version}`);
console.log(`Platform: ${process.platform}`);
console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
console.log('');
