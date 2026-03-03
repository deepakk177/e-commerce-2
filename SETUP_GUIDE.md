# 🚀 Quick Start Guide - AI E-Commerce Visual Search

## 📋 Prerequisites

Before you begin, obtain these API keys:

1. **MongoDB Atlas** - <https://www.mongodb.com/cloud/atlas>
   - Create a free cluster
   - Get your connection string

2. **Pinecone** - <https://www.pinecone.io/>
   - Create a free account
   - Create an index named `product-embeddings`
   - Dimension: **768** (for Gemini embeddings)
   - Metric: **cosine**
   - Get your API key and environment

3. **Google Gemini API** - <https://ai.google.dev/>
   - Create API key (Free tier: 60 requests/min)
   - Enable Gemini 1.5 Flash

4. **Cloudinary** - <https://cloudinary.com/>
   - Create free account
   - Get Cloud Name, API Key, and API Secret

## 🛠️ Installation Steps

### Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 2: Configure Backend Environment

Copy `.env.example` to `.env`:

```bash
copy .env.example .env
```

Edit `backend/.env` with your API keys:

```env
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority

# Pinecone
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_ENVIRONMENT=your_pinecone_environment
PINECONE_INDEX_NAME=product-embeddings

# Google Gemini
GEMINI_API_KEY=your_gemini_api_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### Step 3: Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### Step 4: Start Development Servers

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

## 🎯 How to Use

### 1. Add Products (Admin)

1. Navigate to: <http://localhost:5173/admin>
2. Fill in product details
3. Upload product image
4. Click "Create Product"
5. Wait for AI embedding generation (happens in background)

### 2. Visual Search (User)

1. Navigate to: <http://localhost:5173/search>
2. Drag & drop or click to upload an image
3. Click "Find Similar Products"
4. View AI-powered results with similarity scores

### 3. Browse Products

1. Home page: <http://localhost:5173/>
2. Filter by category
3. Text search available
4. Click products to view details

## 🔍 API Endpoints

### Products

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Visual Search

- `POST /api/search/visual` - Visual search by image
- `GET /api/search/similar/:productId` - Get similar products

### Upload

- `POST /api/upload` - Upload image to Cloudinary

## 🧪 Testing the AI Search

1. Add a few products with images (e.g., shoes, dresses, electronics)
2. Wait ~30 seconds for embedding generation
3. Go to Visual Search page
4. Upload a similar image (not the exact same)
5. See AI-matched results with similarity scores!

## 🎨 Tech Stack

- **Frontend**: React 18 + Tailwind CSS + Vite
- **Backend**: Node.js + Express
- **Databases**: MongoDB Atlas + Pinecone Vector DB
- **AI**: Google Gemini 1.5 Flash
- **Storage**: Cloudinary
- **UI**: Glassmorphism, Gradients, Animations

## 📊 Project Structure

```
e-commerce/
├── backend/              # Node.js API server
│   ├── config/          # Database & API configs
│   ├── models/          # MongoDB schemas
│   ├── controllers/     # Business logic
│   ├── routes/          # API endpoints
│   ├── utils/           # AI & vector search utilities
│   └── middleware/      # Upload & auth middleware
├── frontend/            # React application
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Route pages
│   │   ├── services/    # API calls
│   │   └── index.css    # Tailwind styles
│   └── public/
└── README.md

```

## ⚡ Performance Tips

- Embeddings generate asynchronously (products usable immediately)
- Pinecone searches complete in <100ms
- Free Gemini tier: 60 requests/minute
- Cloudinary auto-optimizes images

## 🐛 Troubleshooting

**"Pinecone index not found"**

- Create index in Pinecone dashboard
- Use dimension: 768, metric: cosine

**"MongoDB connection failed"**

- Check connection string
- Whitelist your IP in MongoDB Atlas

**"Gemini API error"**

- Verify API key
- Check rate limits (60/min free tier)

**"Image upload failed"**

- Verify Cloudinary credentials
- Check image size (<5MB)

## 🚀 Next Steps

- Add user authentication
- Implement shopping cart
- Add product reviews
- Deploy to production (Vercel + Render)
- Add caching for frequently searched images
- Implement batch embedding generation

## 📝 License

MIT

---

Built with ❤️ using Google Gemini AI
