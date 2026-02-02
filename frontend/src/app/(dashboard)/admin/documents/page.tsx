"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Loader2, Plus, Trash2, X, FileText, Upload, Save, Search, Download } from "lucide-react";

export default function KnowledgeBasePage() {
    const [docs, setDocs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchDocs = async () => {
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.get("http://127.0.0.1:5000/api/rag/documents", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDocs(data);
        } catch (error) {
            console.error("Failed to fetch docs", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocs();
    }, []);

    const handleDeleteDoc = async (filename: string) => {
        if (!confirm(`Delete ${filename}?`)) return;
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://127.0.0.1:5000/api/rag/documents/${filename}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchDocs();
        } catch (e) { console.error(e); alert("Failed to delete document"); }
    };

    const handleUploadDoc = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const token = localStorage.getItem("token");
            await axios.post("http://127.0.0.1:5000/api/rag/upload", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });
            fetchDocs();
            alert("Document uploaded!");
        } catch (e) {
            console.error(e);
            alert("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const filteredDocs = docs.filter(doc =>
        doc.filename.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
                        Knowledge Base (RAG)
                    </h1>
                    <p className="text-gray-400 mt-2">Manage documents used for AI context generation</p>
                </div>
                <div className="relative">
                    <input
                        type="file"
                        id="pdf-upload"
                        hidden
                        accept=".pdf"
                        onChange={handleUploadDoc}
                        disabled={uploading}
                    />
                    <label
                        htmlFor="pdf-upload"
                        className={`bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-full shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition-all transform hover:scale-105 cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {uploading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
                        {uploading ? "Uploading..." : "Upload PDF"}
                    </label>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-card border border-white/10 p-6 rounded-2xl shadow-xl flex items-center justify-between">
                    <div>
                        <h3 className="text-gray-400 text-sm font-medium mb-1">Total Documents</h3>
                        <p className="text-3xl font-bold text-white">{docs.length}</p>
                    </div>
                    <FileText size={40} className="text-white/10" />
                </div>
                <div className="bg-card border border-white/10 p-6 rounded-2xl shadow-xl flex items-center justify-between">
                    <div>
                        <h3 className="text-gray-400 text-sm font-medium mb-1">System Status</h3>
                        <p className="text-lg font-bold text-green-400">Active</p>
                    </div>
                    <div className="p-3 bg-green-500/10 rounded-full">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="mb-6 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                <input
                    type="text"
                    placeholder="Search documents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-card border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
                />
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-primary w-10 h-10" />
                </div>
            ) : filteredDocs.length === 0 ? (
                <div className="text-center py-20 bg-card/50 rounded-2xl border border-white/5 border-dashed">
                    <FileText size={48} className="mx-auto text-gray-600 mb-4" />
                    <h3 className="text-xl font-medium text-gray-400">No documents found</h3>
                    <p className="text-gray-500">Upload a PDF to get started with RAG features.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredDocs.map((doc: any, i) => (
                        <div key={i} className="bg-card hover:bg-card/80 border border-white/10 p-5 rounded-xl flex justify-between items-center group transition-all hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-1">
                            <div className="flex items-center gap-4 overflow-hidden">
                                <div className="bg-red-500/10 p-3 rounded-xl">
                                    <FileText size={24} className="text-red-400" />
                                </div>
                                <div className="overflow-hidden">
                                    <h3 className="font-bold text-white truncate w-48" title={doc.filename}>{doc.filename}</h3>
                                    <p className="text-xs text-gray-500 mt-1">PDF Document</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors" title="Download (Not Implemented)">
                                    <Download size={18} />
                                </button>
                                <button
                                    onClick={() => handleDeleteDoc(doc.filename)}
                                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
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
