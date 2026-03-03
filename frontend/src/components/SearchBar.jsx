import { Search, Camera } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ onVisualSearchClick }) => {
    const [searchText, setSearchText] = useState('');
    const navigate = useNavigate();

    const handleTextSearch = (e) => {
        e.preventDefault();
        if (searchText.trim()) {
            navigate(`/?search=${encodeURIComponent(searchText)}`);
        }
    };

    return (
        <form onSubmit={handleTextSearch} className="w-full max-w-3xl mx-auto">
            <div className="glass-card p-2 flex items-center gap-2">
                <div className="flex-1 flex items-center gap-3 px-4">
                    <Search className="w-5 h-5 text-white/60" />
                    <input
                        type="text"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="Search for products..."
                        className="flex-1 bg-transparent text-white placeholder-white/60 focus:outline-none py-2"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={onVisualSearchClick}
                        className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all duration-200 hover:shadow-lg"
                        title="Visual Search"
                    >
                        <Camera className="w-5 h-5" />
                        <span className="hidden sm:inline">Image Search</span>
                    </button>

                    <button
                        type="submit"
                        className="bg-gradient-to-r from-primary-500 to-primary-600 hover:shadow-lg text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
                    >
                        Search
                    </button>
                </div>
            </div>
        </form>
    );
};

export default SearchBar;
