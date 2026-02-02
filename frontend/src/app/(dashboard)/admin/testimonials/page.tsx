"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Loader2, Plus, Trash2, Upload, X, Pencil, MessageSquareQuote } from "lucide-react";
import { motion } from "framer-motion";

interface Testimonial {
    _id: string;
    name: string;
    role: string;
    content: string;
    image: string;
}

export default function AdminTestimonialsPage() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);

    // Form State
    const [editingId, setEditingId] = useState<string | null>(null);
    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState("");
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchTestimonials = async () => {
        try {
            const { data } = await axios.get("http://127.0.0.1:5000/api/testimonials");
            setTestimonials(data);
        } catch (error) {
            console.error("Failed to fetch testimonials", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const handleEdit = (t: Testimonial) => {
        setEditingId(t._id);
        setName(t.name);
        setRole(t.role);
        setContent(t.content);
        setImage(t.image);
        setIsAdding(true);
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
        if (!name || !image || !content || !role) {
            alert("Please fill all fields");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };

            const payload = { name, role, content, image };

            if (editingId) {
                await axios.put(
                    `http://127.0.0.1:5000/api/testimonials/${editingId}`,
                    payload,
                    { headers }
                );
            } else {
                await axios.post(
                    "http://127.0.0.1:5000/api/testimonials",
                    payload,
                    { headers }
                );
            }

            // Reset form
            setName("");
            setRole("");
            setContent("");
            setImage("");
            setEditingId(null);
            setIsAdding(false);
            fetchTestimonials();
        } catch (error) {
            console.error("Failed to save testimonial", error);
            if (!handleAuthError(error)) {
                alert("Failed to save testimonial");
            }
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://127.0.0.1:5000/api/testimonials/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchTestimonials();
        } catch (error) {
            console.error("Failed to delete testimonial", error);
            if (!handleAuthError(error)) {
                alert("Failed to delete testimonial");
            }
        }
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Manage Testimonials</h1>
                <button
                    onClick={() => {
                        setIsAdding(!isAdding);
                        if (isAdding) {
                            setEditingId(null);
                            setName("");
                            setRole("");
                            setContent("");
                            setImage("");
                        }
                    }}
                    className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                    {isAdding ? <X /> : <Plus />}
                    {isAdding ? "Cancel" : "Add Testimonial"}
                </button>
            </div>

            {isAdding && (
                <motion.form
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card border border-white/10 p-6 rounded-xl mb-8 max-w-2xl"
                    onSubmit={handleSubmit}
                >
                    <h2 className="text-xl font-bold mb-4">{editingId ? "Edit Testimonial" : "Add New Testimonial"}</h2>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-background border border-white/10 rounded-lg p-2 focus:ring-2 focus:ring-primary outline-none"
                                    placeholder="Student Name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Role/Designation</label>
                                <input
                                    type="text"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full bg-background border border-white/10 rounded-lg p-2 focus:ring-2 focus:ring-primary outline-none"
                                    placeholder="e.g. SDE at Google"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Photo</label>
                            <div className="flex items-center gap-4">
                                {image && (
                                    <img src={image} alt="Preview" className="w-16 h-16 rounded-full object-cover border border-white/20" />
                                )}
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploading}
                                    className="bg-secondary hover:bg-secondary/80 px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
                                >
                                    {uploading ? <Loader2 className="animate-spin w-4 h-4" /> : <Upload className="w-4 h-4" />}
                                    Upload Student Photo
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    hidden
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Testimonial Content</label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full bg-background border border-white/10 rounded-lg p-2 focus:ring-2 focus:ring-primary outline-none h-32"
                                placeholder="Write the student's review here..."
                            />
                        </div>

                        <button
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg w-full font-medium"
                        >
                            {editingId ? "Update Testimonial" : "Save Testimonial"}
                        </button>
                    </div>
                </motion.form>
            )}

            {loading ? (
                <Loader2 className="animate-spin w-8 h-8 mx-auto" />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((t) => (
                        <div key={t._id} className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6 relative group backdrop-blur-sm">
                            <div className="flex items-start gap-4 mb-4">
                                <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover border border-white/10" />
                                <div>
                                    <h3 className="font-bold text-lg leading-tight">{t.name}</h3>
                                    <p className="text-primary text-xs">{t.role}</p>
                                </div>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed mb-4">
                                &quot;{t.content}&quot;
                            </p>

                            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleEdit(t)}
                                    className="bg-blue-500/80 hover:bg-blue-600 text-white p-2 rounded-full"
                                >
                                    <Pencil size={14} />
                                </button>
                                <button
                                    onClick={() => handleDelete(t._id)}
                                    className="bg-red-500/80 hover:bg-red-600 text-white p-2 rounded-full"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {testimonials.length === 0 && !loading && (
                        <p className="text-gray-500 col-span-3 text-center py-8">No testimonials found.</p>
                    )}
                </div>
            )}
        </div>
    );
}
