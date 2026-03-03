import { Star, ShoppingCart, Eye, Sparkles } from 'lucide-react';

const ProductCard = ({ product, onClick, similarityScore }) => {
    const {
        name,
        description,
        price,
        imageUrl,
        category,
        rating = 0,
        numReviews = 0,
        inStock,
    } = product;

    return (
        <div className="perspective-1000">
            <div
                onClick={() => onClick && onClick(product)}
                className="card-3d glass-card group relative p-4 card-hover cursor-pointer border-transparent hover:border-electric-blue/50 overflow-hidden"
            >
                <div className="card-3d-inner">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-electric-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Similarity Badge */}
            {similarityScore !== undefined && (
                <div className="absolute top-6 right-6 z-20 bg-gradient-to-r from-green-400 to-emerald-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1 border border-white/20">
                    <Sparkles className="w-3 h-3 text-white" />
                    {Math.round(similarityScore * 100)}% Match
                </div>
            )}

            {/* Image Container */}
            <div className="relative overflow-hidden rounded-xl mb-4 bg-white/5 aspect-square">
                <img
                    src={imageUrl}
                    alt={name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-deep-navy/90 via-deep-navy/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 z-10">
                    <div className="flex gap-2 w-full">
                        <button className="flex-1 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all border border-white/20">
                            <Eye className="w-4 h-4" />
                            View
                        </button>
                        <button className="flex-1 bg-gradient-to-r from-electric-blue to-purple-600 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all shadow-neon-blue hover:shadow-neon-purple hover:scale-105">
                            <ShoppingCart className="w-4 h-4" />
                            Add
                        </button>
                    </div>
                </div>

                {/* Status Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                    {!inStock && (
                        <div className="bg-red-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold border border-red-400/50">
                            Out of Stock
                        </div>
                    )}
                    <div className="bg-white/10 backdrop-blur-md text-electric-blue px-3 py-1 rounded-full text-xs font-bold border border-electric-blue/30 uppercase tracking-wider">
                        {category}
                    </div>
                </div>
            </div>

            {/* Product Info */}
            <div className="space-y-3 relative z-10">
                <div>
                    <h3 className="text-lg font-bold text-white line-clamp-1 group-hover:text-electric-blue transition-colors font-display">
                        {name}
                    </h3>
                    <p className="text-xs text-white/50 line-clamp-2 mt-1 font-light">
                        {description}
                    </p>
                </div>

                {/* Rating */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${i < Math.floor(rating)
                                    ? 'fill-electric-blue text-electric-blue'
                                    : 'text-white/10'
                                    }`}
                            />
                        ))}
                        <span className="text-xs text-white/40 ml-1">
                            ({numReviews})
                        </span>
                    </div>
                </div>
            </div>

                {/* Price and Action */}
                <div className="flex items-center justify-between pt-1 border-t border-white/5">
                    <div className="flex flex-col">
                        <span className="text-xs text-white/40">Price</span>
                        <span className="text-xl font-bold text-white shadow-black drop-shadow-lg">
                            ${price.toFixed(2)}
                        </span>
                    </div>

                    <button
                        disabled={!inStock}
                        className={`
                            px-4 py-2 rounded-full text-sm font-bold transition-all duration-300
                            ${inStock
                                ? 'bg-white/5 hover:bg-electric-blue hover:text-deep-navy text-electric-blue border border-electric-blue/30'
                                : 'bg-white/5 text-white/30 cursor-not-allowed border border-white/5'
                            }
                        `}
                    >
                        {inStock ? 'Buy Now' : 'Sold Out'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
