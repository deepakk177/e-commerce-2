import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsAPI, searchAPI } from '../services/api';
import { useShop } from '../context/ShopContext';
import { Star, Truck, Shield, RotateCcw, ShoppingCart, Heart } from 'lucide-react';
import ProductCard from '../components/ProductCard';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart, toggleWishlist, wishlist } = useShop();

    const [product, setProduct] = useState(null);
    const [similarProducts, setSimilarProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [zoomed, setZoomed] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const productRes = await productsAPI.getById(id);
                setProduct(productRes.data.data);

                // Fetch similar products
                if (productRes.data.data) {
                    try {
                        const similarRes = await searchAPI.getSimilar(id);
                        setSimilarProducts(similarRes.data.data);
                    } catch (err) {
                        console.warn("Could not fetch similar products", err);
                    }
                }
            } catch (err) {
                console.error(err);
                // navigate('/');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id]);

    const handleMouseMove = (e) => {
        if (!zoomed) return;
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.pageX - left) / width) * 100;
        const y = ((e.pageY - top) / height) * 100;
        setMousePos({ x, y });
    };

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
            <div className="spinner"></div>
            <p className="text-white/60 animate-pulse">Loading product details...</p>
        </div>
    );

    if (!product) return <div className="text-white text-center py-20">Product not found.</div>;

    const isWishlisted = wishlist.some(item => item._id === product._id);

    return (
        <div className="container mx-auto px-6 py-8 animate-fade-in">
            {/* Breadcrumbs */}
            <div className="text-white/40 mb-8 text-sm">
                <span className="hover:text-electric-blue cursor-pointer" onClick={() => navigate('/')}>Home</span>
                {' > '}
                <span className="hover:text-electric-blue cursor-pointer" onClick={() => navigate(`/?category=${product.category}`)}>{product.category}</span>
                {' > '}
                <span className="text-white/80">{product.name}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Left: Image Gallery / Zoom */}
                <div className="space-y-4">
                    <div
                        className="relative rounded-2xl overflow-hidden glass-card border-white/5 bg-white/5 aspect-square cursor-zoom-in group"
                        onMouseEnter={() => setZoomed(true)}
                        onMouseLeave={() => setZoomed(false)}
                        onMouseMove={handleMouseMove}
                    >
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            className={`w-full h-full object-cover transition-transform duration-200 ${zoomed ? 'scale-150' : 'scale-100'}`}
                            style={zoomed ? {
                                transformOrigin: `${mousePos.x}% ${mousePos.y}%`
                            } : {}}
                        />
                        {/* Zoom Hint */}
                        <div className={`absolute bottom-4 right-4 bg-black/60 backdrop-blur text-white text-xs px-3 py-1 rounded-full pointer-events-none transition-opacity ${zoomed ? 'opacity-0' : 'opacity-100'}`}>
                            Hover to Zoom
                        </div>
                    </div>
                </div>

                {/* Right: Product Details */}
                <div className="space-y-8">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white font-display mb-2">{product.name}</h1>
                        <div className="flex items-center gap-4 text-sm mt-4">
                            <div className="flex text-electric-blue">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating || 4.5) ? 'fill-electric-blue' : 'text-white/20'}`} />
                                ))}
                            </div>
                            <span className="text-white/60">{product.numReviews || 128} reviews</span>
                            <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                            <span className={`${product.inStock ? 'text-green-400' : 'text-red-400'} font-medium`}>
                                {product.inStock ? 'In Stock' : 'Out of Stock'}
                            </span>
                        </div>
                    </div>

                    <div className="glass-card p-6 bg-white/5">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="text-4xl font-bold text-white">
                                ${product.price}
                            </div>
                            {/* Fake original price for discount effect */}
                            <div className="text-lg text-white/40 line-through">
                                ${(product.price * 1.2).toFixed(2)}
                            </div>
                            <div className="px-2 py-1 bg-electric-blue/20 text-electric-blue text-xs font-bold rounded">
                                20% OFF
                            </div>
                        </div>
                        <p className="text-white/60 text-sm mb-6">Inclusive of all taxes</p>

                        <div className="flex gap-4">
                            <button
                                onClick={() => addToCart(product)}
                                disabled={!product.inStock}
                                className={`flex-1 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transform transition-all active:scale-95 ${product.inStock ? 'bg-gradient-to-r from-electric-blue to-purple-600 text-white shadow-neon-blue hover:shadow-neon-purple hover:-translate-y-1' : 'bg-white/10 text-white/40 cursor-not-allowed'}`}
                            >
                                <ShoppingCart className="w-5 h-5" />
                                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                            </button>
                            <button
                                onClick={() => toggleWishlist(product)}
                                className={`p-4 rounded-xl border border-white/20 hover:bg-white/10 transition-colors ${isWishlisted ? 'text-red-500 bg-red-500/10 border-red-500/20' : 'text-white'}`}
                            >
                                <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-red-500' : ''}`} />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-white border-b border-white/10 pb-2">Description</h3>
                            <p className="text-white/70 leading-relaxed text-lg">
                                {product.description}
                            </p>
                        </div>

                        {/* Features / Bullet Points (Simulated if not in DB) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5">
                                <Truck className="w-6 h-6 text-electric-blue shrink-0" />
                                <div>
                                    <h4 className="font-bold text-white">Free Delivery</h4>
                                    <p className="text-xs text-white/50">For orders over $500</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5">
                                <Shield className="w-6 h-6 text-purple-500 shrink-0" />
                                <div>
                                    <h4 className="font-bold text-white">2 Year Warranty</h4>
                                    <p className="text-xs text-white/50">Full coverage included</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5">
                                <RotateCcw className="w-6 h-6 text-green-400 shrink-0" />
                                <div>
                                    <h4 className="font-bold text-white">30 Day Returns</h4>
                                    <p className="text-xs text-white/50">No questions asked</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Similar Products */}
            {similarProducts.length > 0 && (
                <div className="mt-24 space-y-8">
                    <h2 className="text-3xl font-bold text-white">Similar Products <span className="text-electric-blue text-lg font-normal ml-2">Based on AI Analysis</span></h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {similarProducts.map((p) => (
                            <ProductCard
                                key={p._id}
                                product={p}
                                onClick={() => navigate(`/product/${p._id}`)}
                                similarityScore={p.score}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetail;
