"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Trash2, Edit, Save, X, BookOpen, Loader2, Search } from "lucide-react";

export default function ManageModulesPage() {
    const [modules, setModules] = useState<any[]>([]);
    const [showModuleForm, setShowModuleForm] = useState(false);
    const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const [moduleFormData, setModuleFormData] = useState({
        title: "",
        description: "",
        thumbnail: "",
        price: "",
        className: "",
        isFeatured: false
    });
    const [moduleThumbnailFile, setModuleThumbnailFile] = useState<File | null>(null);

    useEffect(() => {
        fetchModules();
    }, []);

    const fetchModules = async () => {
        try {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000"}/api/modules`);
            setModules(data);
        } catch (error) { console.error(error); }
    };

    const handleUpload = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        try {
            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000"}/api/upload`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return data.url;
        } catch (e) {
            console.error("Upload failed", e);
            return null;
        }
    };

    const handleCreateModule = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const config = { headers: { Authorization: `Bearer ${token}` } };

            let thumbnailUrl = moduleFormData.thumbnail;
            if (moduleThumbnailFile) {
                thumbnailUrl = await handleUpload(moduleThumbnailFile) || "";
            }

            const payload = {
                ...moduleFormData,
                price: Number(moduleFormData.price),
                thumbnail: thumbnailUrl
            };

            if (editingModuleId) {
                await axios.put(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000"}/api/modules/${editingModuleId}`, payload, config);
                alert("Module updated!");
            } else {
                await axios.post(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000"}/api/modules`, payload, config);
                alert("Module created!");
            }

            setShowModuleForm(false);
            setEditingModuleId(null);
            setModuleFormData({ title: "", description: "", thumbnail: "", price: "", className: "", isFeatured: false });
            fetchModules();
        } catch (error: any) {
            console.error(error);
            if (error.response && error.response.status === 401) {
                alert("Session expired. Please login again.");
                window.location.href = "/login";
            } else {
                alert("Failed to save module");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleEditModule = (module: any) => {
        setModuleFormData({
            title: module.title,
            description: module.description,
            price: module.price,
            className: module.className,
            thumbnail: module.thumbnail,
            isFeatured: module.isFeatured
        });
        setEditingModuleId(module._id);
        setShowModuleForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteModule = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000"}/api/modules/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchModules();
        } catch (e) {
            alert("Delete failed");
        }
    };

    const filteredModules = modules.filter(m =>
        m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.className.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                        Manage Modules
                    </h1>
                    <p className="text-gray-400 mt-2">Create and organize study modules and books</p>
                </div>
                <button
                    onClick={() => {
                        setShowModuleForm(!showModuleForm);
                        if (!showModuleForm) {
                            setEditingModuleId(null);
                            setModuleFormData({ title: "", description: "", thumbnail: "", price: "", className: "", isFeatured: false });
                        }
                    }}
                    className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-full shadow-lg shadow-purple-500/20 flex items-center gap-2 transition-all transform hover:scale-105"
                >
                    {showModuleForm ? <X size={20} /> : <Plus size={20} />}
                    {showModuleForm ? "Cancel" : "Add New Module"}
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-card border border-white/10 p-6 rounded-2xl shadow-xl flex items-center justify-between">
                    <div>
                        <h3 className="text-gray-400 text-sm font-medium mb-1">Total Modules</h3>
                        <p className="text-3xl font-bold text-white">{modules.length}</p>
                    </div>
                    <BookOpen size={40} className="text-white/10" />
                </div>
                <div className="bg-card border border-white/10 p-6 rounded-2xl shadow-xl flex items-center justify-between">
                    <div>
                        <h3 className="text-gray-400 text-sm font-medium mb-1">Total Classes Covered</h3>
                        <p className="text-3xl font-bold text-pink-400">
                            {new Set(modules.map(m => m.className)).size}
                        </p>
                    </div>
                    <div className="p-3 bg-pink-500/10 rounded-full">
                        <Edit size={24} className="text-pink-400" />
                    </div>
                </div>
            </div>

            {showModuleForm && (
                <div className="bg-card border border-white/10 rounded-2xl p-8 mb-8 shadow-2xl animate-in slide-in-from-top-4 duration-300">
                    <h2 className="text-2xl font-bold mb-6 text-white border-b border-white/10 pb-4">
                        {editingModuleId ? "Edit Module" : "Create New Module"}
                    </h2>
                    <form onSubmit={handleCreateModule} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Module Title</label>
                                <input
                                    placeholder="e.g. Physics Book 1"
                                    className="bg-secondary/50 border border-white/10 rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-primary outline-none"
                                    value={moduleFormData.title} onChange={e => setModuleFormData({ ...moduleFormData, title: e.target.value })} required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Price (₹)</label>
                                    <input
                                        placeholder="Price (₹)"
                                        type="number"
                                        className="bg-secondary/50 border border-white/10 rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-primary outline-none"
                                        value={moduleFormData.price} onChange={e => setModuleFormData({ ...moduleFormData, price: e.target.value })} required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Class</label>
                                    <input
                                        placeholder="e.g. Class 10"
                                        className="bg-secondary/50 border border-white/10 rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-primary outline-none"
                                        value={moduleFormData.className} onChange={e => setModuleFormData({ ...moduleFormData, className: e.target.value })} required
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Description</label>
                            <textarea
                                placeholder="Description"
                                className="bg-secondary/50 border border-white/10 rounded-xl px-4 py-3 w-full h-32 focus:ring-2 focus:ring-primary outline-none"
                                value={moduleFormData.description} onChange={e => setModuleFormData({ ...moduleFormData, description: e.target.value })} required
                            />
                        </div>

                        <div className="border border-dashed border-white/20 p-6 rounded-xl hover:bg-white/5 transition-colors text-center">
                            <p className="mb-2 text-sm text-gray-400">Thumbnail Image</p>
                            {moduleFormData.thumbnail && <img src={moduleFormData.thumbnail} alt="Preview" className="w-32 h-32 object-cover mx-auto mb-4 rounded-lg shadow-md" />}
                            <input type="file" onChange={e => setModuleThumbnailFile(e.target.files?.[0] || null)} required={!moduleFormData.thumbnail} className="mx-auto block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90" />
                        </div>

                        <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all transform hover:scale-[1.01]">
                            {loading ? "Processing..." : (editingModuleId ? "Update Module" : "Create Module")}
                        </button>
                    </form>
                </div>
            )}

            {/* Search */}
            <div className="mb-6 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                <input
                    type="text"
                    placeholder="Search modules..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-card border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredModules.length === 0 && !loading && (
                    <div className="col-span-full text-center py-20 bg-card/50 rounded-2xl border border-white/5 border-dashed">
                        <BookOpen size={48} className="mx-auto text-gray-600 mb-4" />
                        <h3 className="text-xl font-medium text-gray-400">No modules found</h3>
                        <p className="text-gray-500">Create a new module to get started.</p>
                    </div>
                )}
                {filteredModules.map(module => (
                    <div key={module._id} className="bg-card hover:bg-card/80 border border-white/10 rounded-2xl p-4 flex flex-col justify-between transition-all hover:shadow-lg hover:shadow-purple-500/5 group h-full">
                        <div>
                            <div className="relative aspect-video mb-4 overflow-hidden rounded-xl">
                                <img src={module.thumbnail} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md border border-white/10">
                                    {module.className}
                                </div>
                            </div>
                            <h3 className="text-lg font-bold mb-2 line-clamp-1 text-white group-hover:text-purple-400 transition-colors">
                                {module.title}
                            </h3>
                            <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                                {module.description}
                            </p>
                        </div>
                        <div className="flex justify-between items-center mt-auto pt-4 border-t border-white/5">
                            <span className="font-bold text-xl text-purple-400">₹{module.price}</span>
                            <div className="flex gap-2">
                                <button onClick={() => handleEditModule(module)} className="p-2 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors" title="Edit">
                                    <Edit size={18} />
                                </button>
                                <button onClick={() => handleDeleteModule(module._id)} className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors" title="Delete">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

