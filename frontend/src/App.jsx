import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Search from './pages/Search';
import Admin from './pages/Admin';
import ProductDetail from './pages/ProductDetail';
import Success from './pages/Success';
import Wishlist from './pages/Wishlist';
import './index.css';
import CartDrawer from './components/CartDrawer';
import { Toaster } from 'react-hot-toast';

function App() {
    useEffect(() => {
        const handleMouseMove = (e) => {
            document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
            document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <Router>
            <div className="min-h-screen pb-20 relative">
                <div className="mouse-spotlight" />
                <Navbar />
                <CartDrawer />
                <Toaster position="bottom-right" toastOptions={{
                    style: {
                        background: '#333',
                        color: '#fff',
                    },
                }} />

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/success" element={<Success />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
