import { useState } from 'react';
import ImageDropzone from '../components/ImageDropzone';
import ProductGrid from '../components/ProductGrid';
import { searchAPI, uploadAPI } from '../services/api';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Search = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchDescription, setSearchDescription] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleImageSearch = async (imageFile) => {
        try {
            setIsSearching(true);
            setError(null);
            setSearchResults([]);

            // Step 1: Upload image to Cloudinary
            console.log('Uploading image...');
            const uploadResponse = await uploadAPI.uploadImage(imageFile);
            const imageUrl = uploadResponse.data.data.url;

            console.log('Image uploaded:', imageUrl);

            // Step 2: Perform visual search
            console.log('Performing AI visual search...');
            const searchResponse = await searchAPI.visualSearch(imageUrl);

            console.log('Search results:', searchResponse.data);

            setSearchResults(searchResponse.data.data.products || []);
            setSearchDescription(searchResponse.data.data.searchDescription || '');

        } catch (err) {
            console.error('Search error:', err);
            setError(err.response?.data?.message || 'Failed to perform visual search. Please try again.');
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div className="min-h-screen">
            <div className="container mx-auto px-6 py-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Home
                </button>

                {/* Header */}
                <div className="text-center mb-12 space-y-4 animate-fade-in">
                    <div className="flex items-center justify-center gap-3">
                        <Sparkles className="w-8 h-8 text-yellow-400" />
                        <h1 className="text-5xl font-bold text-white">
                            AI Visual Search
                        </h1>
                        <Sparkles className="w-8 h-8 text-yellow-400" />
                    </div>
                    <p className="text-xl text-white/80 max-w-2xl mx-auto">
                        Upload a photo and let our AI find visually similar products for you
                    </p>
                </div>

                {/* Image Dropzone */}
                <div className="mb-12 animate-slide-up">
                    <ImageDropzone
                        onImageSelect={(file) => console.log('Image selected:', file)}
                        onSearch={handleImageSearch}
                        isSearching={isSearching}
                    />
                </div>

                {/* AI Description */}
                {searchDescription && !isSearching && (
                    <div className="glass-card p-6 mb-8 animate-fade-in">
                        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-yellow-400" />
                            AI Analysis
                        </h3>
                        <p className="text-white/80 leading-relaxed">{searchDescription}</p>
                    </div>
                )}

                {/* Error Message */}
                {error && !isSearching && (
                    <div className="glass-card p-6 mb-8 bg-red-500/20 border-red-500/50 animate-fade-in">
                        <p className="text-red-200">{error}</p>
                    </div>
                )}

                {/* Search Results */}
                {(searchResults.length > 0 || isSearching) && (
                    <div className="animate-fade-in">
                        <h2 className="text-3xl font-bold text-white mb-6">
                            {isSearching ? (
                                'Analyzing image with AI...'
                            ) : (
                                <>
                                    Similar Products Found
                                    <span className="text-white/60 text-xl ml-3">({searchResults.length})</span>
                                </>
                            )}
                        </h2>

                        <ProductGrid
                            products={searchResults}
                            loading={isSearching}
                            error={null}
                            onProductClick={(product) => navigate(`/product/${product._id}`)}
                        />
                    </div>
                )}

                {/* Empty State */}
                {!isSearching && searchResults.length === 0 && !searchDescription && !error && (
                    <div className="glass-card p-12 text-center animate-fade-in">
                        <div className="text-6xl mb-4">🎨</div>
                        <h3 className="text-2xl font-bold text-white mb-2">Ready to Search</h3>
                        <p className="text-white/60">Upload an image to discover similar products</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Search;
