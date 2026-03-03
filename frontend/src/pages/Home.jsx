import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import ProductGrid from '../components/ProductGrid';
import { productsAPI } from '../services/api';
import { Filter } from 'lucide-react';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [filters, setFilters] = useState({
        category: searchParams.get('category') || '',
        search: searchParams.get('search') || '',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
    });

    const categories = ['All', 'Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Toys', 'Other'];

    useEffect(() => {
        fetchProducts();
    }, [searchParams]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);

            const params = {};
            if (filters.category && filters.category !== 'All') params.category = filters.category;
            if (filters.search) params.search = filters.search;
            if (filters.minPrice) params.minPrice = filters.minPrice;
            if (filters.maxPrice) params.maxPrice = filters.maxPrice;

            const response = await productsAPI.getAll(params);
            setProducts(response.data.data);
        } catch (err) {
            console.error('Error fetching products:', err);
            setError('Failed to load products. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = (category) => {
        setFilters((prev) => ({ ...prev, category }));
        const params = new URLSearchParams();
        if (category && category !== 'All') params.set('category', category);
        navigate(`/?${params.toString()}`);
    };

    const handleVisualSearch = () => {
        navigate('/search');
    };

    return (
        <div className="min-h-screen">
            <div className="container mx-auto px-6 py-8">
                {/* Hero Section */}
                <div className="text-center mb-12 space-y-6 animate-fade-in">
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                        Discover with <span className="bg-gradient-to-r from-electric-blue to-purple-500 bg-clip-text text-transparent drop-shadow-lg">AI Vision</span>
                    </h1>
                    <p className="text-xl text-white/80 max-w-2xl mx-auto">
                        Upload any image to find similar products instantly with our AI-powered visual search
                    </p>

                    <SearchBar onVisualSearchClick={handleVisualSearch} />
                </div>

                {/* Category Filter */}
                <div className="mb-8 animate-slide-up">
                    <div className="glass-card p-4">
                        <div className="flex items-center gap-3 mb-3">
                            <Filter className="w-5 h-5 text-white" />
                            <h3 className="text-lg font-semibold text-white">Categories</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => handleCategoryChange(category)}
                                    className={`
                    px-4 py-2 rounded-lg font-medium transition-all duration-200
                    ${(filters.category === category || (!filters.category && category === 'All'))
                                            ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                                            : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                                        }
                  `}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="mb-8">
                    {!loading && !error && products.length > 0 && (
                        <h2 className="text-2xl font-bold text-white mb-6">
                            {filters.search ? `Search results for "${filters.search}"` : 'All Products'}
                            <span className="text-white/60 text-lg ml-2">({products.length})</span>
                        </h2>
                    )}

                    <ProductGrid
                        products={products}
                        loading={loading}
                        error={error}
                        onProductClick={(product) => navigate(`/product/${product._id}`)}
                    />
                </div>
            </div>
        </div>
    );
};

export default Home;
