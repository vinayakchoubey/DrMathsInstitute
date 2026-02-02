"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle, XCircle, ShieldCheck, AlertCircle } from "lucide-react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import axios from "axios";

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    course?: {
        _id: string;
        title: string;
        price: number;
        thumbnail: string;
        originalPrice?: number;
    } | null;
    items?: {
        _id: string;
        title: string;
        price: number;
        thumbnail: string;
    }[];
    user: {
        name: string;
        email: string;
        mobile?: string;
    } | null;
}

export default function PaymentModal({ isOpen, onClose, course, items, user }: PaymentModalProps) {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'failure'>('idle');
    const [errorMessage, setErrorMessage] = useState("");
    const { width, height } = useWindowSize();

    useEffect(() => {
        if (isOpen) {
            setStatus('idle');
            setLoading(false);
            setErrorMessage("");
        }
    }, [isOpen]);

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            if ((window as any).Razorpay) {
                resolve(true);
                return;
            }
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        if ((!course && (!items || items.length === 0)) || !user) return;

        setLoading(true);
        setErrorMessage("");

        try {
            const isLoaded = await loadRazorpay();
            if (!isLoaded) {
                throw new Error("Razorpay SDK failed to load. Please check your internet connection.");
            }

            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("PLease login to continue.");
            }

            // Prepare payload
            const payload: any = {
                courseIds: [],
                moduleIds: []
            };

            if (items && items.length > 0) {
                // If items are from cart, they should have type 'course' or 'module'
                // If type is missing, assume course for legacy compatibility or if logic says so
                // But in CartContext we saw they have type.
                items.forEach(item => {
                    // Check if item has type property. If not, we might need a fallback or check ID against known lists, 
                    // but safer to assume frontend passes type. 
                    // Based on ModulesPage, type is 'module'.
                    if ((item as any).type === 'module') {
                        payload.moduleIds.push(item._id);
                    } else {
                        payload.courseIds.push(item._id);
                    }
                });
            } else if (course) {
                // Single course purchase
                payload.courseIds.push(course._id);
            }

            // Create Order
            const API_URL = 'http://localhost:5000';
            console.log("Creating order at", `${API_URL}/api/payment/create-order`, payload);

            const { data: orderData } = await axios.post(
                `${API_URL}/api/payment/create-order`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            // Determine description and image
            let description = "";
            let image = "https://via.placeholder.com/150";

            if (items && items.length > 0) {
                description = `Purchase of ${items.length} items`;
                if (items[0].thumbnail) image = items[0].thumbnail;
            } else if (course) {
                description = `Enrollment for ${course.title}`;
                if (course.thumbnail) image = course.thumbnail;
            }

            const options = {
                key: orderData.key_id,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "Dr. Maths Institute",
                description: description,
                image: image,
                order_id: orderData.orderId,
                handler: async function (response: any) {
                    try {
                        const verifyPayload = {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                            // No need to send courseId/moduleIds again, backend uses order_id to find Payment record
                        };

                        const verifyRes = await axios.post(
                            `${API_URL}/api/payment/verify`,
                            verifyPayload,
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`
                                }
                            }
                        );
                        if (verifyRes.data.success) {
                            setStatus('success');
                        } else {
                            setStatus('failure');
                            setErrorMessage("Verification failed");
                        }
                    } catch (err: any) {
                        console.error(err);
                        setStatus('failure');
                        setErrorMessage(err.response?.data?.message || "Payment verification failed");
                    } finally {
                        setLoading(false);
                    }
                },
                prefill: {
                    name: orderData.user_name,
                    email: orderData.user_email,
                    contact: orderData.user_contact,
                },
                notes: {
                    address: "Online",
                },
                theme: {
                    color: "#3B82F6",
                },
                modal: {
                    ondismiss: function () {
                        setLoading(false);
                    }
                }
            };

            const paymentObject = new (window as any).Razorpay(options);
            paymentObject.open();

        } catch (error: any) {
            console.error(error);
            // If checking fails before opening modal
            if (status !== 'success') {
                setStatus('failure');
                setErrorMessage(error.response?.data?.message || error.message || "Something went wrong");
                setLoading(false);
            }
        }
    };

    if (!isOpen) return null;

    const totalPrice = items && items.length > 0
        ? items.reduce((sum, item) => sum + item.price, 0)
        : course?.price || 0;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        {/* Modal */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-slate-900 border border-slate-700 text-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative"
                        >
                            {/* Confetti on Success */}
                            {status === 'success' && <Confetti width={width} height={height} numberOfPieces={200} recycle={false} />}

                            {/* Header */}
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-center relative">
                                <button
                                    onClick={onClose}
                                    className="absolute right-4 top-4 text-white/70 hover:text-white transition-colors"
                                >
                                    <XCircle size={24} />
                                </button>
                                <h2 className="text-2xl font-bold text-white mb-1">
                                    {status === 'success' ? 'Enrollment Successful!' :
                                        status === 'failure' ? 'Payment Failed' : 'Checkout'}
                                </h2>
                                <p className="text-blue-100 text-sm">
                                    {status === 'success' ? 'Welcome to your learning journey!' :
                                        status === 'failure' ? 'Please try again.' : 'Secure Payment Gateway'}
                                </p>
                            </div>

                            {/* Body */}
                            <div className="p-6">
                                {status === 'idle' && (
                                    <div className="space-y-6">
                                        {/* Item Details */}
                                        {items && items.length > 0 ? (
                                            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 space-y-2 max-h-40 overflow-y-auto">
                                                <h3 className="text-sm font-semibold text-slate-300 mb-2">Selected Items ({items.length})</h3>
                                                {items.map((item, idx) => (
                                                    <div key={idx} className="flex justify-between text-sm">
                                                        <span className="text-slate-400 truncate max-w-[70%]">{item.title}</span>
                                                        <span className="text-slate-200">₹{item.price}</span>
                                                    </div>
                                                ))}
                                                <div className="border-t border-slate-700 pt-2 flex justify-between font-bold">
                                                    <span>Total</span>
                                                    <span>₹{totalPrice}</span>
                                                </div>
                                            </div>
                                        ) : course && (
                                            <div className="flex gap-4">
                                                <img
                                                    src={course.thumbnail}
                                                    alt={course.title}
                                                    className="w-24 h-24 object-cover rounded-lg border border-slate-700 shadow-sm"
                                                />
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-lg line-clamp-2">{course.title}</h3>
                                                    <div className="mt-2 flex items-baseline gap-2">
                                                        <span className="text-2xl font-bold text-blue-400">₹{course.price}</span>
                                                        {course.originalPrice && (
                                                            <span className="text-slate-500 line-through text-sm">₹{course.originalPrice}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 space-y-3">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-400">Student</span>
                                                <span className="text-slate-200 font-medium">{user?.name}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-400">Email</span>
                                                <span className="text-slate-200 font-medium">{user?.email}</span>
                                            </div>
                                            <div className="border-t border-slate-700 pt-3 flex justify-between items-center text-sm">
                                                <span className="text-slate-400 flex items-center gap-1">
                                                    <ShieldCheck size={14} className="text-green-500" /> Secure Payment
                                                </span>
                                                <span className="text-xs text-slate-500">Encrypted via Razorpay</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handlePayment}
                                            disabled={loading}
                                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-900/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
                                        >
                                            {loading ? (
                                                <Loader2 className="animate-spin" />
                                            ) : (
                                                <>
                                                    <span>Pay Now</span>
                                                    <div className="h-5 w-[1px] bg-slate-400/30 mx-1" />
                                                    <span className="font-mono">₹{Math.round(totalPrice * 1.18)} (inc. Tax)</span>
                                                </>
                                            )}
                                        </button>
                                        <p className="text-xs text-center text-slate-500 mt-2">
                                            18% GST Included
                                        </p>
                                    </div>
                                )}

                                {status === 'success' && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-6 space-y-4"
                                    >
                                        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto text-green-500">
                                            <CheckCircle size={48} />
                                        </div>
                                        <div className="text-slate-300">
                                            You have successfully purchased the course(s)!
                                        </div>
                                        <button
                                            onClick={onClose}
                                            className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2 rounded-lg transition-colors"
                                        >
                                            Start Learning
                                        </button>
                                    </motion.div>
                                )}

                                {status === 'failure' && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="text-center py-6 space-y-4"
                                    >
                                        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto text-red-500">
                                            <AlertCircle size={48} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-red-400">Payment Failed</p>
                                            <p className="text-slate-400 text-sm mt-1">{errorMessage}</p>
                                        </div>
                                        <div className="flex gap-3 justify-center">
                                            <button
                                                onClick={onClose}
                                                className="bg-transparent border border-slate-600 hover:bg-slate-800 text-slate-300 px-4 py-2 rounded-lg transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handlePayment}
                                                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors"
                                            >
                                                Try Again
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
