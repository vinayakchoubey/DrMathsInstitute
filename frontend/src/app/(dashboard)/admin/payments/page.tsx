"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Loader2, Search, Filter, CheckCircle, XCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

interface Payment {
    _id: string;
    user: {
        _id: string;
        name: string;
        email: string;
    };
    courses: {
        _id: string;
        title: string;
    }[];
    amount: number;
    currency: string;
    status: 'created' | 'completed' | 'failed';
    razorpayOrderId: string;
    razorpayPaymentId?: string;
    createdAt: string;
}

export default function AdminPaymentsPage() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'completed' | 'failed' | 'created'>('all');
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000"}/api/payment`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setPayments(data);
        } catch (error) {
            console.error("Failed to fetch payments", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredPayments = payments.filter(payment => {
        const matchesFilter = filter === 'all' || payment.status === filter;
        const matchesSearch =
            payment.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.razorpayOrderId.includes(searchTerm) ||
            (payment.razorpayPaymentId && payment.razorpayPaymentId.includes(searchTerm));

        return matchesFilter && matchesSearch;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'text-green-400 bg-green-400/10 border-green-400/20';
            case 'failed': return 'text-red-400 bg-red-400/10 border-red-400/20';
            default: return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed': return <CheckCircle size={16} />;
            case 'failed': return <XCircle size={16} />;
            default: return <Clock size={16} />;
        }
    };

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Payment History</h1>
                    <p className="text-gray-400">Manage and track all transaction records</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search order ID, user..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-secondary/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/50 w-full sm:w-64"
                        />
                    </div>

                    <div className="flex bg-secondary/50 rounded-lg p-1 border border-white/10">
                        {(['all', 'completed', 'failed'] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all capitalize ${filter === f
                                        ? 'bg-primary text-white shadow-lg'
                                        : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-card border border-white/10 rounded-xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-secondary/50 border-b border-white/10 text-gray-400 text-sm">
                                <th className="p-4 font-medium">Date</th>
                                <th className="p-4 font-medium">User Details</th>
                                <th className="p-4 font-medium">Courses</th>
                                <th className="p-4 font-medium">Amount</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium">Transaction ID</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredPayments.length > 0 ? (
                                filteredPayments.map((payment, index) => (
                                    <motion.tr
                                        key={payment._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="hover:bg-white/5 transition-colors"
                                    >
                                        <td className="p-4 text-sm text-gray-300">
                                            {format(new Date(payment.createdAt), "MMM dd, yyyy")}
                                            <div className="text-xs text-gray-500">
                                                {format(new Date(payment.createdAt), "hh:mm a")}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-medium text-white">{payment.user?.name || "Unknown"}</div>
                                            <div className="text-xs text-gray-400">{payment.user?.email}</div>
                                        </td>
                                        <td className="p-4 text-sm text-gray-300 max-w-xs truncate">
                                            {payment.courses.length > 0 ? (
                                                <div className="flex flex-col gap-1">
                                                    {payment.courses.slice(0, 2).map(c => (
                                                        <span key={c._id} className="truncate block" title={c.title}>• {c.title}</span>
                                                    ))}
                                                    {payment.courses.length > 2 && (
                                                        <span className="text-xs text-gray-500">+{payment.courses.length - 2} more</span>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-gray-500 italic">No courses</span>
                                            )}
                                        </td>
                                        <td className="p-4 font-mono font-medium text-white">
                                            ₹{payment.amount}
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(payment.status)}`}>
                                                {getStatusIcon(payment.status)}
                                                <span className="capitalize">{payment.status}</span>
                                            </span>
                                        </td>
                                        <td className="p-4 text-xs font-mono text-gray-400">
                                            <div title={payment.razorpayOrderId}>
                                                <span className="text-gray-500">Order:</span> {payment.razorpayOrderId.slice(-8)}...
                                            </div>
                                            {payment.razorpayPaymentId && (
                                                <div title={payment.razorpayPaymentId} className="mt-1">
                                                    <span className="text-green-500/70">Pay:</span> {payment.razorpayPaymentId.slice(-8)}...
                                                </div>
                                            )}
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center text-gray-400">
                                        <div className="flex flex-col items-center gap-3 opacity-50">
                                            <Filter size={40} />
                                            <p>No payments found matching your filters.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

