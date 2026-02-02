"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Loader2, Plus, Trash2, Upload, X, Pencil, User, Save, Search } from "lucide-react";
import { motion } from "framer-motion";

interface Scholar {
    _id: string;
    name: string;
    image: string;
    description: string;
}

export default function AdminScholarsPage() {
    const [scholars, setScholars] = useState<Scholar[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // Form State
    const [editingId, setEditingId] = useState<string | null>(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchScholars = async () => {
        try {
            const { data } = await axios.get("http://127.0.0.1:5000/api/scholars");
            setScholars(data);
        } catch (error) {
            console.error("Failed to fetch scholars", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchScholars();
    }, []);

    const handleEdit = (scholar: Scholar) => {
        setEditingId(scholar._id);
        setName(scholar.name);
        setDescription(scholar.description);
        setImage(scholar.image);
        setIsAdding(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const { data } = await axios.post("http://127.0.0.1:5000/api/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setImage(data.url);
        } catch (error) {
            console.error("Upload failed", error);
            alert("Failed to upload image");
        } finally {
            setUploading(false);
        }
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
        if (!name || !image || !description) {
            alert("Please fill all fields");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };

            if (editingId) {
                await axios.put(
                    `http://127.0.0.1:5000/api/scholars/${editingId}`,
                    { name, image, description },
                    { headers }
                );
            } else {
                await axios.post(
                    "http://127.0.0.1:5000/api/scholars",
                    { name, image, description },
                    { headers }
                );
            }

            // Reset form
            setName("");
            setImage("");
            setDescription("");
            setEditingId(null);
            setIsAdding(false);
            fetchScholars();
            alert(editingId ? "Scholar updated successfully!" : "Scholar added successfully!");
        } catch (error) {
            console.error("Failed to save scholar", error);
            if (!handleAuthError(error)) {
                alert("Failed to save scholar");
            }
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://127.0.0.1:5000/api/scholars/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchScholars();
        } catch (error) {
            console.error("Failed to delete scholar", error);
            if (!handleAuthError(error)) {
                alert("Failed to delete scholar");
            }
        }
    };

    const filteredScholars = scholars.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">
                        Manage Scholars
                    </h1>
                    <p className="text-gray-400 mt-2">Highlight top achievements and successful students</p>
                </div>
                <button
                    onClick={() => {
                        setIsAdding(!isAdding);
                        if (isAdding) {
                            setEditingId(null);
                            setName("");
                            setDescription("");
                            setImage("");
                        }
                    }}
                    className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-full shadow-lg shadow-teal-500/20 flex items-center gap-2 transition-all transform hover:scale-105"
                >
                    {isAdding ? <X size={20} /> : <Plus size={20} />}
                    {isAdding ? "Cancel" : "Add Scholar"}
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-card border border-white/10 p-6 rounded-2xl shadow-xl flex items-center justify-between">
                    <div>
                        <h3 className="text-gray-400 text-sm font-medium mb-1">Total Scholars</h3>
                        <p className="text-3xl font-bold text-white">{scholars.length}</p>
                    </div>
                    <User size={40} className="text-white/10" />
                </div>
                <div className="bg-card border border-white/10 p-6 rounded-2xl shadow-xl flex items-center justify-between">
                    <div>
                        <h3 className="text-gray-400 text-sm font-medium mb-1">Top Performer</h3>
                        <p className="text-lg font-bold text-teal-400">
                            {scholars.length > 0 ? scholars[0].name : "N/A"}
                        </p>
                    </div>
                    <div className="p-3 bg-teal-500/10 rounded-full">
                        <Upload size={24} className="text-teal-400" />
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
                        {editingId ? "Edit Scholar" : "Add New Scholar"}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Scholar Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="bg-secondary/50 border border-white/10 rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-primary outline-none transition-all"
                                        placeholder="Full Name"
                                        required
                                    />
                                </div>
                                <div className="bg-secondary/20 p-6 rounded-2xl border border-white/5">
                                    <label className="block text-sm text-gray-400 mb-4">Scholar Photo</label>
                                    <div className="flex items-center gap-6">
                                        <div className="relative w-24 h-24 bg-black/40 rounded-full overflow-hidden flex-shrink-0 border-2 border-teal-500/30">
                                            {image ? (
                                                <img src={image} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="flex items-center justify-center w-full h-full text-gray-500">
                                                    <User size={32} />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                disabled={uploading}
                                                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors"
                                            >
                                                {uploading ? <Loader2 className="animate-spin w-4 h-4" /> : <Upload className="w-4 h-4" />}
                                                Upload Photo
                                            </button>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                hidden
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                            />
                                            <p className="text-xs text-gray-500 mt-2">Square image recommended.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Achievement Details</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="bg-secondary/50 border border-white/10 rounded-xl px-4 py-3 w-full h-64 focus:ring-2 focus:ring-primary outline-none leading-relaxed resize-none"
                                    placeholder="Describe their achievements, rank, or university..."
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-white/5">
                            <button
                                type="submit"
                                className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all transform hover:scale-105 flex items-center gap-2"
                            >
                                <Save size={18} />
                                {editingId ? "Update Scholar" : "Save Scholar"}
                            </button>
                        </div>
                    </form>
                </motion.div>
            )}

            {/* Search */}
            <div className="mb-6 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                <input
                    type="text"
                    placeholder="Search scholars..."
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredScholars.map((scholar) => (
                        <div key={scholar._id} className="bg-card hover:bg-card/80 border border-white/10 rounded-2xl overflow-hidden relative group transition-all hover:shadow-lg hover:shadow-teal-500/5 hover:-translate-y-1">
                            <div className="h-48 overflow-hidden relative">
                                <img src={scholar.image} alt={scholar.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                <h3 className="absolute bottom-4 left-4 font-bold text-xl text-white">{scholar.name}</h3>
                            </div>
                            <div className="p-5">
                                <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed">{scholar.description}</p>
                            </div>
                            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-200">
                                <button
                                    onClick={() => handleEdit(scholar)}
                                    className="bg-black/50 backdrop-blur-sm hover:bg-blue-500 text-white p-2.5 rounded-full transition-colors border border-white/10"
                                >
                                    <Pencil size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(scholar._id)}
                                    className="bg-black/50 backdrop-blur-sm hover:bg-red-500 text-white p-2.5 rounded-full transition-colors border border-white/10"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {scholars.length === 0 && !loading && (
                        <div className="col-span-full text-center py-20 bg-card/50 rounded-2xl border border-white/5 border-dashed">
                            <User size={48} className="mx-auto text-gray-600 mb-4" />
                            <h3 className="text-xl font-medium text-gray-400">No scholars found</h3>
                            <p className="text-gray-500">Add a scholar to showcase their success.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
