import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import confetti from 'canvas-confetti';
import { CheckCircle, ShoppingBag, ArrowRight } from 'lucide-react';

const Success = () => {
    const { clearCart } = useShop();
    const navigate = useNavigate();

    useEffect(() => {
        // Clear cart on mount
        clearCart();

        // Fire confetti
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="glass-card max-w-lg w-full p-8 text-center space-y-6 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-green-500/10 to-transparent pointer-events-none" />

                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(34,197,94,0.5)] animate-bounce">
                    <CheckCircle className="w-10 h-10 text-white" />
                </div>

                <h1 className="text-4xl font-bold text-white font-display">Order Confirmed!</h1>
                <p className="text-white/60 text-lg">
                    Thank you for your purchase. Your innovative products are on their way to you.
                </p>

                <div className="bg-white/5 rounded-xl p-6 border border-white/10 text-left space-y-3">
                    <h3 className="text-white font-bold border-b border-white/10 pb-2">Order Summary</h3>
                    <div className="flex justify-between text-white/70 text-sm">
                        <span>Order Number</span>
                        <span className="font-mono text-electric-blue">#AI-{Math.floor(Math.random() * 100000)}</span>
                    </div>
                    <div className="flex justify-between text-white/70 text-sm">
                        <span>Estimated Delivery</span>
                        <span>{new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                    </div>
                    <div className="bg-electric-blue/10 p-3 rounded-lg flex items-center gap-3 mt-2">
                        <ShoppingBag className="w-5 h-5 text-electric-blue" />
                        <span className="text-xs text-electric-blue/80">You've unlocked exclusive AI recommendations for your next visit!</span>
                    </div>
                </div>

                <button
                    onClick={() => navigate('/')}
                    className="w-full py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/10 transition-all flex items-center justify-center gap-2 group"
                >
                    Continue Shopping
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
};

export default Success;
