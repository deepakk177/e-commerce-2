import { ShoppingBag, Camera, Home, Settings, ShoppingCart, Heart } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useShop } from '../context/ShopContext';

const Navbar = () => {
    const location = useLocation();
    const { setIsCartOpen, cartCount, wishlist } = useShop();

    const navItems = [
        { path: '/', label: 'Home', icon: Home },
        { path: '/search', label: 'Visual Search', icon: Camera },
        { path: '/admin', label: 'Admin', icon: Settings },
    ];


    return (
        <nav className="glass-nav mb-8 border-b border-white/5 shadow-neon-blue/20">
            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="bg-gradient-to-br from-electric-blue to-purple-600 p-3 rounded-xl group-hover:scale-110 transition-transform duration-200 shadow-neon-blue">
                            <ShoppingBag className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white font-display tracking-wide">
                                <span className="text-electric-blue">AI</span> Commerce
                            </h1>
                            <p className="text-xs text-white/50 tracking-wider">VISUAL SEARCH ENABLED</p>
                        </div>
                    </Link>

                    {/* Navigation */}
                    <div className="flex items-center gap-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;

                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300
                    ${isActive
                                            ? 'bg-electric-blue/20 text-electric-blue shadow-neon-blue border border-electric-blue/30'
                                            : 'text-white/60 hover:text-white hover:bg-white/5 hover:border-white/10 border border-transparent'
                                        }
                  `}
                                >
                                    <Icon className={`w-5 h-5 ${isActive ? 'animate-pulse' : ''}`} />
                                    <span className="hidden md:inline">{item.label}</span>
                                </Link>
                            );
                        })}

                        {/* Cart Button */}
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative ml-2 p-2 text-white/60 hover:text-electric-blue transition-colors group"
                        >
                            <ShoppingCart className="w-6 h-6 group-hover:drop-shadow-[0_0_8px_rgba(0,210,255,0.5)]" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-electric-blue text-[#0f172a] text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-lg">
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        {/* Wishlist Button */}
                        <Link
                            to="/wishlist"
                            className="relative p-2 text-white/60 hover:text-red-400 transition-colors group"
                        >
                            <Heart className={`w-6 h-6 group-hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.5)] ${wishlist.length > 0 ? 'fill-red-400 text-red-400' : ''}`} />
                            {wishlist.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-400 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-lg">
                                    {wishlist.length}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
