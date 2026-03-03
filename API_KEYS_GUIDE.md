# 🔑 API Keys Setup Guide

This guide will help you obtain all the required API keys for the AI E-Commerce Visual Search application.

## 1. 🍃 MongoDB Atlas

### What is it?

Cloud-hosted MongoDB database for storing product metadata.

### Steps to Get API Key

1. **Sign Up**
   - Go to: <https://www.mongodb.com/cloud/atlas/register>
   - Create a free account
   - Verify your email

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose "Free Shared" tier (M0)
   - Select a cloud provider and region near you
   - Click "Create Cluster"

3. **Configure Database Access**
   - Go to "Database Access" in left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Set username and password (save these!)
   - Grant "Read and write to any database" permission
   - Click "Add User"

4. **Configure Network Access**
   - Go to "Network Access" in left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" in left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `ecommerce`

**Your MongoDB URI:**

```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority
```

---

## 2. 📌 Pinecone

### What is it?

Vector database for storing and querying image embeddings for visual search.

### Steps to Get API Key

1. **Sign Up**
   - Go to: <https://www.pinecone.io/>
   - Click "Start Free"
   - Create account (GitHub/Google login available)

2. **Get API Key**
   - After login, go to "API Keys" in left sidebar
   - Copy your API key
   - Note your environment (e.g., `us-west1-gcp`)

3. **Create Index**
   - Click "Indexes" in left sidebar
   - Click "Create Index"
   - **Index name:** `product-embeddings`
   - **Dimensions:** `768` (important!)
   - **Metric:** `cosine`
   - **Cloud provider:** Choose any (free tier)
   - Click "Create Index"

**Your Pinecone Config:**

```
PINECONE_API_KEY=your-api-key-here
PINECONE_ENVIRONMENT=us-west1-gcp
PINECONE_INDEX_NAME=product-embeddings
```

---

## 3. 🤖 Google Gemini API

### What is it?

AI model for understanding images and generating embeddings.

### Steps to Get API Key

1. **Sign Up**
   - Go to: <https://ai.google.dev/>
   - Click "Get API key in Google AI Studio"
   - Sign in with Google account

2. **Create API Key**
   - Click "Get API key" button
   - Click "Create API key in new project"
   - Copy your API key
   - Store it securely

**Free Tier:**

- 60 requests per minute
- 1,500 requests per day
- Perfect for development!

**Your Gemini API Key:**

```
GEMINI_API_KEY=AIzaSy...your-key-here
```

**Test your API key** (optional):

```bash
curl "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=YOUR_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}'
```

---

## 4. ☁️ Cloudinary

### What is it?

Cloud storage for product images with automatic optimization.

### Steps to Get API Key

1. **Sign Up**
   - Go to: <https://cloudinary.com/users/register/free>
   - Create free account

2. **Get Credentials**
   - After login, go to Dashboard
   - You'll see:
     - **Cloud Name**
     - **API Key**
     - **API Secret** (click "eye" icon to reveal)
   - Copy all three

**Free Tier:**

- 25GB storage
- 25GB bandwidth/month
- Image transformations included

**Your Cloudinary Config:**

```
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123
```

---

## 📝 Complete .env File Template

Once you have all keys, update `backend/.env`:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority

# Pinecone Configuration
PINECONE_API_KEY=pcsk_abc123_xxxxxxxxxxxxxxxxxxxxxxxxxx
PINECONE_ENVIRONMENT=us-west1-gcp
PINECONE_INDEX_NAME=product-embeddings

# Google Gemini AI Configuration
GEMINI_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

---

## ✅ Verification Checklist

Before running the app, verify:

- [ ] MongoDB cluster is running (shows "Active" in Atlas)
- [ ] MongoDB connection string is correct with password
- [ ] Pinecone index `product-embeddings` exists with dimension 768
- [ ] Gemini API key is valid and active
- [ ] Cloudinary credentials are correct
- [ ] All values in `.env` have no extra spaces
- [ ] `.env` file is in the `backend` directory

## 🧪 Test Your Setup

Run this test script to verify all connections:

```javascript
// backend/test-config.js
import dotenv from 'dotenv';
dotenv.config();

console.log('Testing API connections...\n');

// Test MongoDB
console.log('MongoDB URI:', process.env.MONGODB_URI ? '✓ Set' : '✗ Missing');

// Test Pinecone
console.log('Pinecone API Key:', process.env.PINECONE_API_KEY ? '✓ Set' : '✗ Missing');
console.log('Pinecone Index:', process.env.PINECONE_INDEX_NAME ? '✓ Set' : '✗ Missing');

// Test Gemini
console.log('Gemini API Key:', process.env.GEMINI_API_KEY ? '✓ Set' : '✗ Missing');

// Test Cloudinary
console.log('Cloudinary Name:', process.env.CLOUDINARY_CLOUD_NAME ? '✓ Set' : '✗ Missing');
console.log('Cloudinary Key:', process.env.CLOUDINARY_API_KEY ? '✓ Set' : '✗ Missing');
console.log('Cloudinary Secret:', process.env.CLOUDINARY_API_SECRET ? '✓ Set' : '✗ Missing');
```

Run: `node test-config.js`

---

## 🆘 Troubleshooting

### MongoDB Issues

- **"Authentication failed"**: Check username/password
- **"Network error"**: Verify IP whitelist in Network Access
- **"Connection timeout"**: Check firewall/VPN

### Pinecone Issues

- **"Index not found"**: Create index with exact name `product-embeddings`
- **"Dimension mismatch"**: Must be 768 for Gemini embeddings
- **"API key invalid"**: Regenerate key in Pinecone dashboard

### Gemini Issues

- **"API key invalid"**: Create new key in AI Studio
- **"Quota exceeded"**: Free tier: 60/min, wait or upgrade
- **"Model not found"**: Use `gemini-1.5-flash`

### Cloudinary Issues

- **"Invalid credentials"**: Double-check Cloud Name, API Key, Secret
- **"Upload failed"**: Check file size (<5MB) and format
- **"Quota exceeded"**: Free tier: 25GB bandwidth/month

---

## 💰 Cost Breakdown (All Free Tiers)

| Service | Free Tier | Sufficient For |
|---------|-----------|----------------|
| MongoDB Atlas | 512MB storage | ~10,000 products |
| Pinecone | 100K vectors | 100,000 products |
| Gemini API | 60 req/min | Development + testing |
| Cloudinary | 25GB/month | ~5,000 product images |

**Total monthly cost for development: $0** 🎉

---

## 🚀 Ready to Start

Once all API keys are configured:

1. Copy `.env.example` to `.env`
2. Fill in all values
3. Run `npm run dev` in backend folder
4. Test health endpoint: <http://localhost:5000/api/health>

If you see: `{"status":"OK"}` - You're all set! 🎊

---

Need help? Check the main `SETUP_GUIDE.md` for full installation instructions.
