import ProductCard from './ProductCard';

const ProductGrid = ({ products, loading, error, onProductClick }) => {
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center space-y-4">
                    <div className="spinner mx-auto"></div>
                    <p className="text-white/70">Loading amazing products...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="glass-card p-8 text-center">
                <p className="text-red-400 text-lg">{error}</p>
            </div>
        );
    }

    if (!products || products.length === 0) {
        return (
            <div className="glass-card p-12 text-center">
                <div className="space-y-4">
                    <div className="text-6xl">🔍</div>
                    <h3 className="text-2xl font-bold text-white">No Products Found</h3>
                    <p className="text-white/60">Try adjusting your search or filters</p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 auto-rows-auto gap-6">
            {products.map((product, index) => {
                // Bento Logic: Every 5th item might span 2 cols, every 8th might span 2 rows (just for visual variance)
                const isLarge = index % 7 === 0;
                const isWide = index % 5 === 0 && !isLarge;

                let spanClass = "col-span-1";
                if (isLarge) spanClass = "md:col-span-2 md:row-span-2";
                else if (isWide) spanClass = "md:col-span-2";

                return (
                    <div
                        key={product._id || index}
                        className={`animate-fade-in ${spanClass}`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        <ProductCard
                            product={product}
                            onClick={onProductClick}
                            similarityScore={product.similarityScore}
                            // Pass dimensions to card if needed for image adjustments
                            isLarge={isLarge}
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default ProductGrid;
