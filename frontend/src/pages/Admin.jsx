import { useState } from 'react';
import { productsAPI, uploadAPI } from '../services/api';
import { Plus, Trash2, Edit, Save, X, Upload } from 'lucide-react';

const Admin = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'Electronics',
        inStock: true,
        stock: 0,
        tags: '',
    });

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const categories = ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Toys', 'Other'];

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!imageFile) {
            setMessage({ type: 'error', text: 'Please select an image' });
            return;
        }

        try {
            setLoading(true);
            setMessage({ type: '', text: '' });

            // Upload image first
            const uploadResponse = await uploadAPI.uploadImage(imageFile);
            const { url, publicId } = uploadResponse.data.data;

            // Create product with image URL
            const productData = {
                ...formData,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
                tags: formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
                imageUrl: url,
                cloudinaryPublicId: publicId,
            };

            await productsAPI.create(productData);

            setMessage({
                type: 'success',
                text: 'Product created successfully! AI embedding generation in progress...'
            });

            // Reset form
            setFormData({
                name: '',
                description: '',
                price: '',
                category: 'Electronics',
                inStock: true,
                stock: 0,
                tags: '',
            });
            setImageFile(null);
            setImagePreview('');

        } catch (err) {
            console.error('Error creating product:', err);
            setMessage({
                type: 'error',
                text: err.response?.data?.message || 'Failed to create product'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen">
            <div className="container mx-auto px-6 py-8">
                <div className="max-w-3xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8 animate-fade-in">
                        <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
                        <p className="text-white/70">Add products with AI-powered visual search</p>
                    </div>

                    {/* Message Alert */}
                    {message.text && (
                        <div
                            className={`glass-card p-4 mb-6 animate-fade-in ${message.type === 'success'
                                    ? 'bg-green-500/20 border-green-500/50'
                                    : 'bg-red-500/20 border-red-500/50'
                                }`}
                        >
                            <p className={message.type === 'success' ? 'text-green-200' : 'text-red-200'}>
                                {message.text}
                            </p>
                        </div>
                    )}

                    {/* Product Form */}
                    <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
                        <h2 className="text-2xl font-bold text-white mb-6">Add New Product</h2>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-white font-medium mb-2">Product Image *</label>
                            <div className="relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    id="image-upload"
                                />
                                <label
                                    htmlFor="image-upload"
                                    className="block cursor-pointer bg-white/10 border-2 border-dashed border-white/30 rounded-lg p-8 text-center hover:bg-white/20 transition-all"
                                >
                                    {imagePreview ? (
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="max-h-64 mx-auto rounded-lg"
                                        />
                                    ) : (
                                        <div className="space-y-2">
                                            <Upload className="w-12 h-12 text-white/60 mx-auto" />
                                            <p className="text-white/70">Click to upload product image</p>
                                            <p className="text-sm text-white/50">PNG, JPG, WEBP up to 5MB</p>
                                        </div>
                                    )}
                                </label>
                            </div>
                        </div>

                        {/* Product Name */}
                        <div>
                            <label className="block text-white font-medium mb-2">Product Name *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className="input-field"
                                placeholder="e.g., Wireless Bluetooth Headphones"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-white font-medium mb-2">Description *</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                                rows="4"
                                className="input-field resize-none"
                                placeholder="Detailed product description..."
                            />
                        </div>

                        {/* Price and Category */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-white font-medium mb-2">Price ($) *</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    required
                                    min="0"
                                    step="0.01"
                                    className="input-field"
                                    placeholder="29.99"
                                />
                            </div>

                            <div>
                                <label className="block text-white font-medium mb-2">Category *</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="input-field"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat} className="bg-gray-800">
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Stock */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-white font-medium mb-2">Stock Quantity</label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleInputChange}
                                    min="0"
                                    className="input-field"
                                    placeholder="100"
                                />
                            </div>

                            <div className="flex items-center pt-8">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="inStock"
                                        checked={formData.inStock}
                                        onChange={handleInputChange}
                                        className="w-5 h-5"
                                    />
                                    <span className="text-white font-medium">In Stock</span>
                                </label>
                            </div>
                        </div>

                        {/* Tags */}
                        <div>
                            <label className="block text-white font-medium mb-2">Tags (comma-separated)</label>
                            <input
                                type="text"
                                name="tags"
                                value={formData.tags}
                                onChange={handleInputChange}
                                className="input-field"
                                placeholder="wireless, bluetooth, audio"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`
                w-full py-4 rounded-lg font-semibold text-white transition-all duration-200
                flex items-center justify-center gap-2
                ${loading
                                    ? 'bg-gray-500 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-green-500 to-green-600 hover:shadow-xl transform hover:-translate-y-0.5'
                                }
              `}
                        >
                            {loading ? (
                                <>
                                    <div className="spinner" style={{ width: '20px', height: '20px' }}></div>
                                    <span>Creating Product & Generating AI Embedding...</span>
                                </>
                            ) : (
                                <>
                                    <Plus className="w-5 h-5" />
                                    <span>Create Product</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Info Card */}
                    <div className="glass-card p-6 mt-6 bg-blue-500/10 border-blue-500/30">
                        <h3 className="text-lg font-semibold text-white mb-2">ℹ️ How It Works</h3>
                        <ul className="text-white/70 space-y-2 text-sm">
                            <li>• Upload a product image (will be stored in Cloudinary)</li>
                            <li>• AI will analyze the image and generate a visual embedding</li>
                            <li>• The embedding is stored in Pinecone for visual search</li>
                            <li>• Users can then find this product by uploading similar images</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;
