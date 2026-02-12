"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Link from "next/link";
import { Loader2 } from "lucide-react";

interface MobileHeroImage {
    _id: string;
    imageUrl: string;
    redirectLink?: string;
}

export default function MobileHeroCarousel() {
    const [images, setImages] = useState<MobileHeroImage[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000"}/api/mobile-hero`);
                setImages(data);
            } catch (error) {
                console.error("Failed to fetch mobile hero images:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, []);

    useEffect(() => {
        if (images.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 4000); // 4 seconds per slide

        return () => clearInterval(interval);
    }, [images.length]);

    if (loading) return null; // Or a skeleton
    if (images.length === 0) return null;

    return (
        <div className="md:hidden w-full relative aspect-[16/9] overflow-hidden bg-gray-900 shadow-2xl mb-6">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 w-full h-full"
                >
                    {images[currentIndex].redirectLink ? (
                        <Link href={images[currentIndex].redirectLink} className="block w-full h-full">
                            <img
                                src={images[currentIndex].imageUrl}
                                alt="Hero"
                                className="w-full h-full object-cover"
                            />
                        </Link>
                    ) : (
                        <img
                            src={images[currentIndex].imageUrl}
                            alt="Hero"
                            className="w-full h-full object-cover"
                        />
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Dots Indicator */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {images.map((_, idx) => (
                    <div
                        key={idx}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? "bg-white w-4" : "bg-white/50"
                            }`}
                    />
                ))}
            </div>

            {/* Gradient Overlay for better text readability if needed later */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
        </div>
    );
}
