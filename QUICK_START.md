# ⚡ Quick Start - Get Running in 5 Minutes

This is your express guide to get the AI E-Commerce Visual Search app running quickly.

## ✅ Prerequisites Check

Before you start, make sure you have:

- [ ] Node.js installed (v18+ recommended)
- [ ] npm or yarn installed
- [ ] Text editor (VS Code recommended)
- [ ] All API keys ready (see API_KEYS_GUIDE.md if not)

## 🚀 5-Minute Setup

### Step 1: Install Backend (1 minute)

Open terminal in project root:

```bash
cd backend
npm install
```

### Step 2: Configure Environment (2 minutes)

1. Copy the example file:

```bash
copy .env.example .env
```

2. Open `backend/.env` and add your API keys:

```env
MONGODB_URI=your_mongodb_connection_string
PINECONE_API_KEY=your_pinecone_key
PINECONE_ENVIRONMENT=your_pinecone_env
PINECONE_INDEX_NAME=product-embeddings
GEMINI_API_KEY=your_gemini_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

### Step 3: Install Frontend (1 minute)

Open new terminal:

```bash
cd frontend
npm install
```

### Step 4: Start Servers (1 minute)

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

You should see:

```
✅ MongoDB Connected
✅ Pinecone client initialized
✅ Cloudinary configured
✅ Gemini AI configured
🚀 Server running on port 5000
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

You should see:

```
  VITE ready in 500ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 5: Open Browser

Navigate to: **<http://localhost:5173>**

You should see the stunning AI Commerce homepage! 🎉

## 🎯 First Steps After Setup

### 1. Add Your First Product (2 minutes)

1. Click **"Admin"** in the navbar
2. Fill in product details:
   - Name: "Blue Wireless Headphones"
   - Description: "Premium bluetooth headphones"
   - Price: 79.99
   - Category: Electronics
   - Stock: 50
3. Upload a product image (JPG/PNG)
4. Click **"Create Product"**
5. Wait ~30 seconds for AI embedding to generate

### 2. Test Visual Search (1 minute)

1. Click **"Visual Search"** in navbar
2. Drag & drop or upload an image similar to your product
3. Click **"Find Similar Products"**
4. See AI-powered results with similarity scores!

## 📋 Troubleshooting Quick Fixes

### Backend won't start?

```bash
# Check if .env file exists
ls backend/.env

# Verify Node version
node -v  # Should be v18+

# Clear cache and reinstall
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Frontend won't start?

```bash
# Clear cache
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### "MongoDB connection failed"?

- Verify connection string in `.env`
- Check MongoDB Atlas IP whitelist
- Ensure cluster is running

### "Pinecone index not found"?

- Create index in Pinecone dashboard
- Name: `product-embeddings`
- Dimensions: **768**
- Metric: **cosine**

### "Gemini API error"?

- Verify API key is correct
- Check free tier limits (60/min)
- Try creating new API key

## 🎯 Testing Checklist

Once running, verify these work:

- [ ] Homepage loads with beautiful gradient background
- [ ] Navbar shows Home, Visual Search, Admin
- [ ] Admin page form is accessible
- [ ] Can upload image in admin form
- [ ] Product creation works (check backend logs)
- [ ] Visual search page has drag-drop zone
- [ ] Can upload image for search
- [ ] Backend logs show "Generating embedding..."

## 📊 What Should Be Running

**2 Terminal Windows:**

1. Backend - Port 5000 (API server)
2. Frontend - Port 5173 (React dev server)

**4 External Services:**

1. MongoDB Atlas (database cloud)
2. Pinecone (vector database cloud)
3. Gemini AI (Google AI cloud)
4. Cloudinary (image storage cloud)

## 🔗 Important URLs

| Service | URL |
|---------|-----|
| **Frontend** | <http://localhost:5173> |
| **Backend API** | <http://localhost:5000> |
| **Health Check** | <http://localhost:5000/api/health> |
| **Get All Products** | <http://localhost:5000/api/products> |

## 🎨 What You Should See

### Homepage

- Purple-to-blue gradient background
- "Discover with AI Vision" heading
- Search bar with camera icon
- Category filter buttons
- Product grid (empty initially)

### Admin Page

- Glass-morphism form card
- Image upload area
- Product fields (name, description, price)
- "Create Product" button

### Visual Search Page

- Large drag-drop zone
- Camera icon with pulse animation
- "Search by Image" text
- Empty state before search

## 💡 Pro Tips

1. **Add 3-5 products first** before testing visual search
2. **Wait 30 seconds** after creating product for embedding
3. **Use clear product images** for best AI results
4. **Check backend console** for detailed logs
5. **Try similar but different images** for search

## ⏱️ Expected Timing

| Action | Time |
|--------|------|
| npm install (both) | ~3 min |
| Configure .env | ~2 min |
| Start servers | ~30 sec |
| Add first product | ~2 min |
| AI embedding gen | ~30 sec |
| Visual search | ~5 sec |

## 🆘 Get Help

If stuck after trying fixes:

1. Check `SETUP_GUIDE.md` for detailed instructions
2. Check `API_KEYS_GUIDE.md` for credential help
3. Review backend console logs for errors
4. Verify all API keys are valid
5. Ensure Pinecone index is created correctly

## ✨ Success Indicators

You'll know it's working when:

✅ No red errors in terminal  
✅ Both servers running smoothly  
✅ Frontend displays beautiful UI  
✅ Can create products successfully  
✅ Backend logs show "✅ Stored embedding"  
✅ Visual search returns results  
✅ Similarity scores appear on cards  

## 🎉 You're Ready

Once everything is running:

1. Explore the beautiful UI
2. Add some products
3. Test visual search
4. Check similarity scores
5. Modify and experiment!

---

**Next Steps:**

- Read `AI_INTEGRATION_GUIDE.md` to understand how it works
- Customize the styling in `frontend/src/index.css`
- Add authentication for production
- Deploy to Vercel + Render

Happy coding! 🚀
