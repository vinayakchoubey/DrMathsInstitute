"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Loader2, Plus, Trash2, X, Pencil, Save, ChevronRight, FileText, Search } from "lucide-react";
import { motion } from "framer-motion";

interface Policy {
    _id: string;
    title: string;
    content: string;
}

export default function AdminPoliciesPage() {
    const [policies, setPolicies] = useState<Policy[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // Form State
    const [editingId, setEditingId] = useState<string | null>(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const fetchPolicies = async () => {
        try {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000"}/api/policies`);
            setPolicies(data);
        } catch (error) {
            console.error("Failed to fetch policies", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPolicies();
    }, []);

    const handleEdit = (policy: Policy) => {
        setEditingId(policy._id);
        setTitle(policy.title);
        setContent(policy.content);
        setIsAdding(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleAuthError = (error: any) => {
        if (axios.isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 403)) {
            alert("Session expired or unauthorized. Please log in again.");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
            return true;
        }
        return false;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !content) {
            alert("Please fill all fields");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };

            if (editingId) {
                await axios.put(
                    `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000"}/api/policies/${editingId}`,
                    { title, content },
                    { headers }
                );
            } else {
                await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000"}/api/policies`,
                    { title, content },
                    { headers }
                );
            }

            setTitle("");
            setContent("");
            setEditingId(null);
            setIsAdding(false);
            fetchPolicies();
            alert(editingId ? "Policy updated successfully!" : "Policy created successfully!");
        } catch (error) {
            console.error("Failed to save policy", error);
            if (!handleAuthError(error)) {
                alert("Failed to save policy");
            }
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000"}/api/policies/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchPolicies();
        } catch (error) {
            console.error("Failed to delete policy", error);
            if (!handleAuthError(error)) {
                alert("Failed to delete policy");
            }
        }
    };

    const filteredPolicies = policies.filter(policy =>
        policy.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-500">
                        Manage Footer
                    </h1>
                    <p className="text-gray-400 mt-2">Create and manage policies, terms, and footer links</p>
                </div>
                <button
                    onClick={() => {
                        setIsAdding(!isAdding);
                        if (isAdding) {
                            setEditingId(null);
                            setTitle("");
                            setContent("");
                        }
                    }}
                    className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-full shadow-lg shadow-orange-500/20 flex items-center gap-2 transition-all transform hover:scale-105"
                >
                    {isAdding ? <X size={20} /> : <Plus size={20} />}
                    {isAdding ? "Cancel" : "Add Policy"}
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-card border border-white/10 p-6 rounded-2xl shadow-xl flex items-center justify-between">
                    <div>
                        <h3 className="text-gray-400 text-sm font-medium mb-1">Total Policies</h3>
                        <p className="text-3xl font-bold text-white">{policies.length}</p>
                    </div>
                    <FileText size={40} className="text-white/10" />
                </div>
                <div className="bg-card border border-white/10 p-6 rounded-2xl shadow-xl flex items-center justify-between">
                    <div>
                        <h3 className="text-gray-400 text-sm font-medium mb-1">Last Updated</h3>
                        <p className="text-lg font-bold text-orange-400">Just Now</p>
                    </div>
                    <div className="p-3 bg-orange-500/10 rounded-full">
                        <Save size={24} className="text-orange-400" />
                    </div>
                </div>
            </div>

            {isAdding && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card border border-white/10 rounded-2xl p-8 mb-8 shadow-2xl"
                >
                    <h2 className="text-2xl font-bold mb-6 text-white border-b border-white/10 pb-4">
                        {editingId ? "Edit Policy" : "Create New Policy"}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Title (e.g., Refund Policy)</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="bg-secondary/50 border border-white/10 rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-primary outline-none transition-all"
                                placeholder="Policy Title"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Content (HTML supported)</label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="bg-secondary/50 border border-white/10 rounded-xl px-4 py-3 w-full h-64 focus:ring-2 focus:ring-primary outline-none font-mono text-sm leading-relaxed"
                                placeholder="<h3>Refund Policy</h3><p>Details here...</p>"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-2 ml-2">You can use basic HTML tags for formatting.</p>
                        </div>

                        <button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all transform hover:scale-[1.01] flex justify-center items-center gap-2">
                            <Save size={18} />
                            {editingId ? "Update Policy" : "Save Policy"}
                        </button>
                    </form>
                </motion.div>
            )}

            {/* Search */}
            <div className="mb-6 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                <input
                    type="text"
                    placeholder="Search policies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-card border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
                />
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-primary w-10 h-10" />
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredPolicies.length === 0 && (
                        <div className="text-center py-20 bg-card/50 rounded-2xl border border-white/5 border-dashed">
                            <FileText size={48} className="mx-auto text-gray-600 mb-4" />
                            <h3 className="text-xl font-medium text-gray-400">No policies found</h3>
                            <p className="text-gray-500">Create a new policy to get started.</p>
                        </div>
                    )}
                    {filteredPolicies.map((policy) => (
                        <div key={policy._id} className="group bg-card hover:bg-card/80 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-4 transition-all hover:shadow-lg hover:shadow-orange-500/5 hover:border-orange-500/20">
                            <div className="flex items-center gap-5 w-full">
                                <div className="bg-orange-500/10 p-4 rounded-xl text-orange-400 group-hover:bg-orange-500/20 transition-colors">
                                    <FileText size={24} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-xl text-white group-hover:text-orange-400 transition-colors">{policy.title}</h3>
                                    <p className="text-gray-400 text-sm mt-1 line-clamp-1">{policy.content.replace(/<[^>]*>?/gm, '')}</p>
                                </div>
                            </div>
                            <div className="flex gap-3 w-full md:w-auto justify-end">
                                <button
                                    onClick={() => handleEdit(policy)}
                                    className="p-3 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors border border-blue-500/20"
                                    title="Edit"
                                >
                                    <Pencil size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(policy._id)}
                                    className="p-3 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors border border-red-500/20"
                                    title="Delete"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

