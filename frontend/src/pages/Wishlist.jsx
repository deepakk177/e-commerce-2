import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';

const Wishlist = () => {
    const { wishlist, toggleWishlist, moveToCart } = useShop();
    const navigate = useNavigate();

    if (wishlist.length === 0) {
        return (
            <div className="container mx-auto px-6 py-20">
                <div className="glass-card p-12 text-center space-y-6">
                    <Heart className="w-20 h-20 mx-auto text-white/20" />
                    <h2 className="text-3xl font-bold text-white">Your Wishlist is Empty</h2>
                    <p className="text-white/60">Save items you love for later!</p>
                    <button
                        onClick={() => navigate('/')}
                        className="btn-primary"
                    >
                        Start Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 py-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-white font-display mb-2">My Wishlist</h1>
                <p className="text-white/60">Items you've saved for later ({wishlist.length})</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlist.map((product) => (
                    <div key={product._id} className="glass-card p-4 group relative">
                        {/* Remove from Wishlist */}
                        <button
                            onClick={() => toggleWishlist(product)}
                            className="absolute top-6 right-6 z-10 p-2 bg-red-500/20 hover:bg-red-500/40 rounded-full text-red-400 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>

                        {/* Product Image */}
                        <div
                            className="relative overflow-hidden rounded-xl mb-4 bg-white/5 aspect-square cursor-pointer"
                            onClick={() => navigate(`/product/${product._id}`)}
                        >
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                            />
                        </div>

                        {/* Product Info */}
                        <div className="space-y-3">
                            <h3
                                className="text-lg font-bold text-white line-clamp-2 cursor-pointer hover:text-electric-blue transition-colors"
                                onClick={() => navigate(`/product/${product._id}`)}
                            >
                                {product.name}
                            </h3>

                            <div className="flex items-center justify-between">
                                <span className="text-2xl font-bold text-white">
                                    ${product.price.toFixed(2)}
                                </span>
                                <span className={`text-xs ${product.inStock ? 'text-green-400' : 'text-red-400'}`}>
                                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                                </span>
                            </div>

                            <button
                                onClick={() => moveToCart(product)}
                                disabled={!product.inStock}
                                className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${product.inStock
                                        ? 'bg-gradient-to-r from-electric-blue to-purple-600 text-white shadow-neon-blue hover:shadow-neon-purple hover:-translate-y-1'
                                        : 'bg-white/10 text-white/40 cursor-not-allowed'
                                    }`}
                            >
                                <ShoppingCart className="w-4 h-4" />
                                {product.inStock ? 'Move to Cart' : 'Out of Stock'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Wishlist;
