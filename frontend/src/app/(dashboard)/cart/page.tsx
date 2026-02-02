"use client";

import { useCart } from "@/context/CartContext";
import { Trash2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import PaymentModal from "@/components/payment/PaymentModal";
import { useRouter } from "next/navigation";

export default function CartPage() {
    const { items, removeFromCart, cartTotal, clearCart } = useCart();
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            // eslint-disable-next-line
            setUser(JSON.parse(userData));
        }
    }, []);

    const handleBuyNow = () => {
        if (!user) {
            alert("Please login to proceed with payment");
            router.push("/login");
            return;
        }

        // Check for required profile details
        if (!user.mobile || !user.city || !user.academicClass || !user.board || !user.exams || !user.language || !user.aadharNumber) {
            alert("Please complete your profile details (including Aadhar Number) before purchasing.");
            router.push("/profile");
            return;
        }

        setIsPaymentModalOpen(true);
    };

    if (items.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <h2 className="text-3xl font-bold mb-4 text-white">Your Cart is Empty</h2>
                <p className="text-gray-400 mb-8">Looks like you haven&apos;t added any courses yet.</p>
                <Link href="/courses">
                    <button className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-full transition-all">
                        Browse Courses
                    </button>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-3xl font-bold mb-8 text-white">Shopping Cart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items List */}
                <div className="lg:col-span-2 space-y-4">
                    {items.map((item) => (
                        <motion.div
                            key={item._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            className="bg-card border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4"
                        >
                            <img
                                src={item.thumbnail}
                                alt={item.title}
                                className="w-full sm:w-32 h-32 sm:h-24 object-cover rounded-lg"
                            />
                            <div className="flex-1 text-center sm:text-left">
                                <h3 className="font-bold text-lg text-white mb-1">{item.title}</h3>
                                {item.type === 'module' ? (
                                    <p className="text-sm text-gray-400 mb-2 bg-purple-500/10 text-purple-400 inline-block px-2 py-0.5 rounded-full border border-purple-500/20">
                                        {item.className}
                                    </p>
                                ) : (
                                    <p className="text-sm text-gray-400 mb-2">By {item.teacherName}</p>
                                )}
                                <p className="font-bold text-green-400 text-xl">₹{item.price}</p>
                            </div>
                            <button
                                onClick={() => removeFromCart(item._id)}
                                className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                title="Remove from cart"
                            >
                                <Trash2 size={20} />
                            </button>
                        </motion.div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-card border border-white/10 rounded-xl p-6 sticky top-24">
                        <h2 className="text-xl font-bold mb-6 text-white">Order Summary</h2>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between text-gray-300">
                                <span>Subtotal ({items.length} items)</span>
                                <span>₹{cartTotal}</span>
                            </div>
                            <div className="flex justify-between text-gray-300">
                                <span>Tax (18% GST)</span>
                                <span>₹{(cartTotal * 0.18).toFixed(2)}</span>
                            </div>
                            <div className="h-px bg-white/10 my-4" />
                            <div className="flex justify-between text-xl font-bold text-white">
                                <span>Total</span>
                                <span>₹{(cartTotal * 1.18).toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleBuyNow}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all"
                        >
                            Buy Now <ArrowRight size={20} />
                        </button>

                        <p className="text-xs text-gray-500 text-center mt-4">
                            Secure Checkout guaranteed. By purchasing, you agree to our Terms of Service.
                        </p>
                    </div>
                </div>
            </div>

            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                items={items}
                user={user}
                course={null}
            />
        </div>
    );
}

