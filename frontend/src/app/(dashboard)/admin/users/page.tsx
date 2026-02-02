"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Search, Shield, ShieldAlert, ShieldCheck, Loader2, Eye } from "lucide-react";

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    isVerified: boolean;
    createdAt: string;

    // Profile Details
    mobile?: string;
    city?: string;
    academicClass?: string;
    board?: string;
    exams?: string;
    language?: string;
    aadharNumber?: string;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'verified' | 'unverified'>('all');
    const [searchTerm, setSearchTerm] = useState("");
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");

            let query = "";
            if (filter === 'verified') query = "?verified=true";
            if (filter === 'unverified') query = "?verified=false";

            if (searchTerm) {
                query += query ? `&search=${searchTerm}` : `?search=${searchTerm}`;
            }

            const { data } = await axios.get(`http://127.0.0.1:5000/api/users${query}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(data);
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const debounce = setTimeout(() => {
            fetchUsers();
        }, 500); // Debounce search
        return () => clearTimeout(debounce);
    }, [filter, searchTerm]);

    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const toggleVerification = async (userId: string) => {
        setActionLoading(userId);
        try {
            const token = localStorage.getItem("token");
            await axios.put(`http://127.0.0.1:5000/api/users/${userId}/verify`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Refresh list or update local state
            setUsers(users.map(u => u._id === userId ? { ...u, isVerified: !u.isVerified } : u));

            // If the modal is open for this user, close it or update it? simpler to just update the verified status locally if needed, but likely fine
            if (selectedUser && selectedUser._id === userId) {
                setSelectedUser(prev => prev ? { ...prev, isVerified: !prev.isVerified } : null);
            }
        } catch (error) {
            console.error("Failed to update status", error);
            alert("Failed to update status");
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-8">User Management</h1>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between">
                <div className="flex bg-card border border-white/10 rounded-lg p-1 w-full md:w-auto">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'all' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        All Users
                    </button>
                    <button
                        onClick={() => setFilter('verified')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'verified' ? 'bg-green-500/20 text-green-500' : 'text-gray-400 hover:text-white'}`}
                    >
                        Verified
                    </button>
                    <button
                        onClick={() => setFilter('unverified')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'unverified' ? 'bg-red-500/20 text-red-500' : 'text-gray-400 hover:text-white'}`}
                    >
                        Not Verified
                    </button>
                </div>

                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-card border border-white/10 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                    />
                </div>
            </div>

            {/* Table/List */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin w-8 h-8 text-primary" />
                </div>
            ) : (
                <div className="bg-card border border-white/10 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/10">
                                    <th className="p-4 font-semibold text-gray-400">User</th>
                                    <th className="p-4 font-semibold text-gray-400">Role</th>
                                    <th className="p-4 font-semibold text-gray-400">Date Joined</th>
                                    <th className="p-4 font-semibold text-gray-400">Status</th>
                                    <th className="p-4 font-semibold text-gray-400 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-gray-500">
                                            No users found matching your filters.
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user) => (
                                        <tr key={user._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="p-4">
                                                <div>
                                                    <div className="font-bold">{user.name}</div>
                                                    <div className="text-sm text-gray-500">{user.email}</div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded text-xs font-medium uppercase ${user.role === 'admin' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="p-4 text-gray-400 text-sm">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="p-4">
                                                {user.isVerified ? (
                                                    <span className="flex items-center gap-2 text-green-500 text-sm font-medium">
                                                        <ShieldCheck size={16} /> Verified
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-2 text-red-500 text-sm font-medium">
                                                        <ShieldAlert size={16} /> Not Verified
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end items-center gap-2">
                                                    <button
                                                        onClick={() => setSelectedUser(user)}
                                                        className="px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors flex items-center gap-2"
                                                        title="View Details"
                                                    >
                                                        <Eye size={16} /> <span className="hidden sm:inline">Details</span>
                                                    </button>
                                                    <button
                                                        onClick={() => toggleVerification(user._id)}
                                                        disabled={actionLoading === user._id}
                                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${user.isVerified
                                                            ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                                                            : 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
                                                            }`}
                                                    >
                                                        {actionLoading === user._id ? (
                                                            <Loader2 size={14} className="animate-spin" />
                                                        ) : (
                                                            <Shield size={14} />
                                                        )}
                                                        {user.isVerified ? "Unverify" : "Verify"}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Detail Modal */}
            {selectedUser && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedUser(null)}>
                    <div className="bg-card border border-white/10 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative" onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setSelectedUser(null)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white"
                        >
                            ✕
                        </button>

                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            User Details
                            {selectedUser.isVerified && <ShieldCheck className="text-green-500" size={24} />}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Personal Info */}
                            <div className="space-y-4">
                                <h3 className="text-sm uppercase tracking-wider text-gray-500 font-bold border-b border-white/10 pb-2">Personal Information</h3>
                                <div className="space-y-2">
                                    <div>
                                        <label className="text-xs text-gray-400 block">Full Name</label>
                                        <p className="font-semibold">{selectedUser.name}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 block">Email</label>
                                        <p className="font-mono text-sm">{selectedUser.email}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 block">Mobile</label>
                                        <p className="font-semibold">{selectedUser.mobile || "N/A"}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 block">City/Address</label>
                                        <p className="font-semibold">{selectedUser.city || "N/A"}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 block text-orange-400">Aadhar Number</label>
                                        <p className="font-bold text-lg tracking-wide">{selectedUser.aadharNumber || "Not Provided"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Academic Info */}
                            <div className="space-y-4">
                                <h3 className="text-sm uppercase tracking-wider text-gray-500 font-bold border-b border-white/10 pb-2">Academic Information</h3>
                                <div className="space-y-2">
                                    <div>
                                        <label className="text-xs text-gray-400 block">Class</label>
                                        <p className="font-semibold">{selectedUser.academicClass || "N/A"}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 block">Board</label>
                                        <p className="font-semibold">{selectedUser.board || "N/A"}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 block">Target Exams</label>
                                        <p className="font-semibold">{selectedUser.exams || "N/A"}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 block">Language</label>
                                        <p className="font-semibold">{selectedUser.language || "N/A"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/10 flex justify-end gap-3">
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="px-4 py-2 rounded-lg text-sm font-medium bg-white/5 hover:bg-white/10 transition-colors"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => toggleVerification(selectedUser._id)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 ${selectedUser.isVerified
                                    ? 'bg-red-500 hover:bg-red-600 text-white'
                                    : 'bg-green-500 hover:bg-green-600 text-white'
                                    }`}
                            >
                                {selectedUser.isVerified ? "Revoke Verification" : "Verify User"}
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}
