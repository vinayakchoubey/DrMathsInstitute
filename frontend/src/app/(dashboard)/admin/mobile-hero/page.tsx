"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Trash2, Upload, Link as LinkIcon, Save, Image as ImageIcon } from "lucide-react";
import { toast } from "react-hot-toast";

interface MobileHeroImage {
    _id: string;
    imageUrl: string;
    redirectLink?: string;
    order: number;
    isActive: boolean;
}

export default function MobileHeroAdmin() {
    const [images, setImages] = useState<MobileHeroImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    // New Image State
    const [newImageUrl, setNewImageUrl] = useState("");
    const [newRedirectLink, setNewRedirectLink] = useState("");
    const [newOrder, setNewOrder] = useState(0);

    const fetchImages = async () => {
        try {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000"}/api/mobile-hero/admin`);
            setImages(data);
        } catch (error) {
            console.error("Failed to fetch images", error);
            toast.error("Failed to load images");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    const handleAddImage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newImageUrl) return toast.error("Image URL is required");

        try {
            setUploading(true);
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000"}/api/mobile-hero`, {
                imageUrl: newImageUrl,
                redirectLink: newRedirectLink,
                order: newOrder
            });
            toast.success("Image added successfully");
            setNewImageUrl("");
            setNewRedirectLink("");
            setNewOrder(0);
            fetchImages();
        } catch (error) {
            console.error("Failed to add image", error);
            toast.error("Failed to add image");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this image?")) return;
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000"}/api/mobile-hero/${id}`);
            toast.success("Image deleted");
            setImages(images.filter(img => img._id !== id));
        } catch (error) {
            console.error("Failed to delete", error);
            toast.error("Failed to delete image");
        }
    };

    const handleUpdate = async (id: string, updates: Partial<MobileHeroImage>) => {
        try {
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000"}/api/mobile-hero/${id}`, updates);
            toast.success("Updated successfully");
            fetchImages();
        } catch (error) {
            console.error("Failed to update", error);
            toast.error("Failed to update");
        }
    };

    if (loading) return <div className="p-8 text-white">Loading...</div>;

    return (
        <div className="p-6 max-w-6xl mx-auto text-white">
            <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Mobile Hero Management
            </h1>

            {/* Add New Image Form */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-12 backdrop-blur-sm">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Upload size={20} className="text-blue-400" />
                    Add New Hero Image
                </h2>
                <form onSubmit={handleAddImage} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Image URL</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newImageUrl}
                                    onChange={(e) => setNewImageUrl(e.target.value)}
                                    placeholder="https://example.com/image.jpg"
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Redirect Link (Optional)</label>
                            <input
                                type="text"
                                value={newRedirectLink}
                                onChange={(e) => setNewRedirectLink(e.target.value)}
                                placeholder="/courses/math-champion"
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Order Priority</label>
                            <input
                                type="number"
                                value={newOrder}
                                onChange={(e) => setNewOrder(Number(e.target.value))}
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={uploading}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
                        >
                            {uploading ? "Adding..." : <><Save size={18} /> Add Image</>}
                        </button>
                    </div>

                    {/* Preview */}
                    <div className="flex items-center justify-center bg-black/40 rounded-xl border border-white/10 aspect-video overflow-hidden relative">
                        {newImageUrl ? (
                            <img src={newImageUrl} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-gray-500 flex flex-col items-center">
                                <ImageIcon size={48} className="mb-2 opacity-50" />
                                <span>Image Preview</span>
                            </div>
                        )}
                    </div>
                </form>
            </div>

            {/* Existing Images List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {images.map((img) => (
                    <div key={img._id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden group">
                        <div className="aspect-video relative">
                            <img src={img.imageUrl} alt="Hero" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                <button
                                    onClick={() => handleUpdate(img._id, { isActive: !img.isActive })}
                                    className={`px-3 py-1 rounded-full text-xs font-bold ${img.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}
                                >
                                    {img.isActive ? "Active" : "Inactive"}
                                </button>
                                <button
                                    onClick={() => handleDelete(img._id)}
                                    className="p-2 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500 hover:text-white transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                        <div className="p-4 space-y-3">
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <LinkIcon size={14} />
                                <span className="truncate">{img.redirectLink || "No link"}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">Order: {img.order}</span>
                                <input
                                    type="number"
                                    defaultValue={img.order}
                                    onBlur={(e) => handleUpdate(img._id, { order: Number(e.target.value) })}
                                    className="w-16 bg-black/20 border border-white/10 rounded px-2 py-1 text-xs text-right focus:ring-1 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {images.length === 0 && !loading && (
                <div className="text-center text-gray-500 py-12">
                    No images found. Add some above!
                </div>
            )}
        </div>
    );
}
