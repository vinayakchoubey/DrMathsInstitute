"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Loader2, Save, Video as VideoIcon, Play } from "lucide-react";

export default function ManageVideoPage() {
    const [videoData, setVideoData] = useState({ title: "", description: "", videoUrl: "", isActive: true });
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const fetchVideo = async () => {
        try {
            const { data } = await axios.get("http://127.0.0.1:5000/api/promo-video");
            setVideoData(data);
        } catch (e) { console.error(e); }
        finally { setFetching(false); }
    };

    useEffect(() => {
        fetchVideo();
    }, []);

    const handleSaveVideo = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.put("http://127.0.0.1:5000/api/promo-video", videoData, config);
            alert("Video section updated!");
        } catch (e) {
            console.error(e);
            alert("Failed to update video section");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
            <div className="mb-8">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-pink-500">
                    Manage Promotional Video
                </h1>
                <p className="text-gray-400 mt-2">Update the featured video section on the home page</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-card border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2"></div>

                    <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
                        <VideoIcon className="text-red-500" /> Video Details
                    </h2>

                    {fetching ? (
                        <div className="flex justify-center py-10">
                            <Loader2 className="animate-spin" />
                        </div>
                    ) : (
                        <form onSubmit={handleSaveVideo} className="space-y-6">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Section Title</label>
                                <input
                                    className="bg-secondary/50 border border-white/10 rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-primary outline-none transition-all"
                                    value={videoData.title}
                                    onChange={e => setVideoData({ ...videoData, title: e.target.value })}
                                    required
                                    placeholder="e.g., Welcome to Dr. Maths"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Description</label>
                                <textarea
                                    className="bg-secondary/50 border border-white/10 rounded-xl px-4 py-3 w-full h-32 focus:ring-2 focus:ring-primary outline-none transition-all resize-none leading-relaxed"
                                    value={videoData.description}
                                    onChange={e => setVideoData({ ...videoData, description: e.target.value })}
                                    required
                                    placeholder="Short description of the video content..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">YouTube URL</label>
                                <input
                                    className="bg-secondary/50 border border-white/10 rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-primary outline-none transition-all"
                                    value={videoData.videoUrl}
                                    onChange={e => setVideoData({ ...videoData, videoUrl: e.target.value })}
                                    required
                                    placeholder="https://www.youtube.com/watch?v=..."
                                />
                            </div>

                            <div className="bg-secondary/30 p-4 rounded-xl border border-white/5 flex items-center justify-between">
                                <label htmlFor="isActive" className="text-gray-300 font-medium cursor-pointer select-none">Show on Home Page</label>
                                <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                                    <input
                                        type="checkbox"
                                        name="isActive"
                                        id="isActive"
                                        checked={videoData.isActive}
                                        onChange={e => setVideoData({ ...videoData, isActive: e.target.checked })}
                                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-300 transform checked:translate-x-full checked:border-green-400"
                                    />
                                    <label htmlFor="isActive" className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-300 ${videoData.isActive ? 'bg-green-400' : 'bg-gray-700'}`}></label>
                                </div>
                            </div>

                            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all transform hover:scale-[1.01] flex justify-center items-center gap-2">
                                {loading ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Save Changes</>}
                            </button>
                        </form>
                    )}
                </div>

                {/* Preview Section */}
                <div className="bg-card border border-white/10 rounded-2xl p-8 shadow-2xl flex flex-col items-center justify-center text-center">
                    <h3 className="text-gray-400 text-sm font-medium mb-4 uppercase tracking-wider">Live Preview</h3>
                    <div className="w-full aspect-video bg-black/40 rounded-xl overflow-hidden border border-white/5 relative group">
                        {videoData.videoUrl && videoData.videoUrl.includes("youtube.com") ? (
                            <iframe
                                className="w-full h-full"
                                src={`https://www.youtube.com/embed/${videoData.videoUrl.split('v=')[1]?.split('&')[0]}`}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                                <Play size={48} className="mb-2 opacity-50" />
                                <p>Enter a valid YouTube URL to preview</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .toggle-checkbox:checked {
                    right: 0;
                    border-color: #68D391;
                }
                .toggle-checkbox {
                    right: 0; 
                    top: 0;
                    border-color: #CBD5E0;
                 }
            `}</style>
        </div>
    );
}
