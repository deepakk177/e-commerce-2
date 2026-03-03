import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { loadStripe } from '@stripe/stripe-js';
import { checkoutAPI } from '../services/api';

// Initialize Stripe outside component
// In a real app, use import.meta.env.VITE_STRIPE_PUBLIC_KEY
const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

const CartDrawer = () => {
    const { isCartOpen, setIsCartOpen, cart, updateQuantity, removeFromCart, cartTotal, clearCart } = useShop();

    const handleCheckout = async () => {
        try {
            const stripe = await stripePromise;

            // Create checkout session on backend
            const response = await checkoutAPI.createSession(cart);

            // Redirect to Stripe
            const result = await stripe.redirectToCheckout({
                sessionId: response.data.id,
            });

            if (result.error) {
                console.error(result.error.message);
                alert('Payment failed: ' + result.error.message);
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Checkout failed. Please ensure the backend is running.');
        }
    };

    if (!isCartOpen) return null;

    const shipping = cartTotal > 500 ? 0 : 25;
    const taxes = cartTotal * 0.08; // 8% tax
    const total = cartTotal + shipping + taxes;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={() => setIsCartOpen(false)}
            />

            {/* Drawer */}
            <div className="relative w-full max-w-md h-full bg-[#0f172a] border-l border-white/10 shadow-2xl transform transition-transform duration-300 flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5 backdrop-blur-xl">
                    <div className="flex items-center gap-3">
                        <ShoppingBag className="w-6 h-6 text-electric-blue" />
                        <h2 className="text-xl font-bold text-white font-display">Your Cart</h2>
                        <span className="bg-electric-blue/20 text-electric-blue px-2 py-0.5 rounded-full text-xs font-bold">
                            {cart.length} items
                        </span>
                    </div>
                    <button
                        onClick={() => setIsCartOpen(false)}
                        className="p-2 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-white/40">
                            <ShoppingBag className="w-16 h-16 opacity-20" />
                            <p>Your cart is empty.</p>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="text-electric-blue hover:underline"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        cart.map((item) => (
                            <div key={item._id} className="flex gap-4 group">
                                <div className="w-24 h-24 bg-white/5 rounded-lg overflow-hidden shrink-0 border border-white/5 group-hover:border-white/20 transition-colors">
                                    <img
                                        src={item.imageUrl}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start gap-2">
                                            <h3 className="text-white font-medium line-clamp-2">{item.name}</h3>
                                            <button
                                                onClick={() => removeFromCart(item._id)}
                                                className="text-white/40 hover:text-red-400 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <p className="text-white/60 text-sm">{item.category}</p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 bg-white/5 rounded-lg p-1 border border-white/10">
                                            <button
                                                onClick={() => updateQuantity(item._id, -1)}
                                                className="p-1 hover:bg-white/10 rounded-md text-white/70"
                                            >
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="text-sm font-medium w-4 text-center text-white">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item._id, 1)}
                                                className="p-1 hover:bg-white/10 rounded-md text-white/70"
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <span className="font-bold text-electric-blue">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer / Summary */}
                {cart.length > 0 && (
                    <div className="p-6 bg-white/5 backdrop-blur-xl border-t border-white/10 space-y-4">
                        <div className="space-y-2 text-sm text-white/60">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span className="text-white">${cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span className="text-white">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                            </div>
                            {shipping === 0 && (
                                <p className="text-xs text-green-400 text-right">Free shipping unlocked!</p>
                            )}
                            <div className="flex justify-between">
                                <span>Taxes (8%)</span>
                                <span className="text-white">${taxes.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                            <span className="text-lg font-bold text-white">Total</span>
                            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-electric-blue to-purple-500">
                                ${total.toFixed(2)}
                            </span>
                        </div>

                        <button
                            onClick={handleCheckout}
                            className="w-full py-4 bg-gradient-to-r from-electric-blue to-purple-600 text-white font-bold rounded-xl shadow-neon-blue hover:shadow-neon-purple transform hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartDrawer;
