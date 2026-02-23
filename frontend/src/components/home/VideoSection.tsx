"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

export default function VideoSection() {
    const [videoData, setVideoData] = useState<any>(null);
    const [isPlaying, setIsPlaying] = useState(true);

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000"}/api/promo-video`);
                setVideoData(data);
            } catch (error) {
                console.error("Failed to fetch promo video", error);
            }
        };
        fetchVideo();
    }, []);

    if (!videoData || !videoData.isActive) return null;

    const getYouTubeId = (url: string) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const getEmbedUrl = (url: string) => {
        const id = getYouTubeId(url);
        if (!id) return "";
        // Autoplay requires mute=1 in most browsers for uninitiated playback
        return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&playlist=${id}&loop=1`;
    };

    return (
        <section className="py-12 md:py-20 relative overflow-hidden">
            {/* Background Animations */}
            <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-20 -left-20 w-72 md:w-96 h-72 md:h-96 bg-blue-500 rounded-full blur-[100px]"
                />
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-20 -right-20 w-72 md:w-96 h-72 md:h-96 bg-purple-500 rounded-full blur-[100px]"
                />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Stacked on mobile, side-by-side on desktop */}
                <div className="flex flex-col md:grid md:grid-cols-2 gap-6 md:gap-12 items-center">

                    {/* Text Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center md:text-left"
                    >
                        {/* Decorative accent line — mobile only */}
                        <div className="flex justify-center md:hidden mb-3">
                            <div className="w-10 h-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                        </div>
                        {/* Badge — mobile only */}
                        <span className="inline-block md:hidden px-3 py-1 mb-3 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-[10px] font-semibold tracking-widest uppercase">
                            🎬 Featured Video
                        </span>
                        <h2 className="text-2xl md:text-5xl font-extrabold text-white mb-3 md:mb-6 leading-tight">
                            {videoData.title}
                        </h2>
                        <p className="hidden md:block text-lg text-gray-300 mb-8">
                            {videoData.description}
                        </p>
                        <motion.a
                            href={videoData.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center gap-2 bg-white text-black px-5 py-2.5 md:px-6 md:py-3 rounded-full font-bold text-sm md:text-base shadow-lg hover:shadow-xl transition-shadow"
                        >
                            <Play size={16} className="fill-current md:w-5 md:h-5" /> Watch on YouTube
                        </motion.a>
                    </motion.div>

                    {/* Video wrapper */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="relative w-full"
                    >
                        {isPlaying ? (
                            <div className="aspect-video w-full rounded-xl md:rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                                <iframe
                                    src={getEmbedUrl(videoData.videoUrl)}
                                    title="Promotional Video"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="w-full h-full"
                                ></iframe>
                            </div>
                        ) : (
                            <div className="aspect-video w-full rounded-xl md:rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative group cursor-pointer" onClick={() => setIsPlaying(true)}>
                                <img
                                    src={`https://img.youtube.com/vi/${getYouTubeId(videoData.videoUrl) || ''}/maxresdefault.jpg`}
                                    alt="Video Thumbnail"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/640x360?text=Video+Thumbnail' }}
                                />
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                    <motion.div
                                        whileHover={{ scale: 1.2 }}
                                        className="w-14 h-14 md:w-20 md:h-20 bg-red-600 rounded-full flex items-center justify-center shadow-lg text-white"
                                    >
                                        <Play size={28} className="ml-1 md:ml-2 fill-current md:w-10 md:h-10" />
                                    </motion.div>
                                </div>
                            </div>
                        )}
                        {/* Decorative blob behind video */}
                        <div className="absolute -inset-3 md:-inset-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-2xl opacity-20 md:opacity-30 -z-10" />
                    </motion.div>

                </div>
            </div>
        </section>
    );
}

